<?php

require __DIR__ . '/db.php';

$url = $_POST['url'];
$tags = explode(' ', $_POST['tags']);

$db = new DB();

$bookmark = new Bookmark($url, $tags);

$db->saveBookmark($bookmark);

header("Location: /");
die;
