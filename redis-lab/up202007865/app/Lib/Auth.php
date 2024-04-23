<?php

namespace Lib;

require_once dirname(__DIR__) . '/autoload.php';

use DB\DB;
use DB\Models\Key;
use DB\Models\User;
use Lib\Password;

class Auth {

    private static function usernameExists(\Predis\ClientInterface $client, string $username): bool {
        $userIds = $client->keys(User::keyPrefix()->add('*'));

        // HACK: this is so hacky but whatever
        $userIds = array_filter($userIds, function ($candidateUserId) {
            return substr_count($candidateUserId, ':') === 1;
        });

        $usernames = array_map(function ($id) use ($client) {
            return $client->hget($id, 'username');
        }, $userIds);

        return in_array($username, $usernames);
    }

    public static function register(string $username, string $password): ?User {
        $dbClient = DB::raw();

        $userExists = static::usernameExists($dbClient, $username);

        if ($userExists) return null;

        $user = new User($username);
        DB::save($user);

        // FIXME: we should not need direct access to the DB client.
        $dbClient->hset(User::key($user->getId()), 'password', Password::hash($password));

        return $user;
    }

    public static function login(string $username, string $password): ?User {
        $dbClient = DB::raw();

        $userExists = static::usernameExists($dbClient, $username);

        if (!$userExists) return null;

        $userIds = $dbClient->keys(User::keyPrefix()->add('*'));

        foreach ($userIds as $userId) {

            if (substr_count($userId, ':') > 1) continue; // Compound key

            $candidateUsername = $dbClient->hget($userId, 'username');

            if ($candidateUsername !== $username) continue;

            $id = explode(Key::SEPARATOR, $userId)[1];

            $storedPassword = $dbClient->hget($userId, 'password');

            if (Password::verify($password, $storedPassword)) {
                $user = DB::get(User::class, $id);

                if ($user === null) {
                    $user = new User($username);
            
                    DB::save($user);
                } 
                
                return $user;
            }
        }

        return null;
    }

    public static function logout() {
        $session = new Session();

        $session->set('user', null);
    }

    public static function getUser(): ?User {
        $session = new Session();

        $userId = $session->get('user');

        return DB::get(User::class, $userId);
    }

    public static function isAuthenticated(): bool {
        $session = new Session();

        return $session->isAuthenticated();
    }
}