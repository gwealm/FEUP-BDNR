<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/session.php';

$session = new Session();

if ($session->isAuthenticated()) {

    $username = $session->get('user');

    $db = new DB();

    $user = $db->getUser($username);

    $url = $_POST['url'];
    $tags = explode(' ', $_POST['tags']);
    
    $bookmark = new Bookmark($url, $tags);

    $user->bookmarks[] = $bookmark->id->toString();
    
    $db->saveBookmark($bookmark);
    $db->saveUser($user);
}

header("Location: /");
die;
