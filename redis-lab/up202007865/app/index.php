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
        .bookmark {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        }

        .bookmark-list {
            padding: 20px;
            border-top: 1px  solid  gray;
            border-bottom: 1px solid  gray;
        }

        .bookmark-list > .bookmark {
            margin: 2px 0;
        }

        .bookmark-list > .bookmark > .tag-list {
            display: inline-flex;
            list-style-type: none;
            gap: 3px;
            padding: 0;
        }

        .bookmark-list > .bookmark > .tag-list::after {
            content: ' ] ';
        }

        .bookmark-list > .bookmark > .tag-list::before {
            content: ' [ ';
        }

        .footer-links {
            display: flex;
            flex-direction: row;
            list-style-type: none;
            gap: 5px;
        }

        .footer-links > li::before {
            content: ' | ';
        }

        .footer-links > li:first-child::before  {
            content: '';
        }

        .auth {
            display: flex;
            gap: 10px;
        }

    </style>
</head>
<body>
    <?php
        include __DIR__ . '/partials/header.php';

        use DB\DB;
        use Lib\Auth;
        use DB\Models\Bookmark;
use DB\Models\User;

        if (!Auth::isAuthenticated()) {
            ?>
            <h2>You are not logged in.</h2>

            <a href="./login.php">Sign in</a> or <a href="./register.php">create an account</a> to create and see your bookmarks.
            <?php
        } else {    
            $user = Auth::getUser();

            /**
             * @var Bookmark[]
             */
            $bookmarks = [];
    
            if (count($_GET) !== 0 && isset($_GET['tags'])) {
                $tags = $_GET['tags']
    
                ?> 
                <h2>Bookmarks for '<?= $tags ?>':</h2>
                <?php
    
                $tags = explode(',', $tags);
    
                $bookmarks = Bookmark::forTags($tags);
            } else {
                ?> 
                <h2>Your latest bookmarks:</h2>
                <?php
                $bookmarks = $user->bookmarks;
            }
        
            if (count($bookmarks) === 0) {
                ?>
                <h3>Sorry, you don't have any bookmarks yet!</h3>
                <?php
            } else {
                ?>
                <ul class="bookmark-list">
                <?php
                    foreach ($bookmarks as $bookmark) {
                        $bookmark->render();
                    }
                ?>
                </ul>
                <?php
            }

            if (count($user->followedUsers) > 0) {
                ?>
                <section>
                    <h2>From people you follow</h2>
                    <ul class="bookmark-list">
                    <?php
                        foreach ($user->followedUsers as $userId) {
                            $followedUser = User::getFromDB(DB::raw(), $userId);
                            
                            foreach ($followedUser->bookmarks as $bookmark) {
                                $bookmark->render();
                            }
                        }
                    ?>
                    </ul>
                </section>
                <?php
            }
        }
    
        include __DIR__. '/partials/footer.php';
    ?>
</body>
</html>