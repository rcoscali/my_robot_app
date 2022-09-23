var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { 'title': 'Express', 'content': 'Content' });
});

/* GET set_api_keys page. */
router.get('/set_api_keys', function(req, res, next) {
    res.render('set_api_keys', { 'title': 'SET API Keys' });
});

/* POST post_api_keys page. */
router.post('/post_api_keys', function(req, res, next) {
    var key = req.body.key;
    var key_secret = req.body.key_secret;
    console.log("*** Key = "+key+", key secret is "+key_secret);
    res.render('post_api_keys', { 'title': 'POST API Keys', 'key': key, 'key_secret': key_secret });
});

module.exports = router;
