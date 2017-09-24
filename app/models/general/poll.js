var optionModel = require('./option.js');

var pollModel = function(name, description, creatorId, creatorUserName, options){
    var self = this;
    this.name = name;
    this.description = description;
    this.creator = {id: creatorId, userName: creatorUserName};
    this.options = initializeOptions(options);
    this.participants = [];
    
    function initializeOptions(initOptions){
        var result = [];
        initOptions.forEach(function(initOption){
            result.push(new optionModel(initOption));
        });
        return result;
    }
};

module.exports = pollModel;