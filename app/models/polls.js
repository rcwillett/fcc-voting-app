'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var optionSchema = new Schema({
    optionText: {
        type: String,
        required: true
    },
    optionId: {
        type: Number,
        required: true
    },
    numTimesSelected: {
        type: Number,
        default: 0
    }
});

var creatorSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }
});

var participantSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    uuid: {
        type: Number,
        required: true
    },
    optionId: {
        type: Number,
        required: true
    }
});

var Poll = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    creator: creatorSchema,
    participants: [participantSchema],
    options: [optionSchema]
});

module.exports = mongoose.model('PollModel', Poll);