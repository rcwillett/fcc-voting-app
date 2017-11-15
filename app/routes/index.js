'use strict';

const BodyParser = require("body-parser");
const CookieParser = require('cookie-parser');
const path = process.cwd();
const CookieHandler = require(path + '/app/config/cookie.js');
const PollHandler = require(path + '/app/services/pollHandler.server.js');
const UserHandler = require(path + '/app/services/userHandler.server.js');
const errorHandler = require(path + '/utilities/errorHandler.js');
const errorLogger = require(path + '/utilities/errorLogger.js');

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
		.get(pollHandler.getPolls);

	app.route('/poll/:id')
		.get(pollHandler.getPoll);
		
	app.route('/userPolls')
		.get(isLoggedIn, pollHandler.getUserPolls);
		
	app.route('/addPoll')
		.post(isLoggedIn, BodyParser.json(), pollHandler.addPoll);
		
	app.route('/addPollOption ')
		.post(isLoggedIn, BodyParser.json(), pollHandler.addPollOption);
		
	app.route('/vote')
		.post(CookieParser(), BodyParser.json(), pollHandler.voteOnPoll);
		
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
