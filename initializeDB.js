'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/polls");
mongoose.Promise = global.Promise;

var Poll = new Schema({
    name: String,
    creator: {id: String, userName: String},
    participants: [{userId: String, optionId: Number}],
    options: [{optionText: String, optionId: Number, numTimesSelected: Number}]
});

console.log("Made Schema");

var PollModel = mongoose.model('PollModel', Poll);

var Poll1 = new PollModel({
    name: "Sweet Poll 1",
    creator:{id: 1, userName: "coolUser1"},
    participants: [],
    options: [{optionText: "Sweet Option 1", optionId: 1, numTimesSelected: 0}, {optionText: "Sweet Option 2", optionId: 2, numTimesSelected: 0}]
});
Poll1.save(function (err, fluffy) {
  if (err) return console.error(err);
  console.log(fluffy);
});

var Poll2 = new PollModel({
    name: "Sweet Poll 2",
    creator:{id: 1, userName: "coolUser1"},
    participants: [],
    options: [{optionText: "Sweet Option 1", optionId: 1, numTimesSelected: 0}, {optionText: "Sweet Option 2", optionId: 2, numTimesSelected: 0}]
});
Poll2.save(function (err, fluffy) {
  if (err) return console.error(err);
  console.log(fluffy);
});