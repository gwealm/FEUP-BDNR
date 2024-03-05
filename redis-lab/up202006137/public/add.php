<?php

    require __DIR__ . '/../includes/bookmark.php';
    require __DIR__ . '/../includes/db.php';

    if (empty($_POST)) {
        header('Location: index.php');
        die('URL is required');
    }

    $url = $_POST['url'];
    $tags = explode(',', $_POST['tags']);

    $db = new Database();
    $bookmark = new Bookmark($db->get_client(), $url, $tags);

    var_dump($bookmark);

    $bookmark->save();

    var_dump($bookmark);

    // header('Location: index.php');
    // exit();
?>