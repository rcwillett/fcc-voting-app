angular.module("createPollModule", [])
    .controller("createEditPollController", ["$scope", "$timeout", "$route", "$routeParams", "pollService", "appConstants", function createEditPollController($scope, $timeout, $route, $routeParams, pollService, appConstants) {
        $scope.vm = {};
        var vm = $scope.vm;
        vm.addOption = addOption;
        vm.removeOption = removeOption;
        vm.submitPoll = submitPoll;
        
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
                    },
                    function(serverResp) {
                        vm.unexpectedError = true;
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
            scopeApply();
        }

        function addOption() {
            vm.errorMsg = "";
            if (vm.pollOptions.length === 0 || vm.pollOptions[vm.pollOptions.length-1].optionText !== "") {
                var pollOptionId = vm.pollOptions.length;
                vm.pollOptions.push({ optionId: pollOptionId, optionText: "" });
            }
            else {
                vm.errorMsg = "The poll option text must not be empty before adding another option"
            }
            scopeApply();
        }

        function removeOption(optionId) {
            vm.pollOptions.splice(optionId, 1);
            vm.pollOptions.forEach(function(option, index) {
                option.optionId = index;
            });
            scopeApply();
        }

        function submitPoll() {
            vm.errorMsg = "";
            if (vm.pollOptions.length > 1 && $route.current.$$route.createEdit === appConstants.createEditEnum.edit) {
                pollService.editPoll(new pollObject(vm.pollId, vm.pollTitle, vm.pollDescription, vm.pollOptions))
                    .then(successfulPollCreation, failedPollCreation);
            }
            else if(vm.pollOptions.length > 1) {
                pollService.createPoll(new pollObject(vm.pollId, vm.pollTitle, vm.pollDescription, vm.pollOptions))
                    .then(successfulPollCreation, failedPollCreation);
            }
            else{
                vm.errorMsg = "You must have at least one option for your poll";
            }
        }

        function successfulPollCreation(res) {
            window.location = "/#!/viewPoll/" + res.data.pollId;
        }

        function failedPollCreation(res) {
            if(res.status === 401 || res.status === 403){
                window.location.href = "/#!/login";
            }
            else{
                vm.error = true;
                vm.errorMessage = res.message;
            }
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