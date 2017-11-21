'use strict';

const Users = require('../models/users.js');
const pollInfo = require("../../common/models/pollInfo.js");

function UserHandler() {

    this.getUserInfo = function(req, res, next) {
        if (req.user) {
            Users.findOne({ '_id': req.user._id })
                .exec(function(err, result) {
                    if (err) {
                        next(err);
                    }
                    else {
                        res.json(result);
                    }
                });
        }
        else {
            next(new Error("You must login to continue"));
        }
    };

    this.isUserLoggedIn = function(req, res, next){
        if(req.user){
            res.status(200);
            res.json({status: true});
        }
        else{
            res.status(200);
            res.json({status: false});
        }
    }

    // this.addCreatedPoll = function(userId, pollId, pollName) {
    //     return new Promise(function(resolve, reject) {
    //         Users.findOne({ 'github.id': userId }).exec(function(err, result) {
    //             if (err) {
    //                 reject("DB Error Occured");
    //             }
    //             else {
    //                 if (!isPollReferenced(result.createdPolls, pollId)) {
    //                     result.createdPolls.push(new pollInfo(pollId, pollName));
    //                     result.save(function(err, result) {
    //                         if (err) {
    //                             reject("DB Error Occured");
    //                         }
    //                         else {
    //                             resolve("Updated");
    //                         }
    //                     });
    //                 }
    //                 else {
    //                     resolve("Poll participated");
    //                 }
    //             }
    //         });
    //     });
    // };

    // this.addUpdateParticipatedPoll = function(userId, pollId, pollName) {
    //     return new Promise(function(resolve, reject) {
    //         Users.findOne({ 'github.id': userId }).exec(function(err, result) {
    //             if (err) {
    //                 reject("DB Error Occured");
    //             }
    //             else {
    //                 if (!isPollReferenced(result.participatedPolls, pollId)) {
    //                     result.participatedPolls.push(new pollInfo(pollId, pollName));
    //                     result.save(function(err, result) {
    //                         if (err) {
    //                             reject("DB Error Occured");
    //                         }
    //                         else {
    //                             resolve("Updated");
    //                         }
    //                     });
    //                 }
    //                 else {
    //                     resolve("Poll participated");
    //                 }
    //             }
    //         });
    //     });
    // };

    // function isPollReferenced(participatedPolls, pollId) {
    //     var pollParticipated = false;
    //     participatedPolls.forEach(function(pollInfo) {
    //         pollParticipated = pollParticipated || pollInfo.id === pollId;
    //     });
    //     return pollParticipated;
    // }

}

module.exports = UserHandler;