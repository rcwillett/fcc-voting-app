

var errorHandler = function(err, req, res, next){
    if(err){
        if (!(res.statusCode === 403 || res.statusCode === 401)) {
            res.send("You Must Login To Continue");
        }
        console.warn(err);
        res.status(500);
        res.send(err.message);
    }
};

module.exports = errorHandler;