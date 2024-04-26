// Bookit! Example Setup

// Single user model.
// Nodes: (Bookmark {url: string, when_added: date}) and (Tag {name: string, when_added: date}).
// Relationships: (Bookmark)-[HAS_TAG {when_added: date}]->(Tag).

// Define uniqueness contraints for Bookmarks and Tags.
CREATE CONSTRAINT uk_bookmark_url FOR (b:Bookmark) REQUIRE b.url IS UNIQUE;
CREATE CONSTRAINT uk_tag_name FOR (t:Tag) REQUIRE t.name IS UNIQUE;

// Clear previous Tags and Bookmarks, and constraints.
MATCH (b:Bookmark) DETACH DELETE b;
MATCH (t:Tag) DETACH DELETE t;

// Using single create statements.
// ! Not a good practice with larger volumes of data.
WITH datetime() as now
CREATE
// Create Tags.
    (company:Tag {name: "company"}),
    (search:Tag {name: "search"}),
    (porto:Tag {name: "porto"}),
    (portugal:Tag {name: "portugal"}),
    (education:Tag {name: "education"}),
    (science:Tag {name: "science"}),
    (architecture:Tag {name: "architecture"}),
    (engineering:Tag {name: "engineering"}),
    (web:Tag {name: "web"}),

// Create Bookmarks.
    (up:Bookmark {url: "http://www.up.pt", when_added: now}),
    (feup:Bookmark {url: "http://www.fe.up.pt", when_added: now}),
    (fcup:Bookmark {url: "http://www.fc.up.pt", when_added: now}),
    (faup:Bookmark {url: "http://www.fa.up.pt", when_added: now}),
    (cmp:Bookmark {url: "http://www.cm-porto.pt", when_added: now}),
    (yahoo:Bookmark {url: "http://www.yahoo.com", when_added: now}),
    (google:Bookmark {url: "http://www.google.com", when_added: now}),


// Create relationships.

    (up)-[:HAS_TAG {when_added: now}]->(education),
    (up)-[:HAS_TAG {when_added: now}]->(porto),

    (feup)-[:HAS_TAG {when_added: now}]->(engineering),
    (feup)-[:HAS_TAG {when_added: now}]->(education),
    (feup)-[:HAS_TAG {when_added: now}]->(porto),
    (feup)-[:HAS_TAG {when_added: now}]->(portugal),

    (fcup)-[:HAS_TAG {when_added: now}]->(education),
    (fcup)-[:HAS_TAG {when_added: now}]->(science),
    (fcup)-[:HAS_TAG {when_added: now}]->(porto),
    (fcup)-[:HAS_TAG {when_added: now}]->(portugal),

    (faup)-[:HAS_TAG {when_added: now}]->(education),
    (faup)-[:HAS_TAG {when_added: now}]->(architecture),
    (faup)-[:HAS_TAG {when_added: now}]->(porto),
    (faup)-[:HAS_TAG {when_added: now}]->(portugal),

    (cmp)-[:HAS_TAG {when_added: now}]->(porto),
    (cmp)-[:HAS_TAG {when_added: now}]->(portugal),

    (yahoo)-[:HAS_TAG {when_added: now}]->(company),
    (yahoo)-[:HAS_TAG {when_added: now}]->(search),
    (yahoo)-[:HAS_TAG {when_added: now}]->(web),

    (google)-[:HAS_TAG {when_added: now}]->(company),
    (google)-[:HAS_TAG {when_added: now}]->(search),
    (google)-[:HAS_TAG {when_added: now}]->(science),
    (google)-[:HAS_TAG {when_added: now}]->(engineering),
    (google)-[:HAS_TAG {when_added: now}]->(web);


// End.