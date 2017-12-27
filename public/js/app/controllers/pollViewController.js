(function() {
    angular.module("pollApp")
        .controller("pollViewController", ["$routeParams", "$scope", "$rootScope", "$timeout", "chartService", "pollService", "notificationService", function($routeParams, $scope, $rootScope, $timeout, chartService, pollService, notificationService) {
            $scope.vm = {};

            var vm = $scope.vm,
                pieChart,
                pieChartSelector = "pie-chart-results";

            initViewModel();

            function initViewModel() {

                vm.unexpectedError = false;
                vm.newOptionFormVisible = false;
                vm.addNewOptionVisible = true;
                vm.submitSelection = submitSelection;
                vm.submitNewOption = submitNewOption;
                vm.addNewOption = addNewOption;
                vm.inputValidationPattern = /[a-zA-Z0-9]/;
                vm.newPollOption = "";

                if ($routeParams.pollId != null && $routeParams.pollId !== "") {
                    pollService.getPoll($routeParams.pollId).then(getPollSuccess, requestFailure);
                }
                else {
                    window.location.href = "/404";
                }
            }

            function getPollSuccess(serverResp) {
                var optionNames = serverResp.data.pollInfo.options.map(function(option) {
                        return option.optionText;
                    }),
                    optionVotes = serverResp.data.pollInfo.options.map(function(option) {
                        return option.numTimesSelected;
                    });;

                vm.poll = serverResp.data.pollInfo;
                vm.selectedOption = serverResp.data.userSelection ? vm.poll.options[serverResp.data.userSelection] : vm.poll.options[0];
                vm.facebookShareLink = 'https://www.facebook.com/sharer/sharer.php?u=' + window.encodeURI(window.location.href);
                vm.twitterShareLink = 'https://twitter.com/home?status=' + window.encodeURI(window.location.href);

                pieChart = chartService.initPieChart(pieChartSelector, optionNames, optionVotes);
            }

            function submitSelection() {
                pollService.vote($routeParams.pollId, vm.selectedOption.optionId)
                    .then(voteSuccess, requestFailure);
            }

            function voteSuccess(resp) {
                resetChart(resp.data.pollInfo);
                if(resp.data.userVoted){
                    notificationService.success("Vote Changed to " + vm.selectedOption.optionText);
                }
                else{
                    notificationService.success("Vote Successful!");
                }
            }


            function submitNewOption() {
                if (!$scope.newOptionForm.newPollOption.$error.required && !$scope.newOptionForm.newPollOption.$error.pattern) {
                    pollService.addPollOption($routeParams.pollId, vm.newPollOption).then(newOptionSuccess, requestFailure);
                }
            }

            function newOptionSuccess(resp) {
                vm.newOptionFormVisible = false;
                vm.addNewOptionVisible = false;
                vm.poll = resp.data.data;
                resetChart(resp.data.data);
                notificationService.success("New Option Added");
            }

            function addNewOption() {
                if ($rootScope.loggedIn) {
                    showNewOptionForm();
                }
            }

            function showNewOptionForm() {
                vm.newOptionFormVisible = true;
                vm.addNewOptionVisible = false;
            }

            function requestFailure(resp) {
                notificationService.error(resp.message);
            }

            function resetChart(pollData) {
                pieChart.destroy();
                initChart(pollData);
            }

            function initChart(pollData){
                                var optionNames = pollData.options.map(function(option) {
                        return option.optionText;
                    }),
                    optionVotes = pollData.options.map(function(option) {
                        return option.numTimesSelected;
                    });;
                    chartService.initPieChart(pieChartSelector, optionNames, optionVotes);
            }

        }]);
}());