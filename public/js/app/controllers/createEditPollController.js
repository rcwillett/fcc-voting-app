angular.module("createPollModule", [])
    .controller("createEditPollController", ["$scope", "$timeout", "$route", "$routeParams", "pollService", "appConstants", function createEditPollController($scope, $timeout, $route, $routeParams, pollService, appConstants) {
        $scope.vm = {};
        var vm = $scope.vm;

        initData();

        function initData() {
            if ($route.current.$$route.createEdit === appConstants.createEditEnum.edit) {
                pollService.getPoll($routeParams.pollId).then(
                    function(serverResp) {
                        vm.pollId = serverResp.data.pollInfo.id
                        vm.pollTitle = serverResp.data.pollInfo.name
                        vm.pollDescription = serverResp.data.pollInfo.description;
                        vm.pollOptions = serverResp.data.pollInfo.options;
                        vm.submitText = "Update Poll";
                        scopeApply();
                    },
                    function(serverResp) {
                        vm.unexpectedError = true;
                        scopeApply();
                    }
                );
            }
            else {
                vm.pollTitle = "";
                vm.pollDescription = "";
                vm.pollId = null;
                vm.pollOptions = [];
                vm.submitText = "Create Poll";
            }
            vm.addOption = addOption;
            vm.removeOption = removeOption;
            vm.submitPoll = submitPoll;
        }

        function addOption() {
            // if (vm.newOptionText) {
            var pollOptionId = vm.pollOptions.length;
            vm.pollOptions.push({ optionId: pollOptionId, optionText: "" });
            //vm.newOptionText = "";
            scopeApply();
            // }
        }

        function removeOption(optionId) {
            vm.pollOptions.splice(optionId, 1);
            vm.pollOptions.forEach(function(option, index) {
                option.id = index;
            });
            scopeApply();
        }

        function submitPoll() {
            if ($route.current.$$route.createEdit === appConstants.createEditEnum.edit) {
                pollService.editPoll(new pollObject(vm.pollId, vm.pollTitle, vm.pollDescription, vm.pollOptions))
                    .then(successfulPollCreation, failedPollCreation);
            }
            else {
                pollService.createPoll(new pollObject(vm.pollId, vm.pollTitle, vm.pollDescription, vm.pollOptions))
                    .then(successfulPollCreation, failedPollCreation);
            }
        }

        function successfulPollCreation(res) {
            window.location = "/#!/viewPoll/" + res.data.pollId;
        }

        function failedPollCreation(res) {
            vm.error = true;
            vm.errorMessage = res.message;
        }

        function pollObject(pollId, pollName, pollDescription, pollOptions) {
            this.pollId = pollId;
            this.name = pollName;
            this.description = pollDescription;
            this.options = pollOptions;
        }

        function scopeApply() {
            $timeout(function() { $scope.$apply(); });
        }

    }]);