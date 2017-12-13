(function() {
    angular.module("pollApp")
        .controller("createEditPollController", ["$scope", "$timeout", "$route", "$routeParams", "OptionModel", "PollModel", "pollService", "appConstants", "notificationService", createEditPollController]);

    function createEditPollController($scope, $timeout, $route, $routeParams, OptionModel, PollModel, pollService, appConstants, notificationService) {
        $scope.vm = {};
        var vm = $scope.vm;
        vm.addOption = addOption;
        vm.addOptionError = false;
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
                vm.pollOptions = [new OptionModel(0, "", 0)];
                vm.submitText = "Create Poll";
            }
        }

        function addOption() {
            var allOptionsNonEmpty = validateOptions();
            
            vm.addOptionError = false;
            
            if (vm.pollOptions.length === 0 || allOptionsNonEmpty) {
                var pollOptionId = vm.pollOptions.length;
                vm.pollOptions.push({ optionId: pollOptionId, optionText: "" });
            }
            else {
                vm.addOptionError = true;
                notificationService.error("Form error. Please ensure the form fields are filled correctly");
            }
        }

        function removeOption(optionId) {
            vm.pollOptions.splice(optionId, 1);
            vm.pollOptions.forEach(function(option, index) {
                option.optionId = index;
            });
        }

        function submitPoll() {
            if (vm.pollOptions.length > 1 && $route.current.$$route.createEdit === appConstants.createEditEnum.edit) {
                pollService.editPoll(new pollObject(vm.pollId, vm.pollTitle, vm.pollDescription, vm.pollOptions))
                    .then(successfulPollCreation, failedPollCreation);
            }
            else if (vm.pollOptions.length > 1 && vm.pollTitle) {
                pollService.createPoll(new pollObject(vm.pollId, vm.pollTitle, vm.pollDescription, vm.pollOptions))
                    .then(successfulPollCreation, failedPollCreation);
            }
            else {
                notificationService.error("Form Error. Please ensure the form fields are filled correctly.");
            }
        }

        function successfulPollCreation(res) {
            window.location = "/#!/viewPoll/" + res.data.pollId;
        }

        function failedPollCreation(res) {
            if (res.status === 401 || res.status === 403) {
                window.location.href = "/#!/login";
            }
            else {
                notificationService.error(res.message);
            }
        }
        
        function validateOptions(){
            for (var index = 0; index < vm.pollOptions.length; index++){
                if (!vm.pollOptions[index].optionText) {
                    return false;
                }
            }
            return true;
        }

        function pollObject(pollId, pollName, pollDescription, pollOptions) {
            PollModel.call(this, pollName, pollDescription, "", "", pollOptions)
            this.pollId = pollId;
        }

        function scopeApply() {
            $timeout(function() { $scope.$apply(); });
        }

    }
}());
