<?php

namespace Lib;

require_once dirname(__DIR__) . '/autoload.php';

use DB\DB;
use DB\Models\Key;
use DB\Models\User;
use Error;
use Lib\Password;
use TypeError;

class Auth {

    private static function usernameExists(\Predis\ClientInterface $client, string $username): bool {
        $userIds = $client->keys(User::keyPrefix()->add('*'));

        $usernames = array_map(function ($id) use ($client) {
            return $client->hget($id, 'username');
        }, $userIds);

        return in_array($username, $usernames);
    }

    public static function register(string $username, string $password): ?User {
        $db = DB::instance();
        $dbClient = $db->raw();

        $userExists = static::usernameExists($dbClient, $username);

        if ($userExists) return null;

        $user = new User($username);
        $db->save($user);

        // FIXME: we should not need direct access to the DB client.
        $dbClient->hset(User::key($user->getId()), 'password', Password::hash($password));

        return $user;
    }

    public static function login(string $username, string $password): ?User {
        $db = DB::instance();
        $dbClient = $db->raw();

        $userExists = static::usernameExists($dbClient, $username);

        if (!$userExists) return null;

        $userIds = $dbClient->keys(User::keyPrefix()->add('*'));

        foreach ($userIds as $userId) {

            $candidateUsername = $dbClient->hget($userId, 'username');

            if ($candidateUsername !== $username) continue;

            $storedPassword = $dbClient->hget($userId, 'password');

            if (Password::verify($password, $storedPassword)) {
                $user = $db->get($userId);

                if ($user === null) {

                    $id = explode(Key::SEPARATOR, $userId)[1];

                    $user = new User($username, $id);
            
                    $db->save($user);
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
        $db = DB::instance();

        $session = new Session();

        $userKey = User::key($session->get('user'));

        return $db->get($userKey);
    }

    public static function isAuthenticated(): bool {
        $session = new Session();

        return $session->isAuthenticated();
    }
}