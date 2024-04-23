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
    public array $bookmarks;


    public function __construct(string $name) {
        parent::__construct($name);

        $this->bookmarks = [];
    }

    public function render() {

        $tagId = $this->getId();

        ?>
        <a href="./?tags=<?= $tagId ?>" data-tag-id="<?= $tagId ?>"><?= $tagId ?></a>
        <?php
    }

    public static function getFromDB(ClientInterface $client, string $name): static {        
        $tag = new Tag($name);
        
        $tagKey = static::key($tag->getId());

        $bookmarks = $client->smembers($tagKey->add("bookmarks"));

        $tag->bookmarks = $bookmarks;

        return $tag;
    }

    protected function _save(\Predis\ClientInterface $client) {
        $tagKey = static::key($this->getId());
        
        if (count($this->bookmarks) > 0) {
            $tagBookmarkKey = $tagKey->add('bookmarks');

            $temp = $client->sadd($tagBookmarkKey, $this->bookmarks);
        }
    }
}