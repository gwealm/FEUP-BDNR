<?php
require_once dirname(__DIR__) . '/autoload.php';

use Lib\Auth;
use DB\DB;

$currentUser = Auth::getUser();

if ($currentUser === null) {
    header("Location: /");
    die;
}

$userId = $_GET['user'];

if ($userId !== $currentUser->getId()) {
    $currentUser->followedUsers[] = $userId;
    
    DB::save($currentUser);
}

header("Location: /");
die;