(function() {
    angular.module("pollApp")
        .controller("pollViewController", ["$routeParams", "$scope", "$rootScope", "$timeout", "pollService", "notificationService", function($routeParams, $scope, $rootScope, $timeout, pollService, notificationService) {
            $scope.vm = {};

            var vm = $scope.vm;

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
                vm.poll = serverResp.data.pollInfo;
                vm.selectedOption = serverResp.data.userSelection ? vm.poll.options[serverResp.data.userSelection] : vm.poll.options[0];
                vm.facebookShareLink = 'https://www.facebook.com/sharer/sharer.php?u=' + window.encodeURI(window.location.href);
                vm.twitterShareLink = 'https://twitter.com/home?status=' + window.encodeURI(window.location.href);
            }

            function submitSelection() {
                pollService.vote($routeParams.pollId, vm.selectedOption.optionId)
                    .then(function(resp) {
                        notificationService.success("Option Selection Successful");
                    });
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
                notificationService.failure(resp.message);
            }

        }]);
}());