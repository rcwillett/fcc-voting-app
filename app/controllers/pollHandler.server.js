'use strict';

var Poll = require('../models/polls.js');
var pollModel = require('../models/general/poll.js');
var userSelection = require('../models/general/userSelection.js');
var UserHandler = require('../controllers/userHandler.server.js');

function PollHandler() {

	var userHandler = new UserHandler();

	this.getPoll = function(req, res) {
		Poll.findOne({ '_id': req.params.id })
			.exec(function(err, result) {
				var response = {
					userSelection: null,
					pollInfo: result
				};
				if (err) { throw err; }
				if (req.user) {
					var selectArray = result.participants.filter(function(participant) {
						return participant.userId == req.user.github.id
					});
					response.userSelection = selectArray.length > 0 ? selectArray[0].optionId : null;
				}
				res.json(response);
			});
	};

	this.getPolls = function(req, res) {
		Poll.find(function(err, results) {
			if (!err)
				res.json(results);
		});
	};

	this.addPoll = function(req, res) {
		if (req.user) {
			req.body.options.forEach(function(option){
				option.numTimesSelected = 0;
			});
			//var pollValid = validatePoll(req.body);
			if (true) {
				var newPoll = new Poll(new pollModel(req.body.name, req.body.description, req.user.github.id, req.user.github.displayName, req.body.options));
				newPoll.save(function(err, newPoll) {
					if (!err) {
						res.status(200);
						console.log(newPoll._id);
						res.json({ pollId: newPoll._id });
					}
					else {
						res.status(500);
						res.json({ message: "Failed to add poll" })
					}
				});
			}
			else {
				res.status(500);
				res.json({ message: "Invalid Poll"});
			}
		}
		else {
			res.json({ message: "User Must Log In"});
		}
	};

	this.voteOnPoll = function(req, res) {
		Poll.findOne({ '_id': req.body.pollId },
			function(err, votingPoll) {
				var selectedOption,
					userVoted = false;
				if (err || votingPoll == null) {
					res.status(500);
					res.send("Poll Not Found");
				}
				else {
					if (req.user) {
						userHandler.addUpdateParticipatedPoll(req.user.github.id, req.body.pollId, votingPoll.name).then(
							function(successResp) {
								votingPoll.participants.forEach(function(userInfo) {
									if (req.user.github.id === userInfo.userId) {
										userVoted = true;
										adjustOption(votingPoll.options, userInfo.optionId, -1);
										userInfo.optionId = req.body.optionId;
										adjustOption(votingPoll.options, req.body.optionId, 1);
									}
								});
								if (!userVoted) {
									adjustOption(votingPoll.options, req.body.optionId, 1, res);
									votingPoll.participants.push(new userSelection(req.user.github.id, req.body.optionId));
								}
								res.status(200);
							},
							function(errorResp) {
								res.status(500);
								res.send("Unexpected Error Occured")
							});
					}
					else {
						adjustOption(votingPoll.options, req.body.optionId, 1);
						res.status(200);
					}
					votingPoll.save(function(err, updatedPoll) {
						if (err) {
							res.status(500);
							res.send("Unexpected Error Occured")
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

	function adjustOption(pollOptions, selectedId, adjustment) {
		pollOptions.forEach(function(option) {
			if (option.optionId === selectedId) {
				option.numTimesSelected += adjustment;
			}
		});
	}

}

module.exports = PollHandler;