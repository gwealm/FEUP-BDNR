<?php

namespace DB\Models;

use DB\Models\Renderable;
use Predis\ClientInterface;

class Tag extends DBModel implements Renderable {

    /**
     * The bookmarks tagged with this tag.
     * 
     * @var string[]
     */
    private array $bookmarks;

    private string $name;

    public function __construct(string $name, string $id = null) {
        parent::__construct($id);

        $this->name = $name;
        $this->bookmarks = [];
    }

    public function render() {
        ?>
        <a href="./?tags=<?= $this->name ?>" data-tag-id="<?= $this->getId() ?>"><?= $this->name ?></a>
        <?php
    }

    public static function getFromDB(ClientInterface $client, string $id): static {
        $tagKey = static::key($id);

        $name = $client->hget($tagKey, 'name');

        $tag = new Tag($name, $id);

        $bookmarks = $client->smembers($tagKey->add("bookmarks"));

        $tag->bookmarks = $bookmarks;

        return $tag;
    }

    protected function _save(\Predis\ClientInterface $client) {
        $tagKey = static::key($this->getId());
        
        $client->hset($tagKey, 'id', $this->getId());
        $client->hset($tagKey, 'name', $this->name);

        if (count($this->bookmarks) > 0) {
            $tagBookmarkKey = $tagKey->add('bookmarks');

            $client->sadd($tagBookmarkKey, $this->bookmarks);
        }
    }
}