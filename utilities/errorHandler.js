var errorHandler = function(err, req, res, next){
    if(err){
        console.warn(err);
        res.status(500);
        res.send({status: 0, message: "Unexpected Error"});
    }
};

module.exports = errorHandler;