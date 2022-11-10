/**
 * db.js
 *
 * Express javascript application for DB manip
 */

/**
 * Load Modules Required
 *
 */
// Require FS for passing cert&key for https www server
const fs = require('fs');
// Require path for addressing static public dir for www server
var path = require('path');
// Require morgan as a console/debug logger
var logger = require('morgan');
// Require sqlite3 for keystore (storing/fetching keys)
const sqlite3 = require('sqlite3').verbose();

/**
 // The object instance supporting this module
 */
var db = new Object;
db.keystoredb = new Object;
// Function opening the database
function openDb()
{
    console.log('****** Opening Keystore DB ...');
    // Instanciate keystore DB
    db.keystoredb =
	      new sqlite3.Database(
            'c:/Users/a047461/AppData/Local/myapp/keystore.db',
			      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE | sqlite3.OPEN_FULLMUTEX | sqlite3.OPEN_PRIVATECACHE,
			      (err) =>
			      {
				        if (err)
				        {
				            console.error(err.message);
				            throw err;
				        }
				        else
				            console.log('****** Keystore DB openned !');
			      }
			  );
    return db.keystoredb;
}

// Exporting the utility function
db.openDb = openDb;
// and the module itself
module.exports = db;
