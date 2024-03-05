<?php

    require __DIR__ . "/vendor/autoload.php";
    Predis\Autoloader::register();

    if (empty($_POST)) {
        header('Location: ./index.php');
        die();
    }

    $redis = new Predis\Client();
    try {

        $next_id = $redis->get('next_bookmark_id');
        $url = $_POST['url'];
        $tags = explode(' ', $_POST['tags']);

        // add bookmark and tags
        $redis->zadd('bookmarks', time(), $next_id);
        $redis->hset('bookmarks:' . $next_id, 'url', $url);
        $redis->sadd('bookmarks:' . $next_id . ':tags', $tags);
        
        // add tags and associate bookmarks
        foreach ($tags as $tag) { $redis->sadd('tag:' . $tag, array($next_id)); }
        
        $redis->incr('next_bookmark_id');
        header('Location: ./index.php');

    } catch (Exception $e) { print $e->getMessage(); }
    

?>