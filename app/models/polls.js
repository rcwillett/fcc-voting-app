'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    name: String,
    description: String,
    creator: {id: String, userName: String},
    participants: [{userId: String, uuid: String, optionId: Number}],
    options: [{optionText: String, optionId: Number, numTimesSelected: Number}]
});

module.exports = mongoose.model('PollModel', Poll);