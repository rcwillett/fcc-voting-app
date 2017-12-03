'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OptionSchema = new Schema({
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

const CreatorSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }
});

const ParticipantSchema = new Schema({
    userId: {
        type: String,
        required: false
    },
    uuid: {
        type: String,
        required: false
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
    creator: CreatorSchema,
    participants: [ParticipantSchema],
    options: [OptionSchema]
});

module.exports = mongoose.model('PollModel', Poll);