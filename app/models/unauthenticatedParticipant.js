'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UnauthenticatedUser = new Schema({
	uuid: String
});

module.exports = mongoose.model('UnauthenticatedUser', UnauthenticatedUser);
