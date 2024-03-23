<?php

namespace DB\Models;

use DB\Models\Renderable;

class Bookmark extends DBModel implements Renderable {

    private User $author;
    private string $url;

    /**
     * @var Tag[]
     */
    private array $tags;

    public function __construct(string $url, string $id = null) {
        parent::__construct($id);

        $this->url = $url;
        $this->tags = [];
    }

    protected function _save(\Predis\ClientInterface $client) {
        $bookmarkKey = static::key($this->getId());

        $client->hset($bookmarkKey, 'id', $this->getId());
        $client->hset($bookmarkKey, 'url', $this->url);

        $bookmarkAuthor = $bookmarkKey->add('author');
        $client->set($bookmarkAuthor, $this->author->getId());

        if (count($this->tags) > 0) {
            $bookmarkTagKey = $bookmarkKey->add('tags');
            $bookmarkTagIDs = array_map(fn (Tag $tag) => $tag->getId(), $this->tags);

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