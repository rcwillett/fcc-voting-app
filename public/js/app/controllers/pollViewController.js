angular.module("pollViewControllerModule", ["pollsServiceModule"])
    .controller("pollViewController", ["$routeParams", "$scope", "$rootScope", "$timeout", "pollService", function($routeParams, $scope, $rootScope, $timeout, pollService) {
        $scope.vm = {};

        var vm = $scope.vm;

        initViewModel();

        function initViewModel() {

            vm.unexpectedError = false;
            vm.newOptionFormVisible = false;
            vm.submitSelection = submitSelection;
            vm.submitNewOption = submitNewOption;
            vm.addNewOption = addNewOption;
            vm.inputValidationPattern = /^[\W\S_]/;
            vm.newPollOption = "";

            if ($routeParams.pollId != null && $routeParams.pollId !== "") {
                pollService.getPoll($routeParams.pollId).then(getPollSuccess, requestFailure);
            }
            else {
                window.location.href = "/404";
            }
        }

        function getPollSuccess(serverResp) {
            vm.poll = serverResp.data.pollInfo;
            vm.selectedOption = serverResp.data.userSelection ? serverResp.data.userSelection : "";
        }

        function submitSelection() {
            pollService.vote($routeParams.pollId, vm.selectedOption)
                .then(function(resp) {
                    console.log(resp);
                });
        }

        function submitNewOption() {
            var newOptionId = vm.poll.options.length + 1;
            console.log($scope.newOptionForm);
            console.log($scope.newOptionForm.newPollOption.$error);
            console.log($scope.newOptionForm.$submitted && ($scope.newOptionForm.newPollOption.$error.required || $scope.newOptionForm.newPollOption.$error.pattern));
            if (!$scope.newOptionForm.newPollOption.$error.required && ! $scope.newOptionForm.newPollOption.$error.pattern) {
                pollService.addPollOption($routeParams.pollId, { optionId: newOptionId, optionText: vm.newPollOption }).then(newOptionSuccess, requestFailure);
            }
        }

        function newOptionSuccess(resp) {
            vm.newOptionFormVisible = false;
            displaySuccessMessage();
        }

        function displaySuccessMessage(message) {
            vm.successMessageVisible = true;
            vm.successMessage = message;
            $timeout(function() {
                vm.successMessage = message;
                vm.successMessageVisible = false;
            }, 5000);
        }

        function addNewOption() {
            if ($rootScope.loggedIn) {
                showNewOptionForm();
            }
        }

        function showNewOptionForm() {
            vm.newOptionFormVisible = true;
        }

        function requestFailure(resp) {
            console.error(resp);
            vm.unexpectedError = true;
        }

    }]);
