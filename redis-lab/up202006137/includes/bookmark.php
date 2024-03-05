<?php
    class Bookmark {

        private \Predis\Client $client;
        private string $id;
        private string $url;

        /**
         * @var string[] $tags
         */
        private array $tags;

        public function __construct(\Predis\Client $client, string $url, array $tags =  array()) {
            $this->client = $client;
            $this->id = md5($url);
            $this->url = $url;
            $this->tags = $tags;
        }

        public static function getFromDB(\Predis\Client $client, string $id) : Bookmark {

            $key = Bookmark::key($id);

            if (!$client->exists($key))
                throw new Exception("Bookmark not found");

            $url = $client->hget(Bookmark::key($id), "url");
            $tags = Bookmark::getTags($client, $id);

            return new Bookmark($client, $url, $tags);
        }

        static function key(string $id) : string {
            return "bookmark:$id";
        }

        static function getBookmarksByTag(\Predis\Client $client, array $tags) : array {
            if (empty($tags))
                return array();

            $tags = array_map(fn ($tag) => "tag:$tag", $tags);

            $selectedTags = $client->sinter($tags);

            return array_map( fn ($id) => Bookmark::getFromDB($client, $id), $selectedTags);
        }

        static function getRecentBookmarks(\Predis\Client $client, int $count = 15) : array {
            $bookmarks = $client->zrevrange("bookmarks", 0, $count);

            return array_map( fn ($id) => Bookmark::getFromDB($client, $id), $bookmarks);
        }

        public function save() : void {
            $key = Bookmark::key($this->id);

            $this->client->zadd("bookmarks", time(), $this->id);

            $this->client->hset($key, "url", $this->url);

            $this->saveTags();
        }

        public function next_bookmark_id() {
            $next_id = $this->client->get('next_bookmark_id');

            $next_id ??= 1;

            $this->client->incr('next_bookmark_id');

            return $next_id;
        }


        private function saveTags() : void {
            $key = Bookmark::key($this->id);

            $this->client->sadd("$key:tags", $this->tags);

            foreach ($this->tags as $tag)
                $this->client->sadd("tag:$tag", $this->id);   
        }

        static public function getTags(\Predis\Client $client, string $id) : array {
            $key = Bookmark::key($id);

            return $client->smembers("$key:tags");
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
?>