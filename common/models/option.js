var OptionModel = function(optionId, optionText){
    this.optionId = optionId;
    this.optionText = optionText;
    this.numTimesSelected = 0;
};

if ( module != null && module.exports) {
    module.exports = OptionModel;
}