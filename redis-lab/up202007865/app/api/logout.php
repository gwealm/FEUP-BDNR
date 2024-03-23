<?php
require_once dirname(__DIR__) . '/autoload.php';

use Lib\Auth;

Auth::logout();

header("Location: /");
die;