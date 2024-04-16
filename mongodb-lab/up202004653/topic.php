<?php

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/commons/topics.tpl.php';

class Topic {

    public string $title;
    public string $body;
    public string $author;

    public function __construct($title, $body, $author) {
        
        $this->title = $title;
        $this->body = $body;
        $this->author = $author;

    }

    public function save() {

        try {

            $mongo = new MongoDB\Client();
            $collection = $mongo->selectCollection('miniforum', 'topics');

            $new_topic = [
                'title' => $this->title,
                'body' => $this->body,
                'author' => $this->author,
                'comments' => []
            ];

            return $collection->insertOne($new_topic);

        } catch (Exception $e) { print $e->getMessage(); }

    }

    public static function updateComment($id, $comment, $author) {

        try {

            $mongo = new MongoDB\Client();
            $collection = $mongo->selectCollection('miniforum', 'topics');
            
            $new_comment = [
                'text' => $comment,
                'author' => $author
            ];

            $topic = ['_id' => new MongoDB\BSON\ObjectId($id)];
            $update = ['$push' => ['comments' => $new_comment]];

            return $collection->updateOne($topic, $update);

        } catch (Exception $e) { print $e->getMessage(); }

    }

    public static function listAllTopics() {

        try {

            $mongo = new MongoDB\Client();
            $collection = $mongo->selectCollection('miniforum', 'topics');
            $topics = $collection->find();

            drawAllTopics($topics);

        } catch (Exception $e) { print $e->getMessage(); }

    }

    public static function listTopic($id) {

        try {

            $mongo = new MongoDB\Client();
            $collection = $mongo->selectCollection('miniforum', 'topics');
            $topic = $collection->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);

            drawTopic($topic);

        } catch (Exception $e) { print $e->getMessage(); }

    }

}

?>