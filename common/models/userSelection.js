var UserSelection = function(userId, uuid, userOption) {
    this.userId = userId;
    this.uuid = uuid;
    this.optionId = userOption;
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = UserSelection;
}
else if (typeof angular !== "undefined"){
    angular.module("pollApp")
        .factory("UserSelection", UserSelection);
}