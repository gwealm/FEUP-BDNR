<?php

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/topic.php';
require __DIR__ . '/commons/header.tpl.php';


drawHeader();

if (array_key_exists('topic', $_GET)) 
    Topic::listTopic($_GET['topic']);  
else 
    Topic::listAllTopics(); 

?>