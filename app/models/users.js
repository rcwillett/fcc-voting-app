'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	github: {
		id: String,
		displayName: String,
		username: String,
      publicRepos: Number
	},
   createdPolls: [{id: String, name: String}],
   participatedPolls: [{id: String, name: String}]
});

module.exports = mongoose.model('User', User);
