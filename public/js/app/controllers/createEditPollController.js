angular.module("createPollModule", [])
    .controller("createEditPollController", ["$scope", "$timeout", "pollService", function createEditPollController($scope, $timeout, pollService) {
        $scope.vm = {};
        var vm = $scope.vm;
        vm.pollTitle = "";
        vm.pollDescription = "";
        vm.pollId = null;
        vm.pollOptions = [];
        vm.newOptionText = "";
        vm.addOption = addOption;
        vm.createPoll = createPoll;

        function addOption() {
            if (vm.newOptionText) {
                var pollOptionId = vm.pollOptions.length;
                vm.pollOptions.push({ id: pollOptionId, optionText: vm.newOptionText });
                vm.newOptionText = "";
                scopeApply();
            }
        }

        function createPoll() {
            pollService.createEditPoll(new pollObject(vm.pollId, vm.pollTitle, vm.pollDescription, vm.pollOptions));
        }

        function pollObject(pollId, pollName, pollDescription, pollOptions) {
            this.pollId = pollId;
            this.pollName = pollName;
            this.pollDescription = pollDescription;
            this.pollOptions = pollOptions;
        }

        function scopeApply() {
            $timeout(function() { $scope.$apply(); });
        }

    }]);