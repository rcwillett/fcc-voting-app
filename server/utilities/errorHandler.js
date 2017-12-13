
const errorHandler = function(err, req, res, next) {
        if (err) {
            if (res.statusCode === 403 || res.statusCode === 401) {
                console.warn(res.statusCode);
                res.status(401);
                res.json({"message":"You Must Login To Continue"});
            }
            else {
                console.warn(err);
                res.status(500);
                res.json({"message": err.message});
            }
        }
};

module.exports = errorHandler;