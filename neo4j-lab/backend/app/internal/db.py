from datetime import datetime
from typing import List
from neo4j import GraphDatabase, basic_auth

class Database:
    def __init__(self, uri, user, password):
        self._driver = GraphDatabase.driver(uri, auth=basic_auth(user, password))

    def close(self):
        self._driver.close()

    def get_latest_bookmarks(self, n: int):
        with self._driver.session() as session:
            result = session.run("""
                MATCH (b:Bookmark)-[:HAS_TAG]->(t:Tag)
                WITH b, COLLECT(t.name) AS tags
                RETURN b.url, tags
                ORDER BY b.when_added DESC
                LIMIT $n
            """, {"n": n})
            return [(record['b.url'], record['tags']) for record in result]
        
    def get_bookmark_by_url(self, url: str):
        with self._driver.session() as session:
            result = session.run("""
                MATCH (b:Bookmark {url: $url})-[:HAS_TAG]->(t:Tag)
                RETURN b.url AS url, COLLECT(t.name) as tags
            """, {"url": url})
            
            record = result.single()
            
            
            return [
                record["url"],
                record["tags"]
             ] if record else None

    def get_bookmarks_by_tag(self, tags):
        
        bookmarks = []
        
        for tag in tags:
            with self._driver.session() as session:
                result = session.run("""
                    MATCH (b:Bookmark)-[:HAS_TAG]->(t:Tag {name: $tag})
                    WITH b, COLLECT(t.name) AS tags
                    RETURN b.url, tags
                """, {"tag": tag})
                
                for record in result:
                    bookmarks += [self.get_bookmark_by_url(record['b.url'])]

        return bookmarks

    def get_all_bookmarks(self):
        with self._driver.session() as session:
            result = session.run("""
                MATCH (b:Bookmark)-[:HAS_TAG]->(t:Tag)
                WITH b, COLLECT(t.name) AS tags
                RETURN b.url, tags
            """)
            return [(record['b.url'], record['tags']) for record in result]

    def insert_bookmark(self, url_md5, url, timestamp, tags):
        with self._driver.session() as session:
            # Create the bookmark node if it doesn't already exist
            session.run("""
                MERGE (b:Bookmark {url: $url})
                ON CREATE SET b.when_added = $timestamp
            """, {"url": url, "timestamp": timestamp})

            # Create or retrieve the tags and create relationships
            for tag in tags:
                session.run("""
                    MERGE (t:Tag {name: $tag})
                    MERGE (b:Bookmark {url: $url})
                    MERGE (b)-[:HAS_TAG]->(t)
                """, {"tag": tag, "url": url})
