angular.module("pollsServiceModule", [])
.service("pollService", ["$http", function ($http){
    var self = this;
    
    self.getPoll = function(id){
        var url = "/poll/" + id;
        return $http({
            method: "GET",
            url: url
        });
    };
    
    self.getPolls = function(numItems){
        var requestObj = {"numItems" : numItems};
        return $http({
            method: "GET",
            url: "/polls",
            params: requestObj
        });
    };
    
    self.createEditPoll = function(pollObj){
        var requestData = pollObj;
        return $http({
           method: "POST",
           url: "/addPoll",
           data: requestData
        });
    }
    
    self.vote = function(pollId, optionId){
        var requestData = {
            "pollId": pollId,
            "optionId": optionId
        };
        return $http({
           method: "POST",
           url: "/vote",
           data: requestData
        });
    }
    
    return self;
}]);