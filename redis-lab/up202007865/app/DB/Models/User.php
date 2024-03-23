<?php

namespace DB\Models;

use Predis\ClientInterface;

class User extends DBModel implements Renderable{

    /**
     * @var Bookmark[]
     */
    private array $bookmarks;
    public string $username;

    /**
     * @var User[]
     */
    private array $followedUsers;

    public function __construct(string $username, string $id = null) {
        parent::__construct($id);

        $this->username = $username;
        $this->bookmarks = [];
        $this->followedUsers = [];
    }

    public static function getFromDB(ClientInterface $client, string $id): static {

        $userKey = static::key($id);

        $username = $client->hget($userKey, 'username');

        $user = new User($username, $id);

        $bookmarkIds = $client->smembers($userKey->add("bookmarks"));

        foreach ($bookmarkIds as $bookmarkId) {
            $bookmark = Bookmark::getFromDB($client, $bookmarkId);
        
            $bookmark->author = $user;

            $user->bookmarks[] = $bookmark;
        }

        return $user;
    }


    protected function _save(\Predis\ClientInterface $client) {
        $userKey = static::key($this->getId());

        $client->hset($userKey, 'id', $this->getId());
        $client->hset($userKey, 'username', $this->username);

        if (count($this->bookmarks) > 0) {
            $userBookmarkKey = $userKey->add('bookmarks');
            $userBookmarkIDs = array_map(fn (Bookmark $bookmark) => $bookmark->getId(), $this->bookmarks);
    
            $client->sadd($userBookmarkKey, $userBookmarkIDs);
        }

        if (count($this->followedUsers) > 0) {
            $followedUsersKey = $userKey->add('followedUsers');
            $followedUserIDs = array_map(fn (User $user) => $user->getId(), $this->followedUsers);

            $client->sadd($followedUsersKey, $followedUserIDs);
        }
    }

    public function render() {
        ?>
        <span data-user-id="<?= $this->getId() ?>">By: <a href="" title="Click to follow <?= $this->username ?>"><?= $this->username ?></a></span>
        <?php
    }

}