'use strict';

var Poll = require('../models/polls.js');

function PollHandler () {

	this.getPoll = function (req, res) {
		Poll.findOne({ 'poll._id': req.params.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }
				res.json(result);
			});
	};
	
	this.getPolls = function(req, res){
	    Poll.find().limit(req.params.numItems).exec(function(err, results){
	        if(!err)
	            res.json(results);
	    });
	}
	
	this.addPoll = function(req, res){
	    if(req.user){
	        var pollValid = validatePoll(req.body);
	        if(pollValid.isValid){
	            var newPoll = new Poll(req.body);
	            newPoll.save(function(err, newPoll){
	                if(!err){
	                    res.redirect("/poll/"+newPoll._id);
	                }
	                else{
	                    res.json({isValid: false, message: "Failed to add poll"})
	                }
	            });
	        }
	        else{
	            res.json(pollValid)
	        }
	    }
	    else{
	        res.redirect("/login");
	    }
	};
	
	function validatePoll(pollObj){
	    if(pollObj.name && pollObj.creator && pollObj.creator.id && pollObj.options.length){
	        return {isValid: true};
	    }
	    else{
	        return {isValid: false, message: "Invalid poll data Provided"};
	    }
	}
}

module.exports = PollHandler;