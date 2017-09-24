var optionModel = function(optionObject){
    this.optionId = optionObject.optionId;
    this.optionText = optionObject.optionText;
    this.numTimesSelected = 0;
};

module.exports = optionModel;