CREATE KEYSPACE IF NOT EXISTS bookit
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '3'};

USE bookit;

CREATE TABLE IF NOT EXISTS bookmarks (
 url_md5 TEXT,
 url TEXT,
 timestamp TIMESTAMP,
 tags SET<TEXT>,

 PRIMARY KEY (url_md5)
);

CREATE TABLE IF NOT EXISTS bookmarks_by_tags (
 tag TEXT,
 url_md5 TEXT,
 url TEXT,
 timestamp TIMESTAMP,

 PRIMARY KEY ((tag), timestamp)
) WITH CLUSTERING ORDER BY (timestamp DESC);

-- Insert new bookmark 'http://www.up.pt'.

BEGIN BATCH
 -- Insert into bookmarks.
 INSERT INTO bookmarks (url_md5, url, timestamp, tags)
 VALUES ('93462762d236aed61c248298584ea5bf', 'http://www.up.pt', toTimestamp(now()), {'education', 'porto'});


 -- Always associate with ':all' tag.
 INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
 VALUES (':all:', '93462762d236aed61c248298584ea5bf', 'http://www.up.pt', toTimestamp(now()));

 -- Insert into bookmarks_by_tags, one per tags.
 INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
 VALUES ('education', '93462762d236aed61c248298584ea5bf', 'http://www.up.pt', toTimestamp(now()));
 INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
 VALUES ('porto', '93462762d236aed61c248298584ea5bf', 'http://www.up.pt', toTimestamp(now()));
APPLY BATCH;

-- Insert new bookmark 'http://www.fe.up.pt'.

BEGIN BATCH
 -- Insert into bookmarks.
 INSERT INTO bookmarks (url_md5, url, timestamp, tags)
 VALUES ('84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()), {'education', 'porto', 'engineering', 'feup', 'portugal'});

  -- Always associate with ':all' tag.
 INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
 VALUES (':all:', '84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()));


 -- Insert into bookmarks_by_tags, one per tags.
 INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
 VALUES ('education', '84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()));
 INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
 VALUES ('porto', '84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()));
 INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
 VALUES ('engineering', '84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()));
 INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
 VALUES ('feup', '84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()));
 INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
 VALUES ('portugal', '84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()));
APPLY BATCH;