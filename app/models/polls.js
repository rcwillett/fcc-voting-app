'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const optionSchema = new Schema({
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

const creatorSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }
});

const participantSchema = new Schema({
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

const Poll = new Schema({
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