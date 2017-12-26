(function() {
    angular.module("pollApp")
        .controller("pollStatsController", ["$routeParams", "$scope", "$timeout", "chartService", "pollService", function($routeParams, $scope, $timeout, chartService, pollService) {
            $scope.vm = {};
            var vm = $scope.vm;
            vm.unexpectedError = false;
            vm.optionResults = [];
            if ($routeParams.pollId != null && $routeParams.pollId !== "") {
                pollService.getPoll($routeParams.pollId).then(
                    function(serverResp) {
                        vm.poll = serverResp.data.pollInfo;
                        var optionNames = [];
                        var optionVotes = [];

                        vm.poll.options.forEach(function(option, index, optionArray) {
                            optionNames.push(option.optionText);
                            optionVotes.push(option.numTimesSelected);
                        });
                        chartService.initBarChart("bar-chart-results", optionNames, optionVotes);
                        chartService.initPieChart("pie-chart-results", optionNames, optionVotes);
                    },
                    function(serverResp) {
                        vm.unexpectedError = true;
                    }
                );
            }
            else {
                window.location.href = "/404";
            }

        }]);
}());
