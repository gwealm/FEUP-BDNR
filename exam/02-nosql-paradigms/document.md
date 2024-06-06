# Document Databases

## Questions

### <span style="color:red">How do document databases differ from key-value databases?</span>

The values on the document databases are visible to the database system, however, on the key-value database they are not. This means that on a document database, differently from a key-value, the value part can be used for access and manipulation.

### <span style="color:red">Why are document databases considered schemaless?</span>

Document databases are considered schemaless because they do not require a rigid, pre-defined schema.
The schema can therefore vary from a document to anothet in the same collection.

This means that the application is responsible for handling intra-documents rules and requirements.


#### <span style="color:red">Describe how to model a one-to-one association in a document database.</span>
Embedding associated data in a single document can reduce the number of read operations needed.

##### Example:

```json
// person document
{
    _id: "joe",
    name: "Joe Bookreader"
}
```

and

```json
// address document
{
    person_id: "joe", // reference to person document
    street: "123 Fake Street",
    city: "Faketon",
    state: "MA",
    zip: "12345"
}
```

Would become:

```json
// embedded person / address document
{
    _id: "joe",
    name: "Joe Bookreader",
    address: {
        street: "123 Fake Street",
        city: "Faketon",
        state: "MA",
        zip: "12345"
    }
}
```

#### <span style="color:red">Describe how to model a one-to-many association in a document database.</span>

The basic pattern is that the <u>one</u> entity in a one-to-many association is the primary document, and the <u>many</u> entities are represented as an array of embedded documents.

##### Example:

```json
{
    customer_id: 76123,
    name: "Acme Data Modeling Services",
    person_or_business: "business",
    address : [
        {
            street: "276 North Amber St",
            city: "Vancouver",
            state: "WA",
            zip: 99076
        },
        {
            street: "89 Morton St",
            city: "Salem",
            state: "NH",
            zip: 01097
        }
    ]
}
```

#### <span style="color:red">Describe how to model a many-to-many association in a document database.</span>
- Many-to-many associations are modelled using two collections - one for each type of entity. Each collection maintains a list of identifiers that reference related entities.

- For example, a course document would include student IDs, and a student document would include course IDs.

- This pattern minimizes duplicate data, but special actions must be taken when updating to keep both entities consistent.

##### Example:

```json
// Course collection
{
    {
        courseID: "C1667",
        title: "Introduction to Anthropology",
        instructor: "Dr. Margret Austin",
        credits: 3,
        enrolledStudents: ["S1837", "S3737", "S9825" ... "S1847"]
    },
    {
        courseID: "C2873",
        title: "Algorithms and Data Structures",
        instructor: "Dr. Susan Johnson",
        credits: 3,
        enrolledStudents: ["S1837", "S3737", "S4321", "S9825" ... "S1847"]
    },
...
}
```

```json
// Student collection
{
    {
        studentID: "S1837",
        name: "Brian Nelson",
        gradYear: 2018,
        courses: ["C1667", "C2873", "C3876"]
    },
    {
        studentID: "S3737",
        name: "Yolanda Deltor",
        gradYear: 2017,
        courses: ["C1667", "C2873"]
    },
...
}
```

#### <span style="color:red">Describe use cases that are particularly well-suited for document databases.</span>

Document stores are particularly useful for setups with **high availability requirements** (replication and scaling).

It has flexible schema, so supports applications with multiple entity variants and evolving schemas.

Examples of applications that can make use of document stores are: **event logging systems**, **content management systems**, **analytics** and **e-commerce**.

##### More info

- **Event Logging**
    - Applications have different event logging needs.
    - Within an enterprise different applications want to log events.
    - Document databases, with their flexible schema for documents can store different types of events and serve as a central data store for event storage. This is particularly true when event information being captured changes overtime.
    - Events can be sharded by application, by customer, or timestamp.

- **Content Management Systems**
    - JSON is supported by most document dbs and is used in web publishing to store web documents, comments, profiles, etc.
    - Using a document db allows the flexibility of not having a predefined data schema.
    - Also, it allows to keep all related data together (efficient and meaningful).
        - Consider the relational model where multiple tables would be needed for each content type, thus requiring multiple joins.

    - Document databases are ideal for CMS applications where the content structure may vary significantly. They can easily handle different types of content, such as articles, blog posts, images and videos, each with their own unique metadata. The flexibility to store diverse content types and the ability to query based on content attributes make document databases a natural fit to CMS. 

- **Analytics**
    - Document dbs can be used for storing real-time analytics data, since part of the document can be updated.
    - Given the schema flexibility, it can be used to store different metrics over time without the need for schema changes.
    - Applications that require real-time analytics such as dashboards and monitoring systems benefit from document dbs ability to quickly ingest and query large volumes of data. Documents can represent individual events or metrics, and the database can efficiently aggregate and filter these documents to provide insights.

- **E-commerce**
    - Product information requires flexible schemas:
        - Store new product types.
        - Add new features to existing products.
    - Document databases are best suited to evolving data schema needs.
    
    - E-Commerce platforms often require storing complex product information, user profiles, shopping carts and order histories. Document databases can store each product, user, and order as a separate document, allowing for easy updates and efficient retrieval of related information. The schemaless nature allows for quick adjustments to the data model as new product attributes or user preferences need to be added.

### <span style="color:red">Identify characteristics that pose challenges when using document databases.</span>
Some characteristics that pose challenges when using document databases are:
    - Complex transactions spanning different operations, for example, atomic cross-document operations, which are not supported (exceptions exist, but they are still not as performant as using a relational data model).
    - Queries against varying aggregate structure (e.g. queries against an aggregate that changes regularly will require normalization of data).
    - Strong data integrity requirements (e.g. fixed schema with strong requirements)

Document databases, while flexible and scalable, pose several challenges. The lack of a rigid schema can complicate data consistency and integrity, requiring additional application logic for validation. Index management is crucial but complex, as improper indexing can slow down write operations and increase storage needs. Data duplication, common for optimizing reads, can lead to storage inefficiencies and complicated updates. Transaction support is less robust compared to relational databases, amking complex transactions challenging. Achieving efficient horizontal scaling involves complex partitioning and consistency management.
Handling complex queries requires careful schema design and indexing. Additionally, eventually consistency models can pose challenges for applications needing strong consistency, and managing backups and recovery in distributed environments can be difficult. Understanding and addressing this issues is key to effectively using document databases.

## Other

### <span style="color:orange">Document Databases</span>

- Documents can be accessed by key or data attribute.
- Atomic transactions are supported at the document-level.
- Suitable for flexible, evolving schemas, with arbitrary complexity (low cost adaption).
- Automatic horizontal scaling for reads (replicas) and writes (sharding).
- Lacks strong integrity constraints, which can lead to data consistency  and integrity problems (if not dealt with properly).
- Not suitable for complex use cases where cross-document operations need to be atomic.
- Lack of standard uniform querying language.
- Client applications are responsible for keeping document relationships and enforcing the schema.

#### What are the application access patterns?
Application access patterns in document databases typically involve frequent reading and writing of documents. These databases are often accessed through CRUD (Create, Read, Update, Delete) operations, with applications using these operations to handle user-generated content, session data, and other dynamic datasets. The flexible schema allows applications to efficiently manage varying data structures, making document databases ideal for use cases where data relationships are not strictly defined or are subject to change.

**Schema design** in document dbs is heavily influenciated by how data is accessed by the application. This involves understanding the application's query patterns and optimizing the document structure to align with these patterns. For instance, if an application frequently retrieves user profiles and their associated activity logs together, it makes sense to embed the activity logs within the user profile document. This design reduces the need for complex joins and enhances query performance by storing related data together.

#### What is the read/write ratio?
Document databases are generally optimized for read-heavy workloads, making them ideal for applications with a high read-to-write ratio, such as content management systems, catalogs, and social media platforms.
However, they can also be configured to handle high write loads, especially when using distributed architectures that support horizontal scaling and efficient write operations.

#### What is the complexity of queries?
Document databases support a range of query complexities, from simple key-value lookups to more advanced queries involving filters, aggregations and nested document searches. Indexing strategies are crucial for maintaining performance in complex queries. While document databases excel in scenarios where the majority of queries are read-heavy, they can also efficiently handle complex write operations if designed correctly.

#### Which lookup keys are used?
Lookup keys in a document database are typically based on fields within documents that are most commonly used for data retrieval. These keys should be chosen to optimize read performance, enabling fast access to the most frequently queried data. Common lookup keys might include user IDs, or other unique identifiers that facilitate quick and efficient searches.

#### What data is retrieved together? i.e. what aggregates exist?

Data that is frequently retrieved together should be stored together within the same document to optimize read performance. By embedding related data within a single document, applications can minimize the number of read operations required to assemble a complete dataset.
This design approach is particularly effective in scenarios where read operations dominate, as it enhances query efficiency and reduces latency.