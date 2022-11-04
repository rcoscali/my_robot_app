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

				       var ftxExchangeId, ftxSubAccount, ftxKey, ftxSecret;
				       var binanceExchangeId, binanceKey, binanceSecret;
				       var krakenExchangeId, krakenKey, krakenSecret;

				       app.keystoredb.serialize(() => {
					   app.keystoredb.all("SELECT Id, Subaccount FROM Exchanges WHERE Name LIKE 'ftx';",
							      [], 
							      (err, rows) => {
								  if (err) {
								      console.log('****** /: Get "ftx" exchange record: err = "'+err.message+'"');
								  }
								  else {
								      rows.forEach((row) => {								      
									  app.locals.ftxExchangeId = row.Id;
									  app.locals.ftxSubAccount = row.Subaccount;
									  console.log('****** /: Got "ftx" exchange record with Id "'+app.locals.ftxExchangeId+'" and Subaccount "'+app.locals.ftxSubAccount+'"');
									  app.keystoredb.all("SELECT Key, Secret FROM Keys WHERE ExchangeId = "+app.locals.ftxExchangeId+";",
											     [],
											     (err, rows) => {
												 if (err) {
												     console.log('****** /: Get "ftx" exchange key: err = "'+err.message+'"');
												 }
												 else {
												     rows.forEach((row) => {
													 app.locals.ftxKey = row.Key;
													 app.locals.ftxSecret = row.Secret;
													 console.log('****** /: Get "ftx" exchange key: Key="'+app.locals.ftxKey+'"  Key_Secret="'+app.locals.ftxSecret+'"');
												 });
											     }
											 }
											);
								  });
							      }
							  }
							     );
													 
					   app.keystoredb.all("SELECT Id FROM Exchanges WHERE Name LIKE 'binance';",
							      [], 
							      (err, rows) => {
								  if (err) {
								      console.log('****** /: Get "binance" exchange record: err = "'+err.message+'"');
								  }
								  else {
								      rows.forEach((row) => {
									  app.locals.binanceExchangeId = row.Id;
									  console.log('****** /: Got "binance" exchange record with Id "'+app.locals.binanceExchangeId+'"');
									  app.keystoredb.all("SELECT Key, Secret FROM Keys WHERE ExchangeId = "+app.locals.binanceExchangeId+";",
											     [],
											     (err, rows) => {
												 if (err) {
												     console.log('****** /: Get "binance" exchange key: err = "'+err.message+'"');
												 }
												 else {
												     rows.forEach((row) => {
													 app.locals.binanceKey = row.Key;
													 app.locals.binanceSecret = row.Secret;
													 console.log('****** /: Get "binance" exchange key: Key="'+app.locals.binanceKey+'"  Key_Secret="'+app.locals.binanceSecret+'"');
												     });
												 }
											     }
											    );
								      });
								  }
							      }
							     );
					   app.keystoredb.all("SELECT Id FROM Exchanges WHERE Name LIKE 'kraken';",
							      [], 
							      (err, rows) => {
								  if (err) {
								      console.log('****** /: Get "kraken" exchange record: err = "'+err.message+'"');
								  }
								  else {
								      rows.forEach((row) => {
									  app.locals.krakenExchangeId = row.Id;
									  console.log('****** /: Got "kraken" exchange record with Id "'+app.locals.krakenExchangeId+'"');
									  app.keystoredb.all("SELECT Key, Secret FROM Keys WHERE ExchangeId = "+app.locals.krakenExchangeId+";",
											     [],
											     (err, rows) => {
												 if (err) {
												     console.log('****** /: Get "kraken" exchange key: err = "'+err.message+'"');
												 }
												 else {
												     rows.forEach((row) => {
													 app.locals.krakenKey = row.Key;
													 app.locals.krakenSecret = row.Secret;
													 console.log('****** /: Get "kraken" exchange key: Key="'+app.locals.krakenKey+'"  Key_Secret="'+app.locals.krakenSecret+'"');
												     });
												 }
											     }
											    );
								      });
								  }
							      }
							     );
				       });
				       res.render('index',
						  {
						      title: 'Express', content: 'Content',
						      ftxKey: app.locals.ftxKey, ftxSecret: app.locals.ftxSecret, ftxSubAccount: app.locals.ftxSubAccount,
						      binanceKey: app.locals.binanceKey, binanceSecret: app.locals.binanceSecret,
						      krakenKey: app.locals.krakenKey, krakenSecret: app.locals.krakenSecret
						  }
						 );
				   });
				   
				   /* GET set_api_keys page. */
				   console.log('****** Adding set_api_keys page handler ...');
				   router.get('/set_api_keys', function(req, res, next) {
				       var exchange = req.body.exchange;
				       console.log("*** /set_api_keys: exchange = '"+exchange+"'");
				       res.render('set_api_keys', { 'title': 'SET API Keys', 'exchange': exchange });
				   });
				   
				   /* POST post_api_keys page. */
				   console.log('****** Adding post_api_keys page handler ...');
				   router.post('/post_api_keys', function(req, res, next) {
				       var key = req.body.key;
				       var key_secret = req.body.key_secret;
				       var exchange = req.body.exchange;
				       var subaccount = req.body.subaccount;
				       console.log("*** /post_api_keys: Key = '"+key+"', key secret is '"+key_secret+"', exchange = '"+exchange+"', subaccount = '"+subaccount+"'");
				       app.keystoredb.serialize(() => {
					   app.keystoredb.all("SELECT Key, Secret, ExchangeId FROM Keys JOIN Exchanges ON Name LIKE '"+exchange+"' WHERE Key == '"+key+"';",
							      [], 
							      (err, rows) => {
								  if (!rows.length) {
								      console.log('****** Get ftx exchange record: err = "'+err.message+'"');
								      app.keystoredb.run("INSERT INTO Keys (Key, ExchangeId, Secret) VALUES ('"+key+"', (SELECT Id FROM Exchanges WHERE Name LIKE '"+exchange+"' LIMIT 1), '"+key_secret+"');");
								      console.log('****** /post_api_keys: Added key into Keys (Key, ExchangeId, Secret) VALUES ("'+key+'", '+exchangeId+', "'+key_secret+'");');
								      res.render('post_api_keys',
										 { 'title': 'POST API Keys inserted',
										   'key': key,
										   'key_secret': key_secret,
										   'subaccount': subaccount
										 }
										);
								  }
								  else {
								      rows.forEach((row) => {
									  console.log('****** /post_api_keys: Got ftx exchange record with id "'+row.Id+'"');
									  exchangeId = row.Id;
									  app.keystoredb.run("UPDATE Keys SET Key = '"+key+"', Secret = '"+key_secret+"' WHERE ExchangeId = ( SELECT Id FROM Exchanges WHERE Name LIKE '"+exchange+"' LIMIT 1);")
									  console.log('****** /post_api_keys: Modified key into Keys (Key, ExchangeId, Secret) VALUES ("'+key+'", "'+exchangeId+'", "'+key_secret+'");');
									  res.render('post_api_keys',
										     { 'title': 'POST API Keys modified',
										       'key': key,
										       'key_secret': key_secret,
										       'subaccount': subaccount
										     }
										    );
								      });
								  }
							      });
				       });
				   });

				   /* GET delete_from_db page */
				   console.log('****** Adding delete_from_db page handler ...');
				   router.get('/delete_from_db', function(req, res, next) {
				       var key = req.body.key;
				       var exchange = req.body.exchange;
				       var subaccount = req.body.subaccount;
				       console.log("*** /delete_from_db: Key = '"+key+"', exchange = '"+exchange+"', subaccount = '"+subaccount+"'");
				       var exchangeId;
				       app.keystoredb.serialize(() => {
					   app.keystoredb.all("SELECT Id FROM Exchanges WHERE Name LIKE '"+exchange+"';",
							      [], 
							      (err, rows) => {
								  if (err) {
								      console.log('****** Get exchange record: err = "'+err.message+'"');
								  }
								  else {
								      rows.forEach((row) => {
									  console.log('****** /delete_from_db: Got ftx exchange record with id "'+row.Id+'"');
									  exchangeId = row.Id;
								  });
							      }
							      });
					   app.keystoredb.run("DELETE FROM Keys WHERE ExchangeId=="+exchangeId+" AND Key=="+key);
					   next();
				       });
				   });
				   
				   // Let's serialize Keystore DB inits
				   console.log("****** APP router & handlers initialized!");
				   router.keystoredb = keystoredb;
				   app.keystoredb = keystoredb;
			       }
			   }
			  );
keystoredb.configure('trace', (msg) => {
    console.log("*** [SQLITE3] *** " + msg);
});
console.log('*** Waiting for APP & DB init ...');
module.exports = router;
