var optionModel = function(optionObject){
    this.optionId = optionObject.optionId;
    this.optionText = optionObject.optionText;
    this.numTimesSelected = 0;
};

if ( module != null && module.exports) {
    module.exports = optionModel;
}