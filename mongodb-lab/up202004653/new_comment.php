<?php

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/topic.php';

if (invalidRequest()) header('Location: /');

$result = Topic::updateComment(
            $_POST['topic'],
            $_POST['comment'], 
            $_POST['author']
);


if ($result->getModifiedCount() == 0) header('Location: /');
else header(sprintf("Location: /?topic=%s", $_POST['topic']));

function invalidRequest() {
    
    $keysToCheck = ['topic', 'comment', 'author'];
    
    foreach ($keysToCheck as $key) {
        if (!array_key_exists($key, $_POST)) return true; 
    }
    
    return false;

}


?>