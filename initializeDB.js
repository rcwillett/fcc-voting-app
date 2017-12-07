'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('dotenv').load();
mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

var UnauthenticatedUser = new Schema({
	uuid: String
});


console.log("Made Schema");

var UnauthenticatedUser = mongoose.model('UnauthenticatedUser', UnauthenticatedUser);

var newUnauthenticatedUser = new UnauthenticatedUser({uuid: "0000"});

newUnauthenticatedUser.save(function(err, result){
    if(!err){
        console.log(result);
    }
});