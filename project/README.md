# BDNR 23/24

## Members

- Guilherme Almeida: up202006137
- José Osório, up202004653
- Nuno Pereira, up202007865


## Execution instructions

To execute the project, you have to run both the web app and the database.

After cloning (or unzipping) the project, you need to install its dependencies. Docker is required to run the database. Node is needed for the web app. Inside `app` run `npm install` and, after a while, you will have the necessary dependencies.

In order to run the database, `cd` into `db` and execute `make`. The `Makefile` available is already configured to automatically spin up a database instance and clean it up afterwards.

In order to run the web app, `cd` into `app`. There is a script (`run.sh`) which spins up a container for the web app and attaches it to the same network as the DB container. However, if that approach does not work, you can run the application directly from the terminal. You need to have `node` and `npm` installed on your system. Once that is done, you should be able to have the application connect to the database.