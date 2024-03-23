<?php
require __DIR__ . '/autoload.php'
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
        include __DIR__ . '/partials/header.php';
    ?>
    <h2>Register:</h2>
    <form action="./api/register.php" method="POST" style="display: flex; flex-direction: column;">
        <label>
            Username:
            <input type="text" name="username" id="username" placeholder="Type your username...">
        </label>

        <label>
            Password:
            <input type="password" name="password" id="password" placeholder="Type your password...">
        </label>

        <input type="submit" value="Register">
    </form>

    <?php
        include __DIR__. '/partials/footer.php';
    ?>
</body>

</html>
