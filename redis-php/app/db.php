<?php

require __DIR__ . '/vendor/autoload.php';

use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;

Predis\Autoloader::register();

class Bookmark {
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

class DB {
    private Predis\Client $client;

    public function __construct() {
        $this->client = new Predis\Client();
    }

    public function saveBookmark(Bookmark $bookmark) {
        $bookmark->_save($this->client);
    }

    /**
     * @return Bookmark[]
     */
    public function getLatestBookmarks(): array {

        // Get 15 latest bookmarks
        $bookmarkIds = $this->client->zrevrange( // see zrevrangebyscore
            'bookmarks', 
            0, 
            -1, // with -1 the results get sorted in reverse
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



