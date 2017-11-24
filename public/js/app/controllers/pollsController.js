(function() {
    angular.module("pollApp")
        .controller("pollController", ["$scope", "pollService", function($scope, pollService) {
            $scope.pollArray = [];
            pollService.getPolls(10).then(function(pollResult) {
                $scope.pollArray = pollResult.data;
            });
        }]);
}());
