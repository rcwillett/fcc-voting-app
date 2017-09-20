angular.module("createPollModule", [])
    .controller("createEditPollController", ["$scope", "$timeout", "pollService", function createEditPollController($scope, $timeout, pollService) {
        $scope.vm = {};
        var vm = $scope.vm;
        vm.pollTitle = "";
        vm.pollDescription = "";
        vm.pollId = null;
        vm.pollOptions = [];
        //vm.newOptionText = "";
        vm.addOption = addOption;
        vm.removeOption = removeOption;
        vm.createPoll = createPoll;

        function addOption() {
           // if (vm.newOptionText) {
                var pollOptionId = vm.pollOptions.length;
                vm.pollOptions.push({ optionId: pollOptionId, optionText: "" });
                //vm.newOptionText = "";
                scopeApply();
           // }
        }
        
        function removeOption(optionId){
            vm.pollOptions.splice(optionId, 1);
            vm.pollOptions.forEach(function(option, index){
               option.id = index; 
            });
            scopeApply();
        }
        function createPoll() {
            pollService.createEditPoll(new pollObject(vm.pollId, vm.pollTitle, vm.pollDescription, vm.pollOptions))
            .then(successfulPollCreation, failedPollCreation);
        }
        
        function successfulPollCreation(res){
            window.location = "/#!/viewPoll/"+res.data.pollId;
        }

        function failedPollCreation(res){
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