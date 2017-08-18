angular.module("pollsServiceModule", [])
.service("pollService", ["$http", function ($http){
    var self = this;
    
    self.getPoll = function(id){
        var requestObj = {"id" : id};
        return $http({
            method: "GET",
            url: "/getPoll",
            params: requestObj
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
    
    self.addPoll = function(pollObj){
        var requestData = pollObj;
        return $http({
           method: "POST",
           url: "/addPoll",
           data: requestData
        });
    }
    
    return self;
}]);