if (typeof require !== "undefined") {
    const OptionModel = require('./option.js');
}

const PollModel = function(name, description, creatorId, creatorUserName, options) {
    var self = this;
    this.name = name;
    this.description = description;
    this.creator = { id: creatorId, userName: creatorUserName };
    this.options = initializeOptions(options);

    function initializeOptions(initOptions) {
        var result = [];
        initOptions.forEach(function(initOption) {
            result.push(new OptionModel(initOption));
        });
        return result;
    }
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = PollModel;
}
else if (typeof angular !== "undefined"){
    angular.module("pollApp")
        .factory("PollModel", PollModel);
}