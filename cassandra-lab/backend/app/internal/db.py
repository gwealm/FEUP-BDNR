from cassandra.cluster import Cluster
from cassandra.query import BatchStatement
from datetime import datetime
import json


class Database:
    def __init__(self):
        self.cluster = Cluster()
        self.session = self.cluster.connect()
        self.create_schema()
        
    def remove_dup_bookmarks(self, bookmarks):
        res_bookmarks = []
        
        for bookmark in bookmarks:
            if bookmark not in res_bookmarks:
                res_bookmarks += bookmark
                
        return res_bookmarks

    def create_schema(self):
        self.session.execute("""
        CREATE KEYSPACE IF NOT EXISTS bookit
        WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '3'};
        """)
        
        self.session.set_keyspace("bookit")
        
        # Create tables
        self.session.execute("""
            CREATE TABLE IF NOT EXISTS bookmarks (
                url_md5 TEXT,
                url TEXT,
                timestamp TIMESTAMP,
                tags SET<TEXT>,
                
                PRIMARY KEY (url_md5)
            );
        """)
        
        self.session.execute("""
            CREATE TABLE IF NOT EXISTS bookmarks_by_tags (
                tag TEXT,
                url_md5 TEXT,
                url TEXT,
                timestamp TIMESTAMP,
                
                PRIMARY KEY ((tag), timestamp)
            ) WITH CLUSTERING ORDER BY (timestamp DESC);                     
        """)
        
    def get_bookmark_by_url_hash(self, url_md5):
        query = """
            SELECT * 
            FROM bookmarks
            WHERE url_md5 = %s;   
        """
        
        return self.session.execute(query, [url_md5])
    
    def get_latest_bookmarks(self, n: int):
        return self.get_bookmarks_by_tag(':all:')[:n]
        
            
    def get_bookmarks_by_tag(self, tag):
        query = """
            SELECT *
            FROM bookmarks_by_tags
            WHERE tag = %s
            ORDER BY timestamp;
        """

        bookmarks_by_tags = self.session.execute(query, [tag])
        bookmarks = []
        used_urls = []

        for bk in bookmarks_by_tags:
            md5 = bk.url_md5

            if md5 not in used_urls:
                used_urls += [md5]
                
                bookmark = self.get_bookmark_by_url_hash(bk.url_md5)[0]
                bookmarks += [[bookmark.url, list(bookmark.tags)]]

        return bookmarks
    
    def get_all_bookmarks(self):
        query = """
            SELECT *
            FROM bookmarks;
        """
        
        return self.session.execute(query)
        

    def insert_bookmark(self, url_md5, url, timestamp, tags):
        batch = BatchStatement()
        
        batch.add("""
            INSERT INTO bookmarks (url_md5, url, timestamp, tags)
            VALUES (%s, %s, %s, %s)
        """, (url_md5, url, timestamp, tags))
        
        batch.add("""
            INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
            VALUES (%s, %s, %s, %s) 
        """, (":all:", url_md5, url, timestamp))
        
        for tag in tags:
            batch.add("""
                INSERT INTO bookmarks_by_tags (tag, url_md5, url, timestamp)
                VALUES (%s, %s, %s, %s) 
            """, (tag, url_md5, url, timestamp))
            
        self.session.execute(batch)