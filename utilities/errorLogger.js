var fs = require("fs");

var errorLogger = function(err, req, res, next) {
    if (!(res.statusCode === 403 || res.statusCode === 401)) {
        fs.writeFile("error.log", err.toString(), function(writeErr) {
            if (writeErr)
                next(writeErr);
            else {
                next(err);
            }
        });
    }
};

module.exports = errorLogger;