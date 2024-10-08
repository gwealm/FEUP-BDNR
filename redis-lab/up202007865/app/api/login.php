<?php
require_once dirname(__DIR__) . '/autoload.php';

use DB\DB;
use Lib\Auth;
use Lib\Session;

$username = $_POST['username'];
$password = $_POST['password'];

$user = Auth::login($username, $password);

if ($user !== null) {
    $session = new Session();

    $session->set('user', $user->getId());
}

header("Location: /");
die;