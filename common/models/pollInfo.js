var PollInfo = function(pollId, pollName) {
    this.id = pollId;
    this.name = pollName;
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = PollInfo;
}
else if (typeof angular !== "undefined"){
    angular.module("pollApp")
        .factory("PollInfo", PollInfo);
}