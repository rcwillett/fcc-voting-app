'use strict';

var BodyParser = require("body-parser");
var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');
var UserHandler = require(path + '/app/controllers/userHandler.server.js');
module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var pollHandler = new PollHandler();
	var userHandler = new UserHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
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
		
	app.route('/polls')
		.get(pollHandler.getPolls);

	app.route('/poll/:id')
		.get(isLoggedIn, pollHandler.getPoll);
		
	app.route('/addPoll')
		.post(isLoggedIn, BodyParser.json(), pollHandler.addPoll);
		
	app.route('/vote')
		.post(BodyParser.json(), pollHandler.voteOnPoll);
		
	app.route('/getUserInfo')
		.get(userHandler.getUserInfo);
};
