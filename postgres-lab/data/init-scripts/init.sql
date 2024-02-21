CREATE EXTENSION HSTORE;

CREATE TABLE keys (
    data HSTORE
);

INSERT INTO keys VALUES ('
    "a" => "10",
    "A" => "12",
    "Zoo" => "bar",
    "Bar" => 12
')


CREATE TABLE book_hstore (
        id SERIAL PRIMARY KEY,
        title TEXT UNIQUE,
        values HSTORE
);

CREATE TABLE book_json (
        id SERIAL PRIMARY KEY,
        title TEXT,
        info JSONB
);


CREATE TABLE docs_json (
        id SERIAL PRIMARY KEY,
        info json NOT NULL
);

CREATE TABLE docs_jsonb (
        id SERIAL PRIMARY KEY,
        info jsonb NOT NULL
);

INSERT INTO docs_json (info)
VALUES
('{"student": "Alice",

        "courses": {"name": "Databases", "grade": 18}}'),
('{"student": "Max",

        "courses": [

                {"name": "Web", "grade": 14},

                {"name": "Databases", "grade": 17}]}'),
('{"student": "Rita",

        "courses": {"name": "Databases", "grade": 18}}');

INSERT INTO docs_jsonb (info)
VALUES
('{"student": "Alice",
        "courses": {"name": "Databases", "grade": 18}}'),
('{"student": "Max",
        "courses": [
                {"name": "Web", "grade": 14},
                {"name": "Databases", "grade": 17}]}'),
('{"student": "Rita",
        "courses": {"name": "Databases", "grade": 18}}');