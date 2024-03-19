<?php

    require_once "./session.php";
    $session = new Session();
    
    if ($session->isAuthenticated())
        $session->set('user', null);
        
    header('Location: /');
    die;
?>