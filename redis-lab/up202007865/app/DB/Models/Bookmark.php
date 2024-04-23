<?php

namespace DB\Models;

use DB\DB;
use DB\Models\Renderable;
use Predis\ClientInterface;
use Ramsey\Uuid\Uuid;

class Bookmark extends DBModel implements Renderable {

    public User $author;
    public string $url;

    /**
     * @var Tag[]
     */
    public array $tags;

    public function __construct(string $url, string $id = null) {
        parent::__construct((is_null($id) ? Uuid::uuid4() : Uuid::fromString($id))->toString());

        $this->url = $url;
        $this->tags = [];
    }

    public static function getFromDB(ClientInterface $client, string $id): static {
    
        $bookmarkKey = static::key($id);

        $url = $client->hget($bookmarkKey, 'url');

        // we are basically loaded from a User so we do not need to set the author here
        $bookmark = new Bookmark($url, $id);

        $tags = $client->smembers($bookmarkKey->add("tags"));

        foreach ($tags as $tagId) {
            $tag = Tag::getFromDB($client, $tagId);

            $tag->bookmarks ??= [];
            $tag->bookmarks[] = $id;

            $bookmark->tags[] = $tag;
        }

        return $bookmark;
    }
    
    public static function forTags(array $tags) {
        $client = DB::raw();

        $tagIds = array_map(fn($tagId) => (string)Tag::key($tagId)->add('bookmarks'), $tags);
        
        $bookmarkIds = $client->sinter($tagIds);

        $bookmarks = array_map(fn($bookmarkId) => Bookmark::getFromDB($client, $bookmarkId), $bookmarkIds);

        foreach ($bookmarks as $bookmark) {
            $bookmarkAuthorId = $client->get($bookmark->key($bookmark->getId())->add('author'));
            $bookmark->author = User::getFromDB($client, $bookmarkAuthorId);
        }

        return $bookmarks;
    }

    protected function _save(\Predis\ClientInterface $client) {
        $bookmarkKey = static::key($this->getId());

        $client->hset($bookmarkKey, 'id', $this->getId());
        $client->hset($bookmarkKey, 'url', $this->url);

        $bookmarkAuthor = $bookmarkKey->add('author');
        $client->set($bookmarkAuthor, $this->author->getId());
        $authorBookmarksKey = User::key($this->author->getId())->add('bookmarks');
        $client->zadd($authorBookmarksKey, [$this->getId() => time()]);

        if (count($this->tags) > 0) {
            $bookmarkTagKey = $bookmarkKey->add('tags');
            $bookmarkTagIDs = array_map(function (Tag $tag) use ($client) {
                $tag->save($client);
                
                return $tag->getId();
            } , $this->tags);

            $client->sadd($bookmarkTagKey, $bookmarkTagIDs);
        }
    }

    public function render() {
        ?>
        <article data-bookmark-id="<?= $this->getId() ?>" class="bookmark">
            <a href="<?= $this->url ?>"> <?= $this->url ?> </a>
            <?php $this->author->render(); ?>
            <ul class="tag-list">
                <?php foreach ($this->tags as $tag) {
                    ?>
                    <li> <?php $tag->render(); ?> </li>
                    <?php 
                } ?>
            </ul>
        </article>
        <?php
    }
}