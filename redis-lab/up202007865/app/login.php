<?php 
    if (strcmp($_SERVER['REQUEST_METHOD'], "POST") === 0) {

        include_once __DIR__. '/session.php';
        include_once __DIR__. '/db.php';

        $username = $_POST['username'];
        $password = $_POST['password'];
        
        $db = new DB();
        $session = new Session();

        if (!$db->userExists($username)) {
            header("Location: /");
            die;
        }

        $user = $db->login($username, $password);

        if ($user !== null) {
            $session->set('user', $username);
        } 

        header("Location: /");
        die;

    } else if (strcmp($_SERVER['REQUEST_METHOD'], "GET") === 0) {
    ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .footer-links {
            display: flex;
            flex-direction: row;
            list-style-type: none;
            gap: 5px;
        }

        .footer-links>li::before {
            content: ' | ';
        }

        .footer-links>li:first-child::before {
            content: '';
        }
    </style>
</head>

<body>
    <?php 
        include __DIR__ . '/header.php';
    ?>
    <h2>Login:</h2>
    <form action="./login.php" method="POST" style="display: flex; flex-direction: column;">
        <label>
            Username:
            <input type="text" name="username" id="username" placeholder="Type your username...">
        </label>

        <label>
            Password:
            <input type="password" name="password" id="password" placeholder="Type your password...">
        </label>

        <input type="submit" value="Login">
    </form>

    <?php
        include __DIR__. '/footer.php';
    ?>
</body>

</html>
    <?php
    } else {
        header("Location: /");
        die;
    }
?>