
<?php 

    include_once __DIR__ . '/session.php';

    $session = new Session();
?>

<h1>Bookit!</h1>
<?php if (!$session->isAuthenticated()) {?>
<div class="auth">
    <span><a href="./login.php">Login</a></span>
    <span><a href="./register.php">Register</a></span>
</div>
<?php } else {

    $username = $session->get('user');

?>
<div>
    <span><?= $username ?></span>
    <span><a href="./logout.php">Logout</a></span>
</div>
<?php } ?>