<?php

    require __DIR__ . "/vendor/autoload.php";
    Predis\Autoloader::register();

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Bookit!</title>
    </head>
    <style>
        
        #tags {
            padding: 0;
            margin-top: 5px;
            margin-bottom: 10px;
        }

        #tag_link {
            display: inline;
            margin-right: 5px;
        }

        #footer {
            padding: 0;
            margin: 0;
        }

        #footer_link {
            display: inline;
            margin-right: 10px;
        }
    
    </style>
    <body>
    
        <h1>Bookit!</h1>    

        <?php if (!array_key_exists('tags', $_GET)) { ?>
                <h2>Latest Bookmarks</h2>
        <?php } ?>
        
        <hr>
            <ul>
            
                <?php

                    $redis = new Predis\Client();
                    try {

                        if (!array_key_exists('tags', $_GET)) {
                    
                            $bookmark_ids = array_slice($redis->zrevrange('bookmarks', 0, -1), 0, 15);
                            foreach ($bookmark_ids as $id) {

                                $url = $redis->hget('bookmarks:' . $id, 'url');
                                $tags = $redis->smembers('bookmarks:' . $id . ":tags");

                                ?>
                                <li>
                                    <a href="<?php echo $url; ?>"> <?php echo $url; ?> </a>

                                    <ul id="tags">
                                        <?php
                                            echo "[ ";
                                            foreach ($tags as $tag) { ?>
                                                <li id="tag_link">
                                                    <a href="/?tags=<?php echo $tag ?>"> <?php echo $tag ?></a>
                                                </li>
                                            <?php }
                                            echo " ]";
                                        ?>
                                    </ul>

                                </li>
                                <?php
                                
                            }

                        } else {
                            
                            $found = false;

                            $input_tags = explode(',', $_GET['tags']);
                            $possible_bookmarks = $redis->smembers("tag:" . $input_tags[0]);

                            foreach ($possible_bookmarks as $id) {
                                
                                $url = $redis->hget('bookmarks:' . $id, 'url');
                                $tags = $redis->smembers('bookmarks:' . $id . ":tags");

                                if (!array_diff($input_tags, $tags)) {

                                    $found = true;

                                    ?>
                                     <li>
                                         <a href="<?php echo $url; ?>"> <?php echo $url; ?> </a>
                                         <ul id="tags">
                                            <?php
                                                echo "[ ";
                                                foreach ($tags as $tag) { ?>
                                                    <li id="tag_link">
                                                        <a href="?tags=<?php echo $tag ?>"> <?php echo $tag ?></a>
                                                    </li>
                                                <?php }
                                            echo " ]";
                                        ?>
                                    </ul>
                                    </li>
                                    <?php

                                }

                            }

                            if (!$found) { ?> <h2>No bookmarks found for those tags!</h2> <?php }


                        }

                    } catch (Exception $e) { print $e->getMessage(); }

                ?>

            </ul>
        <hr>

        <ul id="footer">
            <li id="footer_link">
                <a href="/">Home!</a>
            </li>
            <li id="footer_link">
                <a href="./add.html">Add another bookmark!</a>
            </li>
        </ul>


    </body>
</html>