# my_robot_app

A NodeJS web app for tracking trade orders and duplicate them on a predetermined exchange.
The app is developped using Express framework with NodeJS and the Pug templating engine as
views renderer.
The app uses Exchanges API keys for tracking and duplicating orders. These are stored locally
in an SQLite3 DB.
Take care to the keys when dumping/restoring databases. Keys exposed here are not real keys
but take care to yours.

## Clone repository

In order to use the webapp, clone the repository and issue the npm command:
```bash
MINGW64 $ npm install
```
This will download and install all node module dependencies for running the express/pug
webapp.
Please refers to the following documentations for context of this webapp dev:
 * [NodeJS docs](https://nodejs.org/en/docs/),
 * [NPM docs](https://docs.npmjs.com/),
 * [ExpressJS framework](https://expressjs.com/) and [Dev template engines with ExpressJS ](https://expressjs.com/en/advanced/developing-template-engines.html)
 * [Pug templating engine docs](https://pugjs.org/api/getting-started.html)

## WebApp Initialization

The keystore.ddl file contains the SQL statements for creating tables and populating records
used.
In order to init database a script named 'keystoredb' is defined in the bin directory. It is
used through the package.json scripts. Just issue the following command
```bash
MINGW64 $ npm run initdb
```
By looking in the 'package.json' file you can see the keystoredb script is launched through
a NodeJS invocation:
```bash
MINGW64 $ node ./bin/keystoredb -- --init-db
```
Other option arguments are available for dumping and restoring database.
 * --dump-db 
 * --restore-db

### Dumping database

Database dumping is available through the 'keystoredb' script invocation with:
```bash
MINGW64 $ npm run dumpdb
```
When launched the database is dumped in a 'keystoredb.sql' file. This file contains schema
creation statements and records insertion for creating the exact same database.

```bash
MINGW64 $ npm run dumpdb

> myapp@0.0.1 dumpdb
> node ./bin/keystoredb -- --dump-db

initdb: argc = 4 ...
initdb: argv[3] = --dump-db ...
dumpdb: Database dumped into keystoredb.sql!
stdout:
=========================================================================================================
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE Keys     (KeyId       INTEGER NOT NULL PRIMARY KEY,                                                              Key         TEXT    NOT NULL,                                                              ExchangeId  INTEGER NOT NULL,                                                              Secret      TEXT    NOT NULL,                                                              FOREIGN KEY (ExchangeId) REFERENCES Exchanges (Id),                                                                      UNIQUE(Key)                                                             );
INSERT INTO Keys VALUES(1,'HhZ6qJAbUtQ3l8iRGlLddGx1L3QTvigwUvcBOq1Q2T92EImIpmaqfTp0gaGbJTpy',2,'fSczOeQTS62uV7Fn3ZnDoFndbvi6P4eCN7U1QpfbzqwOHlNItRQcNQHZwto3HpPQ');
INSERT INTO Keys VALUES(2,'YJ4FLbB7Zb3IJeNgxbF0tLbhWdn6XCSFeu0wyM_d',1,'lo8RfIB4j_qSmEQ5Kv1etNFLYscnog68BnRqhsl4');
INSERT INTO Keys VALUES(3,'rztreztzretzertze',3,'azerazerazreazer');
CREATE TABLE Exchanges (Id         INTEGER NOT NULL PRIMARY KEY,                                                               Name       TEXT    NOT NULL,                                                               Url        TEXT    NOT NULL,                                                               Subaccount TEXT,                                                                          UNIQUE(Name)                                                              );
INSERT INTO Exchanges VALUES(1,'ftx','https://ftx.com/','napbots');
INSERT INTO Exchanges VALUES(2,'binance','https://binance.com/','');
INSERT INTO Exchanges VALUES(3,'kraken','https://kraken.com/','');
CREATE UNIQUE INDEX "ExchangeIdx" ON "Exchanges" (
        "Id",
        "Name"
);
CREATE UNIQUE INDEX "KeysIdx" ON "Keys" (
        "KeyId",
        "Key"
);
COMMIT;

=========================================================================================================

MINGW64 $ 
```

### Restoring database

When database dump is available, it can be restored through the '--restore-db' option of the keystoredb
script. Invocation is:
```bash
MINGW64 $ npm start
```

## Start WEB App server

The WEB App server is started through the following command:
```bash
MINGW64 $ npm start
```
The server is using https with a localhost server self-signed certificate. The server is started through
the node script 'www' in the bin directory. The NodeJS invocation is as:
```bash
MINGW64 $ node ./bin/www
```
This script setup the server object with all its attributes (ports, hostname, etc...). When launched, an
interface is available on 'https://localhost/' for providing API keys and, when done, starting the order
duplication robot.
The WEB App provides a 'RUN' button available once all keys are available. This will install orders listeners
and will duplicate them with a defined ratio.
