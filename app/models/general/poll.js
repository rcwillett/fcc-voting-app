var pollModel = function(name, description, creatorId, creatorUserName, options){
    this.name = name;
    this.description = description;
    this.creator = {id: creatorId, userName: creatorUserName};
    this.options = options;
    this.participants = [];
};

module.exports = pollModel;