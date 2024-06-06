#### Consider the context of an organization that is interested in keeping information about employees, teams, and expertises. The conceptual domain model is the following:

```
[Expertise] N—–(<has)–—N [Employee] N––(participates in>)––N [Team]
```

The system must be able to answer the following queries:

 - **Q1.** Who works with a given employee?
 - **Q2.** Which employees have a given expertise?
 - **Q3.** Which teams include employees with a given expertise?

Consider MongoDB, a system that follows the column-family data model, as an implementation choice. Propose the data structures to be created and show how to answer each of the queries.