# Key Value Databases

## Questions

### <span style="color:red">What is a namespace in key-value databases? Why is it important?</span>

A namespace in a key-value database is a logical container that groups a collection of key-value pairs, ensuring that keys are unique within that specific namespace. It helps organizing data and preventing collisions by allowing the same key to exist in different namespaces without conflict.

Namespaces are important because they provide a way to segment data, manage access control and improve data organization. They help in scaling and maintaining the database by logically separating different datasets, which can enhance performance and simplify administrative tasks such as backups, restores, and applying security policies.

#### Example: Redis

In redis, a namespace can be effectively created using key prefixes to logically group related keys. Although redis does not have built-in namespace support, this convention helps simulate namespaces.

For example, a user data namespace could be defined like the following:
- **Keys:** `user:1001:name`, `user:1001:email`, `user:1001:preferences`.
- Here, `user:1001` acts as a namespace for all data related to user ID 1001.

Using these prefixes, you can avoid key collisions, keep your data organized, and simplify access control and data management. For instance, when deleting a user's data, you can delete all keys with the prefix `user:1001:`. This practice makes it easier to handle and manage large datasets within Redis. 


#### <span style="color:red">Describe how to model a many-to-many association in a key-val database.</span>


Modeling a many-to-many association in a key-value database requires creating intermediate structures to represent the relationships between entities. 

Each entity is represented by unique keys, and sets or lists are used to maintain the associations. For instance, if you have two entities, you create a set for each entity to hold the IDs of the related entities.

In practice, you create keys for each entity's relationships. For the first entity, you store a set of IDs from the second entity and vice-versa. When adding an association, you update both sets to include each other's IDs. Similarly, when removing an association, you delete the IDs from the respective sets. This method ensures efficient management of many-to-many relationships, providing quick lookups, additions and deletions.

##### Example: Students and Courses (using redis)

- **1. Entity Representation**
    - Students and Courses are two main entities.
    - Each student and course is represented by an unique key. 

- **2. Association Representation**
    - Use sets to represent the associations between students and courses.

- **3. Student-to-Courses Mapping**
    - For each student, store a set of course IDs they are enrolled in.
    - Key: `student:{student_id}:courses``
    - Value: Set of course IDs
    - Example: `student:1:courses` -> `{101, 102, 103}`

- **4. Course-to-Student Mapping**
    - For each course, store a set of student IDs enrolled in the course.
    - Key: `course:{course_id}:students`
    - Value: Set of student IDs
    - Example: `course:101:students` -> `{1, 2, 3}`


- **5. Adding an Association**
To enroll a student in a course, you would:
    - Add the course ID to the student's set of courses: `SADD student:1:courses 104`
    - Add the student ID to the course's set of students: `SADD courses:104:students 1`

- **6. Removing an Association**
To unenroll a student from a course, you would:
    - Remove the course ID to the student's set of courses: `SREM student:1:courses 104`
    - Remove the student ID to the course's set of students: `SREM courses:104:students 1`


#### <span style="color:red">Describe use cases that are particularly well-suited for key-val databases.</span>

Key-value stores are particular useful for scenarios with **high performance requirements** (because they usually are in-memory and fast), and for use-cases with **mostly read workloads over a single object**.

More specifically, these use-cases could be **caching**, **storing session information**, **user data** and for **messaging middleware**


##### More info
- **Caching**
    - In-memory solution to improve performance in read-only configuration.
    - Caching layer between the main database and the application code.
    - Automatic key expiration if available in many key-value implementations.
    - Algorithm: read from k-v, if not available: prepare and store in k-v.
    - Examples:
        - Storing frequently accessed web pages, API responses, and other static content to reduce latency and improve performance;
        - SQL query execution result (e.g. complex computation and stable data; student enrollments).


- **Storing Session Information**
    - User sessions are usually defined by a unique value (session id)
    - Storing each user session information under this key makes (all) session information access very efficient (store and retrieve), using a single operation.
    - High performance and read-intensive scenario.

- **User data**
    - Access to an aggregate with selected user data can be done by an unique key.
    - Easy to partition into shards due to independent access to profiles.
    - Examples:
        - User settings;
        - Shopping carts;
        - etc.

- **Messaging Middleware**
    - Key-value stores can be used to implement messaging middleware solutions, e.g. message queues or publish-subscribe patterns.
    - A shared key-value store can be used as a high-performance integration mechanism.
    - Examples:
        - Multiple readers / followers being notified of an update (e.g. chat);
        - Schedule job execution.

#### <span style="color:red">Identify characteristics that pose challenges when using key-val databases.</span>
Some characteristics that pose challenges when using key-value stores are:

- Relationships between data items (e.g. navigate between records, relational data);
- Correlating data between different items (e.g. obtain agregate results or use range queries);
- Transactions over multiple keys;
- Accessing items by the data attribute;
- Operations over multiple keys at the same time;
- Large individual records (that don't fit in memory).

Note: even though these factors are deterring characteristics and should be taken into account, further analysis of the tradeoffs needs to be made, since they can be solved on the client side or with other complementary technologies.

## Other

### <span style="color:orange">Key-Value Databases</span>

- Records are accessed by single unique keys.
- Records are not related to each other.
- Very fast for random key-based access.
- Scalable with easy data partitioning.
- Simple (schemaless) data model and programming interface.
- Client applications are responsible for modeling and manipulation of data values.
- Client applications need to know the key for data access (i.e. the only access path).