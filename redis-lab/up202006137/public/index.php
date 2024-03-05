<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bookit</title>
    <style>
        .bookmark {
            display: flex;
            flex-direction: column;

        }

        .tag-list {
            display: inline-flex;
            gap: 0.2em;
            list-style-type: none;
            padding: 0;
        }

        .tag-list::before {
            content: "[";
        }


        .tag-list::after {
            content: "]";
        }

        footer > ul {
            display: flex;
            flex-direction: row;
            justify-content: start;
            list-style-type: none;
            gap: 0.2em;
            padding: 0;
        }

        footer > ul > li > a::before {
            content: "|";
        }

        footer > ul > li:first-child > a:before {
            content: "";
        }
        
    </style>
</head>
<body>
    <?php
        require __DIR__ . '/../includes/db.php';
        require __DIR__ . '/../includes/bookmark.php';

        $db = new Database();
        $client = $db->get_client();


    ?>
    <header>
        <h1>Bookit!</h1>
        <h2>Latest Bookmarks</h2>
        <hr>
    </header>    
    <main>
        <?php
            if (isset($_GET['tags'])) {
                $tags = explode(',', $_GET['tags']);
                array_map(fn ($tag) => "tags: $tag", $tags);
                $bookmarks = Bookmark::getBookmarksByTag($client, $tags);
            } else {
                $bookmarks = Bookmark::getRecentBookmarks($client);
            }

            if (empty($bookmarks))
                echo "<p>No bookmarks found</p>";

            foreach ($bookmarks as $bookmark)
                $bookmark->render();
        ?>
    </main>
    <footer>
        <hr>
        <ul>
            <li><a class="footer-links" href="index.php">Home</a></li>
            <li><a class="footer-links" href="add.html">Add another bookmark!</a></li>
        </ul>
    </footer>
</body>
</html>