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
			   sqlite3.OPEN_READWRITE | sqlite3.OPEN_FULLMUTEX | sqlite3.OPEN_PRIVATECACHE,
			   (err) => {
			       if (err) {
				   console.error(err.message);
				   process.exit(1);
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

				       app.keystoredb.serialize(
					   () => {
					       app.keystoredb.all(
						   "SELECT Id, Subaccount FROM Exchanges WHERE Name LIKE 'ftx' AND DirectionIn=TRUE;",
						   [], 
						   (err, rows) => {
						       if (err) {
							   console.log('****** /: Get "ftx" exchange record: err = "'+err.message+'"');
						       }
						       else {
							   rows.forEach((row) => {								      
							       ftxExchangeId = row.Id;
							       ftxSubAccount = row.Subaccount;
							       console.log('****** /: Got "ftx" exchange record with Id "'+ftxExchangeId+'" and Subaccount "'+ftxSubAccount+'"');
							       app.keystoredb.all(
								   "SELECT Key, Secret FROM Keys WHERE ExchangeId = "+ftxExchangeId+";",
								   [],
								   (err, rows) => {
								       if (err) {
									   console.log('****** /: Get "ftx" exchange key: err = "'+err.message+'"');
								       }
								       else {
									   rows.forEach((row) =>
									       {
										   ftxKey = row.Key;
										   ftxSecret = row.Secret;
										   console.log('****** /: Get "ftx" exchange key: Key="'+ftxKey+'"  Key_Secret="'+ftxSecret+'"');
									       });
								       }
								   }
							       );
							   });
						       }
						   }
					       );
					       
					       app.keystoredb.all(
						   "SELECT Id FROM Exchanges WHERE Name LIKE 'binance' AND DirectionIn=TRUE;",
						   [], 
						   (err, rows) =>
						   {
						       if (err) {
							   console.log('****** /: Get "binance" exchange record: err = "'+err.message+'"');
						       }
						       else {
							   rows.forEach((row) => {
							       binanceExchangeId = row.Id;
							       console.log('****** /: Got "binance" exchange record with Id "'+binanceExchangeId+'"');
							       app.keystoredb.all(
								   "SELECT Key, Secret FROM Keys WHERE ExchangeId = "+binanceExchangeId+";",
								   [],
								   (err, rows) =>
								   {
								       if (err) {
									   console.log('****** /: Get "binance" exchange key: err = "'+err.message+'"');
								       }
								       else {
									   rows.forEach((row) => {
									       binanceKey = row.Key;
									       binanceSecret = row.Secret;
									       console.log('****** /: Get "binance" exchange key: Key="'+binanceKey+'"  Key_Secret="'+binanceSecret+'"');
									   });
								       }
								   }
							       );
							   });
						       }
						   }
					       );
					       app.keystoredb.all(
						   "SELECT Id FROM Exchanges WHERE Name LIKE 'kraken' AND DirectionIn=TRUE;",
						   [], 
						   (err, rows) =>
						   {
						       if (err)
							   console.log('****** /: Get "kraken" exchange record: err = "'+err.message+'"');

						       else
						       {
							   rows.forEach((row) =>
							       {
								   krakenExchangeId = row.Id;
								   console.log('****** /: Got "kraken" exchange record with Id "'+krakenExchangeId+'"');
								   app.keystoredb.all(
								       "SELECT Key, Secret FROM Keys WHERE ExchangeId = "+krakenExchangeId+";",
								       [],
								       (err, rows) =>
								       {
									   if (err) {
									       console.log('****** /: Get "kraken" exchange key: err = "'+err.message+'"');
									   }
									   else
									   {
									       rows.forEach((row) =>
										   {
										       krakenKey = row.Key;
										       krakenSecret = row.Secret;
										       console.log('****** /: Get "kraken" exchange key: Key="'+krakenKey+'"  Key_Secret="'+krakenSecret+'"');
										   });
									   }
									   app.keystoredb.all(
									       "SELECT Id, Name FROM Exchanges WHERE DirectionIn=FALSE;",
									       []
									       (err, rows) =>
									       {
										   if (err) {
										       console.log('****** /: Get output exchange key: err = "'+err.message+'"');
										   }
										   else
										   {
										       rows.forEach((row) =>
											   {
											       outExchange = row.Name;
											       outKey = row.Key;
											       outKeySecret = row.Secret;
											       console.log('****** /: Get output exchange '+outExchange+' key: Key="'+outKey+'"  Key_Secret="'+outKeySecret+'"');
											   });	
										   }
									       }
									       res.render(
										   'index',
										   {
										       title: 'Express', content: 'Content',
										       ftxKey: ftxKey, ftxSecret: ftxSecret, ftxSubAccount: ftxSubAccount,
										       binanceKey: binanceKey, binanceSecret: binanceSecret,
										       krakenKey: krakenKey, krakenSecret: krakenSecret,
										       outExchange: outExchange, outKey: outKey, outKeySecret: outKeySecret
										   }
									       );
									   );
								       }
								   );
							       });
						       }
						   }
					       );
					   });
				   });
				   
				   /* GET set_api_keys page. */
				   console.log('****** Adding set_api_keys page handler ...');
				   router.get('/set_api_keys', function(req, res, next) {
				       var key_secret = req.body.key_secret;
				       var exchange = req.query.exchange;
				       var subaccount = req.body.subaccount;
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
					   app.keystoredb.all("SELECT Key, Secret, ExchangeId FROM Keys JOIN Exchanges ON Name LIKE ? AND DirectionIn=TRUE WHERE Key == ?;",
							      [exchange, key], 
							      (err, rows) => {
								  console.log('****** Get key record: nb of rows = "'+rows.length+'"');
								  if (!rows.length) {
								      app.keystoredb.run("INSERT INTO Keys (Key, ExchangeId, Secret) VALUES ('"+key+"', (SELECT Id FROM Exchanges WHERE Name LIKE '"+exchange+"' LIMIT 1), '"+key_secret+"');");
								      console.log('****** /post_api_keys: Added key into Keys (Key, Secret) VALUES ("'+key+'", "'+key_secret+'");');
								      res.render('post_api_keys',
										 { 'title': 'POST API Keys for exchange '+exchange+' inserted',
										   'key': key,
										   'key_secret': key_secret,
										   'exchange': exchange,
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
										     { 'title': 'POST API Keys for exchange '+exchange+' modified',
										       'key': key,
										       'key_secret': key_secret,
										       'exchange': exchange,
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
				       var key = req.query.key;
				       var exchange = req.query.exchange;
				       console.log("*** /delete_from_db: Key = '"+key+"', exchange = '"+exchange+"'");
				       var exchangeId;
				       app.keystoredb.run("DELETE FROM Keys WHERE Key='"+key+"' AND ExchangeId=(SELECT Id FROM Exchanges WHERE Name='"+exchange+"' AND DirectionIn=TRUE)")
				       res.render('delete_from_db',
						  {
						      'title': 'DELETE API Keys from DB for exchange '+exchange,
						      'key': key,
						      'exchange': exchange,
						  }
						 );
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
