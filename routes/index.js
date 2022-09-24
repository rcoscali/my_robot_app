// Require NodeJS's Express framework
var express = require('express');
// Get the root Express router
var router = express.Router();
// Require body parser for decoding forms url encoded params
const bodyParser = require("body-parser");
// Require sqlite3 for keystore (storing/fetching keys)
const sqlite3 = require('sqlite3').verbose();
// Require FS module
var fs = require('fs');
// Require PATH module
var path = require('path');


// Instanciate keystore DB
const keystoredb =
      new sqlite3.Database('c:/Users/a047461/AppData/Local/myapp/keystore.db',
			   sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE | sqlite3.OPEN_FULLMUTEX | sqlite3.OPEN_PRIVATECACHE,
			   (err) => {
			       if (err) {
				   console.error(err.message);
			       }
			       else {
				   console.log('****** Keystore DB openned !');
				   var app = express();
			       
				   console.log('****** Adding body parser middleware ...');
				   app.use(bodyParser.urlencoded({ extended: false }));
				   console.log('****** Body parser middleware RDY!');
				   
				   /* GET home page. */
				   console.log('****** Adding root index page handler ...');
				   router.get('/', function(req, res, next) {
				       res.render('index', { 'title': 'Express', 'content': 'Content' });
				   });
				   
				   /* GET set_api_keys page. */
				   console.log('****** Adding set_api_keys page handler ...');
				   router.get('/set_api_keys', function(req, res, next) {
				       res.render('set_api_keys', { 'title': 'SET API Keys' });
				   });
				   
				   /* POST post_api_keys page. */
				   console.log('****** Adding post_api_keys page handler ...');
				   router.post('/post_api_keys', function(req, res, next) {
				       var key = req.body.key;
				       var key_secret = req.body.key_secret;
				       console.log("*** Key = "+key+", key secret is "+key_secret);
				       res.render('post_api_keys', { 'title': 'POST API Keys', 'key': key, 'key_secret': key_secret });
				   });

				   // Let's serialize Keystore DB inits
				   console.log("****** APP router & handlers initialized!");
				   console.log("****** Initializing KeyStore database ...");
				   keystoredb.serialize(() =>
				       {				   
					   keystoredb.run("PRAGMA foreign_keys = ON; \
                                                           CREATE TABLE IF NOT EXISTS Keys     (KeyId       INTEGER NOT NULL PRIMARY KEY, \
                                                                                                Key         TEXT    NOT NULL, \
                                                                                                ExchangeId  INTEGER NOT NULL, \
                                                                                                Secret      TEXT    NOT NULL, \
                                                                                                FOREIGN KEY (ExchangeId) REFERENCES Exchanges (Id), \
                                                                                                UNIQUE(Key)\
                                                                                               );");
					   keystoredb.run("CREATE TABLE IF NOT EXISTS Exchanges (Id   INTEGER NOT NULL PRIMARY KEY, \
                                                                                                 Name TEXT    NOT NULL, \
                                                                                                 Url  TEXT    NOT NULL, \
                                                                                                 UNIQUE(Name)\
                                                                                                );");
					   
					   // Add FTX echange record in DB
					   keystoredb.all("SELECT Id id FROM Exchanges WHERE Name LIKE 'ftx';",
							  [], 
							  (err, rows) => {
							      if (err) {
								  console.log('****** Get ftx exchange record: err = "' + err.message + '"');
								  keystoredb.run("INSERT INTO Exchanges (Name, Url) VALUES ('ftx', 'https://ftx.com/');");
							      }
							      else {
								  rows.forEach((row) => {
								      console.log('****** Got ftx exchange record with id "' + row.id + '"');
								  });
							      }
							  });
					   // Add Binance exchange record in DB
					   keystoredb.all("SELECT Id id FROM Exchanges WHERE Name LIKE 'binance';",
							  [], 
							  (err, rows) => {
							      if (err) {
								  console.log('****** Get binance exchange record: err = "' + err.message + '"');
								  keystoredb.run("INSERT INTO Exchanges (Name, Url) VALUES ('binance', 'https://binance.com/');");
							      }
							      else {
								  rows.forEach((row) => {
								      console.log('****** Got binance exchange record with id "' + row.id + '"');
								  });
							      }
							  });
					   // Add Kraken exchange record in DB
					   keystoredb.all("SELECT Id id FROM Exchanges WHERE Name LIKE 'kraken';",
							  [], 
							  (err, rows) => {
							      if (err) {
								  console.log('****** Get kraken exchange record: err = "' + err.message + '"');
								  keystoredb.run("INSERT INTO Exchanges (Name, Url) VALUES ('kraken', 'https://kraken.com/');");
							      }
							      else {
								  rows.forEach((row) => {
								      console.log('****** Got kraken exchange record with id "' + row.id + '"');
								  });
							      }
							  }
							 );
					   // Add a last dumb statement just to be serialized after previous useful ones
					   keystoredb.all("SELECT Id id FROM Exchanges;", [], 
							  (err, rows) => {
							      // We're done for this router
							      console.log("****** KeyStore database initialized!");
							      router.keystoredb = keystoredb;
							      app.keystoredb = keystoredb;
							  }
							 );
				       }
				   );
			       }
			   }
			  );
keystoredb.configure('trace', (msg) => {
    console.log("*** [SQLITE3] *** " + msg);
});
console.log('*** Waiting for APP & DB init ...');
module.exports = router;
