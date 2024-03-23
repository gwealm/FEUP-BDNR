<?php

namespace DB\Models;

use DB\Models\Renderable;

class Tag extends DBModel implements Renderable {

    /**
     * The bookmarks tagged with this tag.
     * 
     * @var Bookmark[]
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

    protected function _save(\Predis\ClientInterface $client) {
        $tagKey = static::key($this->getId());
        
        $client->hset($tagKey, 'id', $this->getId());
        $client->hset($tagKey, 'name', $this->name);

        if (count($this->bookmarks) > 0) {
            $tagBookmarkKey = $tagKey->add('bookmarks');
            $tagBookmarkIDs = array_map(fn (Bookmark $bookmark) => $bookmark->getId(), $this->bookmarks);

            $client->sadd($tagBookmarkKey, $tagBookmarkIDs);
        }
    }
}