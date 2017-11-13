const fs = require("fs");
const path = process.cwd();

const errorLogger = function(err, req, res, next) {
    if (!(res.statusCode === 403 || res.statusCode === 401)) {
        fs.appendFile(path + "/error.log", err.toString() + "Time: " + new Date().toDateString() + "\n", function(writeErr) {
            if (writeErr){
                next(writeErr);
            }
            else {
                next(err);
            }
        });
    }
};

module.exports = errorLogger;