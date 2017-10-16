var fs = require("fs");

var errorLogger = function(err, req, res, next) {
    fs.writeFile("error.log", err.toString(), function(writeErr) {
        if (writeErr)
            next(writeErr);
        else {
            next(err);
        }
    });
};

module.exports = errorLogger;