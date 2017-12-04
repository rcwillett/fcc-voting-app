'use strict';
const BodyParser = require("body-parser");
const CookieParser = require('cookie-parser');
const path = process.cwd();
const CookieHandler = require(path + '/server/config/cookie.js');
const PollHandler = require(path + '/server/services/pollHandler.server.js');
const UserHandler = require(path + '/server/services/userHandler.server.js');
const errorHandler = require(path + '/server/utilities/errorHandler.js');
const errorLogger = require(path + '/server/utilities/errorLogger.js');
const noCache = require(path + '/server/utilities/noCache.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.status(401);
			res.send("You must login to access this data");
		}
	}

	const pollHandler = new PollHandler();
	const userHandler = new UserHandler();

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
			res.status(200);
			res.send("");
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
			failureRedirect: '/#!/login?error=true'
		}));
		
	app.route('/isLoggedIn')
	.get(userHandler.isUserLoggedIn);
		
	app.route('/polls')
		.get(pollHandler.getPolls, noCache);

	app.route('/poll/:id')
		.get(pollHandler.getPoll, noCache);
		
	app.route('/userPolls')
		.get(isLoggedIn, pollHandler.getUserPolls, noCache);
		
	app.route('/addPoll')
		.post(isLoggedIn, BodyParser.json(), pollHandler.addPoll, noCache);
		
	app.route('/addPollOption')
		.post(isLoggedIn, BodyParser.json(), pollHandler.addPollOption, noCache);
		
	app.route('/vote')
		.post(CookieParser(), BodyParser.json(), pollHandler.voteOnPoll, noCache);
		
	app.route('/getUserInfo')
		.get(isLoggedIn, userHandler.getUserInfo);
		
	//Route who's only purpose is to test error logging
	app.route('/errorTest')
	.get(function(req, res, next){
		next(new Error("Test Error"));	
	});
	
	app.use(errorLogger);
	app.use(errorHandler);
};
