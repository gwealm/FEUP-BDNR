<?php

namespace DB\Models;

use DB\DB;
use DB\Models\Renderable;
use Predis\ClientInterface;

class Bookmark extends DBModel implements Renderable {

    public User $author;
    private string $url;

    /**
     * @var Tag[]
     */
    public array $tags;

    public function __construct(string $url, string $id = null) {
        parent::__construct($id);

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
        
            $bookmark->tags[] = $tag;
        }

        return $bookmark;
    }
    
    public static function forTags(array $tags) {
        $client = DB::raw();

        


    }

    protected function _save(\Predis\ClientInterface $client) {
        $bookmarkKey = static::key($this->getId());

        $client->hset($bookmarkKey, 'id', $this->getId());
        $client->hset($bookmarkKey, 'url', $this->url);

        $bookmarkAuthor = $bookmarkKey->add('author');
        $client->set($bookmarkAuthor, $this->author->getId());
        $authorBookmarksKey = User::key($this->author->getId())->add('bookmarks');
        $client->sadd($authorBookmarksKey, $this->getId());

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