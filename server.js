'use strict';

var express = require('express');
var routes = require('./server/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var errorHandler = require('./server/utilities/errorHandler.js');
var errorLogger = require('./server/utilities/errorLogger.js');

var app = express();
require('dotenv').load();
require('./server/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
mongoose.Promise = global.Promise;

app.use('/controllers', express.static(process.cwd() + '/server/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/server/common'));
//app.use('/scripts/libs', express.static(process.cwd() + '/node_modules/'));
app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(errorLogger);
app.use(errorHandler);

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
