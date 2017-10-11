'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UnauthenticatedUser = new Schema({
	ips: [String],
	uuid: String
});

module.exports = mongoose.model('User', User);
