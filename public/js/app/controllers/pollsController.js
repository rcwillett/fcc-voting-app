angular.module("pollController",[])
.controller("pollController", ["$scope", "pollService", function($scope, pollService){
    $scope.pollArray = [];
    
    pollService.getPolls(10).then(function(pollResult){
        $scope.pollArray = JSON.parse(pollResult);
    });
    
}]);