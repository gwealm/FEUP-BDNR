<?php

function drawAllTopics($topics) { ?>

<style>
    ul.topics { list-style: none; }
    ul.topics li:before { color: #000; content: "\27bd \0020"; }
    li.topic_link { padding-bottom: 5px;}
</style>

<h2>Topics</h2>
<ul class="topics">

<?php foreach ($topics as $topic) { ?>

    <li class="topic_link">
        <a href="/?topic=<?php echo $topic->_id ?>">
            <?php echo $topic->title ?> 
        </a> 
        <?php 
        
            $num_comments = sizeof($topic->comments);
            if ($num_comments != 0) echo "<i>&nbsp;(" . $num_comments . " comments)</i>";

        ?>
    </li>

<?php } ?>

</ul>
<br>
<hr>

<?php } 

function drawTopic($topic) {

    drawTopicText($topic);
    drawCommentSection($topic);

} 

function drawTopicText($topic) {

    echo sprintf("<h2>%s</h2><br>", $topic->title);
    echo sprintf("<p>%s</p><br>", $topic->body);
    echo sprintf("<p>-- %s</p><br>", $topic->author);
    echo "<hr>";

}

function drawCommentSection($topic) { ?>

    <style>
        ul.comments { list-style: none; }
        ul.comments li:before { color: #000; content: "\27bd \0020"; }
        li.comment { padding-bottom: 5px;}
    </style>

    <?php 
    echo "<h3>Comments</h3>";

    if (count($topic->comments) == 0) echo "<i> - No comments available</i> <br><br>";
    else { 
        echo '<ul class="comments">';
        foreach ($topic->comments as $comment) { ?>
    
            <li class="comment">
                <?php echo $comment->text ?> | <?php echo $comment->author ?>
            </li>

        <?php }
        echo "</ul><br>";
    }
    ?> 

    <form action="/new_comment.php" method="POST">
        
        <input type="hidden" name="topic" value="<?php echo $topic->_id?>">

        <textarea name="comment" cols="60" rows="5" placeholder="Any comment to add?" required></textarea><br><br>
        <label for="author">Author: </label>
        <input type="text" name="author" placeholder="Your name or leave empty"><br><br>
        <input type="submit" value="Add new comment!">

    </form>
    
    <la

    <?php

} ?>
