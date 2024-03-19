<?php

require __DIR__ . '/vendor/autoload.php';

use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;

Predis\Autoloader::register();

interface DBObject {
    static function key(string $id): string;

    public function _save(Predis\Client $client);

    public function render();
}

class Bookmark implements DBObject {
    private UuidInterface $id;
    private string $url;
    /**
     * @var string[]
     */
    private array $tags;

    /**
     * 
     */
    public function __construct(string $url, array $tags = array(), string $id = null) {
        
        $this->id = is_null($id) ? Uuid::uuid4() : Uuid::fromString($id);

        $this->url = $url;
        $this->tags = $tags;
    }

    static function key(string $id): string {
        return "bookmark:$id";
    }

    private function _saveFields(Predis\Client $db) {
        $key = Bookmark::key($this->id->toString());
        
        $db->hset($key, 'url', $this->url);
    }
    
    private function _saveTags(Predis\Client $db) {
        $key = Bookmark::key($this->id->toString());

        $bookmarkTagsKey = "$key:tags";

        $db->sadd($bookmarkTagsKey, $this->tags);

        foreach ($this->tags as $tag) { 
            $tagKey = "tag:$tag";

            $db->sadd($tagKey, $this->id);
        }
    }

    function _save(Predis\ClientInterface $db) {

        $db->zadd('bookmarks', [$this->id->toString() => time()]);

        $this->_saveFields($db);

        $this->_saveTags($db);
    }

    static function getFromDB(Predis\ClientInterface $db, string $id): Bookmark {
        $bookmarkKey = Bookmark::key($id);
        $bookmarkTagsKey = "$bookmarkKey:tags";

        $bookmarkUrl = $db->hget($bookmarkKey, 'url');

        // fetch bookmark tags
        $bookmarkTags = $db->smembers($bookmarkTagsKey);

        return new Bookmark($bookmarkUrl, $bookmarkTags, $id);
    }

    public function render() {
        ?>
        <article data-bookmark-id="<?= $this->id ?>" class="bookmark">
            <a href="<?= $this->url ?>"> <?= $this->url ?> </a>
            <ul class="tag-list">
                <?php foreach ($this->tags as $tag) {
                    ?>
                    <li><a href="./?tags=<?= $tag ?>"><?= $tag ?></a></li>
                    <?php
                } ?>
            </ul>
        </article>
        <?php
    }
}

class User implements DBObject {
    private string $username;

    /**
     * 
     */
    public function __construct(string $username) {
        $this->username = $username;
    }

    static function key(string $id): string {
        return "user:$id";
    }

    function _save(Predis\ClientInterface $db) {

    }

    static function getFromDB(Predis\ClientInterface $db, string $id): User {
        $userKey = User::key($id);

        $username = $db->hget($userKey, 'username');

        return new User($username);
    }
    public function render() {
        ?>
        <?php
    }

}

class DB {
    private Predis\Client $client;

    public function __construct() {
        $this->client = new Predis\Client();
    }

    public function saveBookmark(Bookmark $bookmark) {
        $bookmark->_save($this->client);
    }

    public function userExists(string $username): bool {        
        $userKey = User::key($username);

        return $this->client->exists($userKey) > 0;
    }

    public function login(string $username, string $password): ?User {        
        $userKey = User::key($username);

        function comparePassword(string $passwordCandidate, string $hashedPassword): bool {
            return password_verify($passwordCandidate, $hashedPassword);
        }

        $storedPassword = $this->client->hget($userKey, 'password');

        if (comparePassword($password, $storedPassword)) {
            return User::getFromDB($this->client, $username);
        }
    
        return null;
    }

    public function register(string $username, string $password): User {
        function hashPassword(string $password): string {
            return password_hash($password, PASSWORD_DEFAULT);
        }

        $userKey = User::key($username);

        $this->client->hset($userKey, 'online', true);
        $this->client->hset($userKey, 'username', $username);
        $this->client->hset($userKey, 'password', hashPassword($password));

        return new User($username);
    }

    public function setUserOnline(string $username) {
        $userKey = User::key($username);

        $this->client->hset($userKey, 'online', true);
    }


    /**
     * @return Bookmark[]
     */
    public function getLatestBookmarks(): array {

        // Get 15 latest bookmarks
        $bookmarkIds = $this->client->zrevrange( // see zrevrangebyscore
            'bookmarks', 
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

        return array_map(fn ($bookmarkId) => Bookmark::getFromDB($this->client, $bookmarkId), $bookmarkIds);
    }

    /**
     * @return Bookmark[]
     */
    public function getForTags(array $tags): array {
        $bookmarkIds = $this->client->sinter($tags);

        return array_map(fn ($bookmarkId) => Bookmark::getFromDB($this->client, $bookmarkId), $bookmarkIds);
    }
}



