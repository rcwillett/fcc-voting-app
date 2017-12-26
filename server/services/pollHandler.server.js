'use strict';

const Poll = require('../models/polls.js');
const PollModel = require('../../common/models/poll.js');
const PollOption = require('../../common/models/option.js');
const userSelection = require('../../common/models/userSelection.js');
const UserHandler = require('../services/userHandler.server.js');

function PollHandler() {

	var userHandler = new UserHandler();

	this.getPoll = function(req, res, next) {
		if (req.params.id) {
			Poll.findOne({ '_id': req.params.id })
				.exec(function(err, result) {
					if (err) { next(err); }
					else {
						var aliasedPoll = new PollModel(result.name, result.description, result.creator.id, result.creator.userName, result.options),
							response = {
								userSelection: null,
								pollInfo: aliasedPoll
							};
						if (req.user) {
							var selectArray = result.participants.filter(function(participant) {
								return participant.userId == req.user.github.id
							});
							response.userSelection = selectArray.length > 0 ? selectArray[0].optionId : null;
						}
						res.json(response);
					}
				});
		}
		else {
			next(new Error("Invalid Poll ID"));
		}
	};

	this.getPolls = function(req, res, next) {
		Poll.find(function(err, results) {
			if (err) {
				next(err);
			}
			else {
				res.status(200);
				res.json(results);
			}
		});
	};

	this.getUserPolls = function(req, res, next) {
		if (req.user) {
			Poll.find({ "creator.id": req.user.github.id }, function(err, results) {
				if (err) {
					next(err);
				}
				else {
					res.status(200);
					res.json(results);
				}
			});
		}
		else {
			res.status(401);
			next(new Error("Login Required"));
		}
	};

	this.addPoll = function(req, res, next) {
		if (req.user) {
			var newPoll = new Poll(new PollModel(req.body.name, req.body.description, req.user.github.id, req.user.github.displayName, req.body.options));
			newPoll.save(function(err, savedNewPoll) {
				if (!err) {
					res.status(200);
					res.json({ pollId: savedNewPoll._id });
				}
				else {
					next(err);
				}
			});
		}
		else {
			res.status(401);
			next(new Error("1"));
		}
	};

	this.editPoll = function(req, res, next) {
		if (req.user) {
			Poll.findOne({ '_id': req.body.pollId })
				.exec(function(err, pollToEdit) {
					const pollData = req.body.pollData;

					if (err) { next(err); }
					else if (pollToEdit === null) {
						next(new Error("Poll Not Found"));
					}
					else if (pollToEdit.creator.id !== req.user.github.id) {
						res.status(403);
						res.json({ status: 2, message: "You are not authorized to edit this poll" });
					}
					else {
						pollData.options.forEach(function(option) {
							option.numTimesSelected = 0;
						});
						pollToEdit.name = pollData.name;
						pollToEdit.description = pollData.description;
						pollToEdit.options = pollData.options;
						pollToEdit.participants = [];


						pollToEdit.save(function(err, updatedPoll) {
							if (err) {
								next(err);
							}
							else {
								res.status(200);
								res.json({ pollId: updatedPoll._id });
							}
						});
					}
				});
		}
		else {
			res.status(401);
			next(new Error("Login Required to access"));
		}
	};

	this.deletePoll = function(req, res, next) {
		if (req.user) {
			Poll.findOne({ '_id': req.body.pollId })
				.exec(function(err, pollToEdit) {
					if (err) { next(err); }
					else if (pollToEdit === null) {
						next(new Error("Poll Not Found"));
					}
					else if (pollToEdit.creator.id !== req.user.github.id) {
						res.status(403);
						res.json({ status: 2, message: "You are not authorized to edit this poll" });
					}
					else {
						Poll.findOneAndRemove({ '_id': req.body.pollId }, function(err, updatedPoll) {
							if (err) {
								next(err);
							}
							else {
								res.status(200);
								res.json(updatedPoll);
							}
						});
					}
				});
		}
		else {
			res.status(401);
			next(new Error("Login Required to access"));
		}
	}

	this.addPollOption = function(req, res, next) {
		if (req.user) {
			Poll.findOne({ '_id': req.body.pollId })
				.exec(function(err, pollToEdit) {

					if (err) { next(err); }
					else {
						const newOptionId = pollToEdit.options.length;
						pollToEdit.options.push(new PollOption(newOptionId, req.body.optionText));
						pollToEdit.save(function(err, result) {
							if (err) { next(err); }
							else {
								res.status(200);
								res.json({ status: 0, message: "Poll Option Addition Successful", data: result });
							}
						});
					}
				});
		}
		else {
			res.status(401);
			next(new Error("Login Required to access"));
		}
	};

	this.voteOnPoll = function(req, res, next) {
		var cookie = req.cookies.WillittFccVote;
		Poll.findOne({ '_id': req.body.pollId },
			function(err, votingPoll) {
				var selectedOption,
					userVoted = false;
				if (err || votingPoll == null) {
					next(new Error(err || "Poll Not Found"));
				}
				else {
					if (req.user) {
						votingPoll.participants.forEach(function(userInfo, index, participantArray) {
							if (req.user.github.id === userInfo.userId) {
								userVoted = true;
								adjustOption(votingPoll.options, userInfo.optionId, -1);
								userInfo.optionId = req.body.optionId;
								adjustOption(votingPoll.options, req.body.optionId, 1);
							}
						});
						if (!userVoted) {
							adjustOption(votingPoll.options, req.body.optionId, 1);
							votingPoll.participants.push(new userSelection(req.user.github.id, "", req.body.optionId));
						}
						savePoll();
					}
					else if (cookie) {
						votingPoll.participants.forEach(function(userInfo, index, participantArray) {
							if (cookie.uuid === userInfo.uuid) {
								userVoted = true;
								adjustOption(votingPoll.options, userInfo.optionId, -1);
								userInfo.optionId = req.body.optionId;
								adjustOption(votingPoll.options, req.body.optionId, 1);
							}
						});
						if (!userVoted) {
							adjustOption(votingPoll.options, req.body.optionId, 1);
							votingPoll.participants.push(new userSelection("", cookie.uuid, req.body.optionId));
						}
						savePoll();
					}
					else {
						res.status(401);
						next(new Error("Login Required To Access"));
					}
				}

				function savePoll() {
					votingPoll.save(function(err, updatedPoll) {
						if (err) {
							next(new Error(err));
						}
						else {
							var aliasedResult = new PollModel(updatedPoll.name, updatedPoll.description, updatedPoll.creator.id, updatedPoll.creator.userName, updatedPoll.options);
							res.status(200);
							res.json(updatedPoll);
						}
					});
				}
			}
		);
	};

	function adjustOption(pollOptions, selectedId, adjustment) {
		for (var i = 0; i < pollOptions.length; i++) {
			if (pollOptions[i].optionId === selectedId) {
				pollOptions[i].numTimesSelected += adjustment;
				return;
			}
		}
	}
}

module.exports = PollHandler;