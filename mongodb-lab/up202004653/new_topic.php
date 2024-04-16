<?php

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/topic.php';

if (invalidRequest()) header('Location: /');

$topic = new Topic($_POST['title'], $_POST['body'], $_POST['author']);
$result = $topic->save();

if ($result->getInsertedCount() == 0) 
    header('Location: /');
else 
    header(sprintf("Location: /?topic=%s", $result->getInsertedId()));

function invalidRequest() {

    $keysToCheck = ['title', 'body', 'author'];
    
    foreach ($keysToCheck as $key) {
        if (!array_key_exists($key, $_POST)) return true; 
    }
    
    return false;

}


?>