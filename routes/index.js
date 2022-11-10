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

function getFtxKeys(keysObj, err, rows)
{
    if (err)
        console.log('****** /: Get "ftx" exchange record: err = "'+err.message+'"');

    else {
        rows.forEach((row) => {
            var ftxExchangeId = row.Id;
            keysObj.ftxSubAccount = row.Subaccount;
            console.log('****** /: Got "ftx" exchange record with Id "'+ftxExchangeId+'" and Subaccount "'+keysObj.ftxSubAccount+'"');
            keystoredb.all(
                "SELECT Key, Secret FROM Keys WHERE ExchangeId = "+ftxExchangeId+";",
                [],
		            (err, rows) => {
		                if (err)
			                  console.log('****** /: Get "ftx" exchange key: err = "'+err.message+'"');

		                else {
			                  rows.forEach((row) =>
			                      {
				                        keysObj.ftxKey = row.Key;
				                        keysObj.ftxSecret = row.Secret;
				                        console.log('****** /: Get "ftx" exchange key: Key="'+keysObj.ftxKey+'"  Key_Secret="'+keysObj.ftxSecret+'"');
			                      });
		                }
		            }
            );
        });
    }
}

function getBinanceKeys(keysObj, err, rows)
{
    if (err)
        console.log('****** /: Get "binance" exchange record: err = "'+err.message+'"');

    else {
        rows.forEach((row) => {
            var binanceExchangeId = row.Id;
            console.log('****** /: Got "binance" exchange record with Id "'+binanceExchangeId+'"');
            keystoredb.all(
                "SELECT Key, Secret FROM Keys WHERE ExchangeId = "+binanceExchangeId+";",
                [],
                (err, rows) => {
		                if (err)
			                  console.log('****** /: Get "binance" exchange key: err = "'+err.message+'"');

		                else {
			                  rows.forEach((row) => {
			                      keysObj.binanceKey = row.Key;
			                      keysObj.binanceSecret = row.Secret;
			                      console.log('****** /: Get "binance" exchange key: Key="'+keysObj.binanceKey+'"  Key_Secret="'+keysObj.binanceSecret+'"');
			                  });
		                }
		            }
            );
        });
    }
}

function getKrakenKeys(keysObj, err, rows)
{
    if (err)
        console.log('****** /: Get "kraken" exchange record: err = "'+err.message+'"');

    else
    {
        rows.forEach((row) =>
            {
                var krakenExchangeId = row.Id;
                console.log('****** /: Got "kraken" exchange record with Id "'+krakenExchangeId+'"');
                keystoredb.all(
                    "SELECT Key, Secret FROM Keys WHERE ExchangeId = "+krakenExchangeId+";",
                    [],
                    (err, rows) =>
                    {
                        if (err)
                            console.log('****** /: Get "kraken" exchange key: err = "'+err.message+'"');

                        else
                        {
                            rows.forEach((row) =>
                                {
                                    keysObj.krakenKey = row.Key;
                                    keysObj.krakenSecret = row.Secret;
                                    console.log('****** /: Get "kraken" exchange key: Key="'+keysObj.krakenKey+'"  Key_Secret="'+keysObj.krakenSecret+'"');
                                });
                        }
                    });
            });
    }
}

function setOutKeys(keysObj, err, rows)
{
    if (err)
        console.log('****** /: Get "out" exchange key: err = "'+err.message+'"');

    else
    {
        rows.forEach((row) =>
            {
                keysObj.outKey = row.Key;
                keysObj.outKeySecret = row.Secret;
                console.log('****** /: Get '+keysObj.outExchange+' "out" exchange key: Key="'+keysObj.outKey+'"  Key_Secret="'+keysObj.outKeySecret+'"');
            });
    }
}

function getOutKeys(keysObj, err, rows)
{
    if (err)
        console.log('****** /: Get output exchange key: err = "'+err.message+'"');

    else
    {
        rows.forEach((row) =>
            {
                keysObj.outExchange = row.Name;
                var outExchangeId = row.Id;
                keysObj.outExchangeSubAccount = row.Subaccount;
                console.log('****** /: Get output exchange '+keysObj.outExchange+' Id="'+
                            outExchangeId+'"  Exchange Subaccount="'+keysObj.outExchangeSubAccount+'"');
                keystoredb.all(
                    "SELECT Key, Secret FROM Keys WHERE ExchangeId="+outExchangeId+";",
                    [],
                    (err, rows) => {
			                  setOutKeys(keysObj, err, rows);
		                }
                );
            });
    }
}

// Instanciate keystore DB
var keystoredb =
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

				                             let keysObj = {
					                               title: 'Bot Spy',
					                               content: 'Setup parameters',
					                               ftxSubAccount: '',
					                               ftxKey: '',
					                               ftxSecret: '',
					                               binanceKey: '',
					                               binanceSecret: '',
					                               krakenKey: '',
					                               krakenSecret: '',
					                               outExchange: '',
					                               outExchangeSubAccount: '',
					                               outKey: '',
					                               outKeySecret: ''
				                             };

                                     app.keystoredb.serialize(
                                         () => {
                                             app.keystoredb.all(
                                                 "SELECT Id, Subaccount FROM Exchanges WHERE Name LIKE 'ftx' AND DirectionIn=TRUE;",
                                                 [],
                                                 (err, rows) => {
                                                     getFtxKeys(keysObj, err, rows);
						                                         app.keystoredb.all(
							                                           "SELECT Id FROM Exchanges WHERE Name LIKE 'binance' AND DirectionIn=TRUE;",
							                                           [],
							                                           (err, rows) => {
							                                               getBinanceKeys(keysObj, err, rows);
							                                               app.keystoredb.all(
								                                                 "SELECT Id FROM Exchanges WHERE Name LIKE 'kraken' AND DirectionIn=TRUE;",
								                                                 [],
								                                                 (err, rows) => {
								                                                     getKrakenKeys(keysObj, err, rows);
								                                                     app.keystoredb.all(
									                                                       "SELECT Id, Name, Subaccount FROM Exchanges WHERE DirectionIn=FALSE;",
									                                                       [],
									                                                       (err, rows) => {
									                                                           getOutKeys(keysObj, err, rows);
									                                                           res.render('index', keysObj);
									                                                       }
								                                                     );
								                                                 }
							                                               );
							                                           }
						                                         );
						                                     }
                                             );
                                         });
                                 });

                                 /* GET set_api_keys page. */
                                 console.log('****** Adding set_api_keys page handler ...');
                                 router.get('/set_api_keys',
                                            (req, res, next) =>
                                            {
                                                let keysObj =
                                                    {
                                                        title: 'SET exchange API keys',
                                                        content: '',
                                                        key: req.body.key || req.query.key,
                                                        key_secret: req.body.key_secret || req.query.key_secret,
                                                        exchange: req.body.exchange || req.query.key_secret,
                                                        subaccount: req.body.subaccount || req.query.subaccount
                                                    };
                                                console.log("*** /set_api_keys: exchange = '"+keysObj.exchange+"'");
                                                res.render('set_api_keys', { 'title': 'SET API Keys', 'exchange': keysObj.exchange });
                                            });

                                 /* GET set_out_api_keys page. */
                                 console.log('****** Adding set_out_api_keys page handler ...');
                                 router.get('/set_out_api_keys',
                                            (req, res, next) =>
                                            {
                                                let keysObj =
                                                    {
                                                        title: 'SET out exchange API Keys',
                                                        content: '',
                                                        key: (req.body.Key || req.query.Key),
                                                        key_secret: (req.body.Secret || req.query.Secret),
                                                        exchange: (req.body.exchange || req.query.exchange),
                                                        subaccount: (req.body.subaccount || req.query.subaccount)
                                                    };
                                                console.log("*** /set_out_api_keys: exchange = '"+keysObj.exchange+"'");
                                                res.render('set_out_api_keys', keysObj);
                                            });

                                 /* POST post_api_keys page. */
                                 console.log('****** Adding post_api_keys page handler ...');
                                 router.post('/post_api_keys',
                                             (req, res, next) =>
                                             {
                                                 let keysObj =
                                                     {
                                                         title: 'POST API Keys',
                                                         content: 'POST API Keys for exchange ',
                                                         key: req.body.key || req.query.key,
                                                         key_secret: req.body.key_secret || req.query.key_secret,
                                                         exchange: req.body.exchange || req.query.exchange,
                                                         subaccount: req.body.subaccount || req.query.subaccount
                                                     };
                                                 console.log("*** /post_api_keys: Key = '"+keysObj.key+
                                                             "', key secret is '"+keysObj.key_secret+
                                                             "', exchange = '"+keysObj.exchange+
                                                             "', subaccount = '"+keysObj.subaccount+"'");
                                                 app.keystoredb.serialize(() => {
                                                     app.keystoredb.all(
                                                         "SELECT Key, Secret, Exchanges.Id AS Id FROM Keys JOIN Exchanges ON Name LIKE ? AND DirectionIn=TRUE WHERE Key == ?;",
                                                         [keysObj.exchange, keysObj.key],
                                                         (err, rows) => {
                                                             console.log('****** Get key record: nb of rows = "'+rows.length+'"');
                                                             if (!rows.length) {
                                                                 app.keystoredb.run("INSERT INTO Keys (Key, ExchangeId, Secret) VALUES ('"+keysObj.key+
                                                                                    "', (SELECT Id FROM Exchanges WHERE Name LIKE '"+keysObj.exchange+
                                                                                    "' LIMIT 1), '"+keysObj.key_secret+"');");
                                                                 console.log('****** /post_api_keys: Added key into Keys (Key, Secret) VALUES ("'+
                                                                             keysObj.key+'", "'+keysObj.key_secret+'");');
                                                                 keysObj['title'].title += 'inserted';
                                                                 keysObj['title'].content = keysObj['title'].title;
                                                                 res.render(
                                                                     'post_api_keys',
                                                                     keysObj
                                                                 );
                                                             }
                                                             else {
                                                                 rows.forEach((row) => {
                                                                     console.log('****** /post_api_keys: Got ftx exchange record with id "'+row.Id+'"');
                                                                     exchangeId = row.Id;
                                                                     app.keystoredb.run("UPDATE Keys SET Key = '"+keysObj.key+
                                                                                        "', Secret = '"+keysObj.key_secret+
                                                                                        "' WHERE ExchangeId = ( SELECT Id FROM Exchanges WHERE Name LIKE '"+keysObj.exchange+
                                                                                        "' LIMIT 1);")
                                                                     console.log('****** /post_api_keys: Modified key into Keys (Key, ExchangeId, Secret) VALUES ("'+
                                                                                 keysObj.key+'", "'+exchangeId+'", "'+keysObj.key_secret+'");');
                                                                     keysObj['title'].title += 'modified';
                                                                     keysObj['title'].content = keysObj['title'].title;
                                                                     res.render(
                                                                         'post_api_keys',
                                                                         keysObj
                                                                     );
                                                                 });
                                                             }
                                                         });
                                                 });
                                             });

                                 /* POST post_out_api_keys page. */
                                 console.log('****** Adding post_out_api_keys page handler ...');
                                 router.post('/post_out_api_keys',
                                             (req, res, next) =>
                                             {
                                                 let keysObj =
                                                     {
                                                         title: 'POST API Keys for out echange ',
                                                         content: 'POST API Keys for out exchange ',
                                                         key: req.body.key || req.query.key,
                                                         key_secret: req.body.key_secret || req.query.key_secret,
                                                         exchange: req.body.exchange || req.query.exchange,
                                                         subaccount: req.body.subaccount || req.query.subaccount
                                                     };
                                                 console.log("*** /post_out_api_keys: Key = '"+keysObj.key+
                                                             "', key secret is '"+keysObj.key_secret+
                                                             "', exchange = '"+keysObj.exchange+
                                                             "', subaccount = '"+keysObj.subaccount+"'");
                                                 app.keystoredb.serialize(() => {
                                                     app.keystoredb.all(
                                                         "SELECT Key, Secret, Exchanges.Id AS Id FROM Keys JOIN Exchanges ON Name LIKE ? AND DirectionIn=FALSE WHERE Key == ?;",
                                                         [keysObj.exchange, keysObj.key],
                                                         (err, rows) => {
                                                             console.log('****** Get key record: nb of rows = "'+rows.length+'"');
                                                             if (!rows.length) {
                                                                 app.keystoredb.run("INSERT INTO Keys (Key, ExchangeId, Secret) VALUES ('"+keysObj.key+
                                                                                    "', (SELECT Id FROM Exchanges WHERE DirectionIn=FALSE AND Name LIKE '"+keysObj.exchange+
                                                                                    "' LIMIT 1), '"+keysObj.key_secret+"');");
                                                                 console.log('****** /post_out_api_keys: Added key into Keys (Key, Secret) VALUES ("'+
                                                                             keysObj.key+'", "'+keysObj.key_secret+'");');
                                                                 keysObj['title'].title += 'inserted';
                                                                 keysObj['title'].content = keysObj['title'].title;
                                                                 res.render(
                                                                     'post_out_api_keys',
                                                                     keysObj
                                                                 );
                                                             }
                                                             else {
                                                                 rows.forEach((row) => {
                                                                     console.log('****** /post_out_api_keys: Got ftx exchange record with id "'+row.Id+'"');
                                                                     exchangeId = row.Id;
                                                                     app.keystoredb.run("UPDATE Keys SET Key = '"+keysObj.key+
                                                                                        "', Secret = '"+keysObj.key_secret+
                                                                                        "' WHERE ExchangeId=(SELECT Id FROM Exchanges WHERE DirectionIn=FALSE AND Name LIKE '"+keysObj.exchange+
                                                                                        "' LIMIT 1);")
                                                                     console.log('****** /post_out_api_keys: Modified key into Keys (Key, ExchangeId, Secret) VALUES ("'+
                                                                                 keysObj.key+'", "'+exchangeId+'", "'+keysObj.key_secret+'");');
                                                                     keysObj['title'].title += 'modified';
                                                                     keysObj['title'].content = keysObj['title'].title;
                                                                     res.render(
                                                                         'post_out_api_keys',
                                                                         keysObj
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
                                 app.locals.keystoredb = keystoredb;
                             }
                         }
                        );
keystoredb.configure('trace', (msg) => {
    console.log("*** [SQLITE3] *** " + msg);
});
console.log('*** Waiting for APP & DB init ...');
module.exports = router;
