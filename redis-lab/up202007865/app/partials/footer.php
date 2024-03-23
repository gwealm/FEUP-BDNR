<footer>
    <nav>
        <ul class="footer-links">
            <li><a href=".">Home</a></li>
            <?php
                use \Lib\Session;

                $session = new Session();

                if ($session->isAuthenticated()) {
            ?>        
            <li><a href="./add.php">Add another bookmark!</a></li>
            <?php } ?>
        </ul>
    </nav>
</footer>