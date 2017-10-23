'use strict';

var BodyParser = require("body-parser");
var CookieParser = require('cookie-parser');
var path = process.cwd();
var CookieHandler = require(path + '/app/config/cookie.js');
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');
var UserHandler = require(path + '/app/controllers/userHandler.server.js');
module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.status(401);
			res.send("You must login to access this data");
		}
	}

	var pollHandler = new PollHandler();
	var userHandler = new UserHandler();

	app.route('/')
		.get(CookieParser(), CookieHandler, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
		
	app.route('/isLoggedIn')
	.get(userHandler.isUserLoggedIn);
		
	app.route('/polls')
		.get(pollHandler.getPolls);

	app.route('/poll/:id')
		.get(pollHandler.getPoll);
		
	app.route('/userPolls')
		.get(isLoggedIn, pollHandler.getUserPolls);
		
	app.route('/addPoll')
		.post(isLoggedIn, BodyParser.json(), pollHandler.addPoll);
		
	app.route('/vote')
		.post(CookieParser(), BodyParser.json(), pollHandler.voteOnPoll);
		
	app.route('/getUserInfo')
		.get(isLoggedIn, userHandler.getUserInfo);
};
