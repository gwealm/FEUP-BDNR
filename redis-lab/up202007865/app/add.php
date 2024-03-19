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
        include __DIR__ . 'header.php';
    ?>
    <h2>Add new bookmark:</h2>
    <form action="./bookit.php" method="post" style="display: flex; flex-direction: column;">
        <label>
            URL:
            <input type="url" name="url" id="url" placeholder="URL to bookmark">
        </label>

        <label>
            Tags (list):
            <input type="text" name="tags" id="tags" placeholder="Space-separated tags in lowercase">
        </label>

        <input type="submit" value="Add (or update) bookmark">
    </form>

    <?php
        include __DIR__. '/footer.php';
    ?>
</body>

</html>