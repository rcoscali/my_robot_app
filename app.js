
// Require http-errors for handling www server errors
var createError = require('http-errors');
// Require NodeJS Express framework
var express = require('express');
// Require https for www server with TLS 1.3
const https = require('https');
// Require FS for passing cert&key for https www server
const fs = require('fs');
// Require path for addressing static public dir for www server
var path = require('path');
// Require cookie parser as a middleware for handling cookies in http req/resp headers
var cookieParser = require('cookie-parser');
// Require body parser as a middleware for handling url encoded form params
var bodyParser = require('body-parser');
// Require morgan as a console/debug logger
var logger = require('morgan');
// Require routes index.js as index router
var indexRouter = require('./routes/index');
// Require routes users.js as users router (for resolving ~ notation)
var usersRouter = require('./routes/users');

var app = express();

app.use(function (req, res, next) {
    console.log('Time: %d: %s://%s%s', Date.now(), req.protocol, req.hostname, req.path);
    next();
});

// Views engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Setup logger
app.use(logger('dev'));
// Setup body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Setup cookie parser middleware
app.use(cookieParser());
// Setup static part of the server
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
