# my_robot_app

A NodeJS web app for tracking trade orders and duplicate them on a predetermined exchange.
The app is developped using Express framework with NodeJS and the Pug templating engine as
views renderer.
The app uses Exchanges API keys for tracking and duplicating orders. These are stored locally
in an SQLite3 DB.

## Initialization

The keystore.ddl file contains the SQL statements for creating tables and populating records
used.
In order to init database a script named 'keystoredb' is defined in the bin directory. It is
used through the package.json scripts.
Just issue 'npm run initdb'. By looking in the 'package.json' file you can see the keystoredb
script is launched with 'node ./bin/keystoredb -- --init-db'.
Another option arg '--dump-db' is available that dump the keystoredb through 'npm run dumpdb'.

## Run APP

'npm start' starts serving the WEB App pages. An interface is available for providing API keys
and once this is achieved, the WEB App can run through a 'RUN' button.
This will install orders listeners and will duplicate them with a defined ratio.
