angular.module("pollViewControllerModule", ["pollsServiceModule"])
    .controller("pollViewController", ["$routeParams", "$scope", "$timeout", "pollService", function($routeParams, $scope, $timeout, pollService) {
        $scope.vm = {};
        var vm = $scope.vm;

        vm.unexpectedError = false;
        vm.optionAddVisible = false;
        vm.submitSelection = submitSelection;
        vm.submitNewOption = submitNewOption;
        vm.addNewOption = addNewOption;

        if ($routeParams.pollId != null && $routeParams.pollId !== "") {
            pollService.getPoll($routeParams.pollId).then(
                function(serverResp) {
                    vm.poll = serverResp.data.pollInfo;
                    vm.selectedOption = serverResp.data.userSelection ? serverResp.data.userSelection : "";
                    $timeout(function() { $scope.$apply(); });
                },
                function(serverResp) {
                    vm.unexpectedError = true;
                }
            );
        }
        else {
            window.location.href = "/404";
        }

        function submitSelection() {
            pollService.vote($routeParams.pollId, vm.selectedOption)
                .then(function(resp) {
                    console.log(resp);
                });
        }

        function submitNewOption() {
            vm.errorMsg = "";
            if (vm.pollOptions.length === 0 || vm.pollOptions[vm.pollOptions.length - 1].optionText !== "") {
                var pollOptionId = vm.pollOptions.length;
                vm.pollOptions.push({ optionId: pollOptionId, optionText: "" });
            }
            else {
                vm.errorMsg = "The poll option text must not be empty before adding another option"
            }
        }

        function addNewOption() {
            
        }

    }]);
