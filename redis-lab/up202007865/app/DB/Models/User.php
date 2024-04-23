<?php

namespace DB\Models;

use Predis\ClientInterface;
use Ramsey\Uuid\Uuid;

class User extends DBModel implements Renderable{

    /**
     * @var Bookmark[]
     */
    public array $bookmarks;
    public string $username;

    /**
     * @var string[]
     */
    public array $followedUsers;

    public function __construct(string $username, string $id = null) {
        parent::__construct((is_null($id) ? Uuid::uuid4() : Uuid::fromString($id))->toString());

        $this->username = $username;
        $this->bookmarks = [];
        $this->followedUsers = [];
    }

    public static function getFromDB(ClientInterface $client, string $id): static {

        $userKey = static::key($id);

        $username = $client->hget($userKey, 'username');

        $user = new User($username, $id);

        $bookmarkIds = $client->zrevrange(
            $userKey->add("bookmarks"),
            0, 
            -1, // with -1 we get all the results
            [
                'WITHSCORES' => false,
                'LIMIT' => [
                    'OFFSET' => 0,
                    'COUNT' => 15
                ]
            ]
        );

        foreach ($bookmarkIds as $bookmarkId) {
            $bookmark = Bookmark::getFromDB($client, $bookmarkId);
        
            $bookmark->author = $user;

            $user->bookmarks[] = $bookmark;
        }

        $followedKey = $userKey->add("followedUsers");

        $user->followedUsers = $client->smembers($followedKey);

        return $user;
    }


    protected function _save(\Predis\ClientInterface $client) {
        $userKey = static::key($this->getId());

        $client->hset($userKey, 'id', $this->getId());
        $client->hset($userKey, 'username', $this->username);

        if (count($this->bookmarks) > 0) {
            $userBookmarkKey = $userKey->add('bookmarks');
            $userBookmarkIDs = array_map(function (Bookmark $bookmark) {
                // $bookmark->save($client);
                
                return $bookmark->getId();
            } , $this->bookmarks);

            $cansado = [];
            foreach ($userBookmarkIDs as $bookmarkId) {
                $cansado[$bookmarkId] = time();
            }

            $client->zadd((string)$userBookmarkKey, $cansado);
        }

        if (count($this->followedUsers) > 0) {
            $followedUsersKey = $userKey->add('followedUsers');

            $client->sadd($followedUsersKey, $this->followedUsers);
        }
    }

    public function render() {
        ?>
        <span data-user-id="<?= $this->getId() ?>">By: <a href="/api/follow.php?user=<?= $this->getId() ?>" title="Click to follow <?= $this->username ?>"><?= $this->username ?></a></span>
        <?php
    }

}