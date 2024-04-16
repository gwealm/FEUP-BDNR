<?php

function drawHeader() { ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MiniForum</title>
    <style>
        ul { padding: 0; margin: 0; }
        li.header_link  { display: inline; }
        li.header_link:not(:first-child):before { content: " | "; }
    </style>
</head>
<body>
    </html>
    
    <h1>MiniForum</h1>
    <ul>
        <li class="header_link"><a href="/">Home</a></li>
        <li class="header_link"><a href="/new_topic.html">Start a new topic!</a></li>
    </ul>
    <br>
    <hr>
</body>
    
<?php } ?>