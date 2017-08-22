'use strict';

var Poll = require('../models/polls.js');

function PollHandler() {

	this.getPoll = function(req, res) {
		Poll.findOne({ '_id': req.params.id })
			.exec(function(err, result) {
				if (err) { throw err; }
				res.json(result);
			});
	};

	this.getPolls = function(req, res) {
		console.log(req.query.numItems);
		Poll.find(function(err, results) {
			console.log(results);
			if (!err)
				res.json(results);
		});
	};

	this.addPoll = function(req, res) {
		if (req.user) {
			var pollValid = validatePoll(req.body);
			if (pollValid.isValid) {
				var newPoll = new Poll(req.body);
				newPoll.save(function(err, newPoll) {
					if (!err) {
						res.redirect("/poll/" + newPoll._id);
					}
					else {
						res.json({ isValid: false, message: "Failed to add poll" })
					}
				});
			}
			else {
				res.json(pollValid)
			}
		}
		else {
			res.redirect("/login");
		}
	};
	this.voteOnPoll = function(req, res) {
		Poll.findOne({ '_id': req.body.pollId },
			function(err, votingPoll) {
				if (err || votingPoll == null) {
					res.status(500);
					res.send("Poll Not Found");
				}
				else {
					votingPoll.options.forEach(function(option) {
						if (option.optionId === req.body.optionId) {
							console.log(option.optionText);
							option.numTimesSelected++;
							res.status(200);
						}
					});
					votingPoll.save(function(err, updatedPoll) {
						if (err) {
							res.status(500);
						}
						else {
							res.json(updatedPoll);
						}
					});
				}
			}
		);
	}

	function validatePoll(pollObj) {
		if (pollObj.name && pollObj.creator && pollObj.creator.id && pollObj.options.length) {
			return { isValid: true };
		}
		else {
			return { isValid: false, message: "Invalid poll data Provided" };
		}
	}
}

module.exports = PollHandler;