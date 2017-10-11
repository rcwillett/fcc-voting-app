var uuidv4 = require("uuid/v4");
var unauthModel = require("../models/unauthenticatedParticipant");
Module.exports = function(req, res, next) {
    var cookie = req.cookies.WillittFccVote;
    if (!cookie) {
        generateUnauthProfile(req, res, next);
    }
    else {
        checkForUuid(req, res, next, cookie.uuid);
    }

};

function generateUnauthProfile(req, res, next) {
    unauthModel.find(function(err, resp) {
        if (err) {
            throw "DB Unauthenticated Find Error";
        }
        else {
            if (resp) {
                for(var unauthUser in resp){
                    for(var ip in resp[unauthUser].ips){
                        if(resp[unauthUser].ips[ip] === req.ip){
                            res.cookie("WillittFccVote", { uuid: resp[unauthUser].uuid });
                            next();
                        }
                    }
                }
                createNewCookie(req, res, next);
            }
        }
    });
}

function checkForUuid(req, res, next, uuid){
        unauthModel.find(function(err, resp) {
        if (err) {
            throw "DB Unauthenticated Find Error";
        }
        else {
            if (resp) {
                for(var unauthUser in resp){
                    if(resp[unauthUser].uuid === uuid){
                        resp[unauthUser].ips.push(req.ip);
                        setCookie(res, resp[unauthUser].uuid);
                    }
                }
            }
        }
        next();
    });
}

function createNewCookie(req, res, next){
    var generatedUuid = uuidv4();
    unauthModel.find({uuid: generatedUuid}, function (err, unauthFindResult){
        if (err) {
            throw "DB Unauthenticated Find Error";
        }
        else{
            if(!unauthFindResult){
                var newUnauthUser = new unauthModel({ip: [req.ip], uuid: generatedUuid});
                newUnauthUser.save(function(err, saveResult){
                   if(err){
                       throw "DB New Unauthenticated User Error";
                   } 
                   else{
                       setCookie(res, saveResult.uuid)
                       next();
                   }
                });
            }
        }
    });
}
function setCookie (res, uuidNum) {
    res.cookie("WillittFccVote", { uuid: uuidNum });
}