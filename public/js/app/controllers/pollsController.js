angular.module("pollControllerModule",["pollsServiceModule"])
.controller("pollController", ["$scope", "pollService", function($scope, pollService){
    $scope.pollArray = [];
    pollService.getPolls(10).then(function(pollResult){
        $scope.pollArray = pollResult.data;
    });
    
}]);