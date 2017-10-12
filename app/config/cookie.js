var uuidv4 = require("uuid/v4");
var unauthModel = require("../models/unauthenticatedParticipant");
module.exports = function(req, res, next) {
    var cookie = req.cookies.WillittFccVote;
    console.log(req.cookies);
    if (!cookie) {
        createNewCookie(req, res, next);
    }
    else {
        next();
    }

    function createNewCookie(req, res, next) {
        var generatedUuid = uuidv4();
        unauthModel.find({ uuid: generatedUuid }, function(err, unauthFindResult) {
            if (err) {
                console.log(err);
                throw "DB Unauthenticated Find Error";
            }
            else if (unauthFindResult.length === 0) {
                var newUnauthUser = new unauthModel({ uuid: generatedUuid });
                newUnauthUser.save(function(err, saveResult) {
                    if (err) {
                        console.log(err);
                        throw "DB New Unauthenticated User Error";
                    }
                    else {
                        console.log("unauth saved");
                        setCookie(req, res, saveResult.uuid)
                        next();
                    }
                });

            }
            else {
                createNewCookie(req, res, next);
            }
        });
    }

    function setCookie(req, res, uuidNum) {
        res.cookie("WillittFccVote", { uuid: uuidNum});
    }
};