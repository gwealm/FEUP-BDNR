<?php
require_once dirname(__DIR__) . '/autoload.php';

use DB\DB;
use DB\Models\Bookmark;
use DB\Models\Tag;
use Lib\Auth;

if (Auth::isAuthenticated()) {
    $user = Auth::getUser();

    $url = $_POST['url'];
    $tags = explode(' ', $_POST['tags']);
    
    $bookmark = new Bookmark($url);
    
    $bookmark->author = $user;

    $user->bookmarks[] = $bookmark;

    foreach ($tags as $tagName) {
        $tag = new Tag($tagName);

        $bookmark->tags[] = $tag;
        $tag->bookmarks[] = $bookmark->getId();
    }

    DB::save($bookmark);
}

header("Location: /");
die;
