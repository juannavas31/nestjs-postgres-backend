# Nestjs + Postgres Backend

## Description
This repository serves as an example of how to use NestJS with PostgreSQL. It demonstrates the setup and configuration required to connect a NestJS backend application to a PostgreSQL database. The code includes examples of database migrations using TypeORM, API endpoints, and unit tests. By following the code in this repository, developers can learn how to build a robust backend application using NestJS and PostgreSQL.

The backend provides an API with two end-points, /profiles and /resources, with the respective GET and POST operations.
A profile may represent an user while a resource may represent an item owned by a profile. A profile may own many resources.

## Installation

To install the dependencies in the project directory:

```bash
npm install
```

Mind that you need to use node 18.14.0. You can set this version active using nvm. 

```bash
nvm use 18.14.0
```

## Database

The backend uses a PostgreSQL database. 
It is necessary to have a PostgreSQL database running before starting the backend.
The connection details for the database must be defined as environment variables in the `.env` file at the root directory. An example is available in this repo. 

### Database Configuration

In this example, a PostgreSQL db server is started running on a local Docker container by executing:

```bash
npm run start:db
```

## TypeORM Migrations

The backend makes use of [TypeORM as a database framework](https://docs.nestjs.com/techniques/database).

Once the postgres database server is up and running, you need to apply the migrations to create the tables in the database. Execute: 

```sh
npm run migration:run
```

## Running the app

Enter the following commands, in this order.

```bash
npm run build

npm start
```


## API

To access the API in JSON format, run the backend and open `http://localhost:3002/api-json` in the browser.

To access the Swagger API interface, run the app and open `http://localhost:3002/api` in the browser.

## Test

A sample of unit tests is provided, using sqlite as database server. In this way, there is no need to mock the postgress database server. Sqlite is quite compatible with postgreSQL for most of the common data types.

The test suites are not meant to be complete or exhaustive. More test cases can be added. 

To run unit tests, execute

```bash
npm run test
```



