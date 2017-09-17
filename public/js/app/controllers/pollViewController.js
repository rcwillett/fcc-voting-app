angular.module("pollViewControllerModule", ["pollsServiceModule"])
    .controller("pollViewController", ["$routeParams", "$scope", "$timeout", "pollService", function($routeParams, $scope, $timeout, pollService) {
        $scope.vm = {};
        var vm = $scope.vm;
        vm.unexpectedError = false;
        if ($routeParams.pollId != null && $routeParams.pollId !== "") {
            pollService.getPoll($routeParams.pollId).then(
                function(serverResp) {
                    vm.poll = serverResp.data.pollInfo;
                    vm.selectedOption = serverResp.data.userSelection ? serverResp.data.userSelection : "";
                    $timeout(function(){$scope.$apply();});
                },
                function(serverResp) {
                    vm.unexpectedError = true;
                }
            );
        }
        else {
            window.location.href = "/404";
        }

        vm.submitSelection = function() {
                pollService.vote($routeParams.pollId, vm.selectedOption)
            .then(function(resp){
                console.log(resp);
            });
        };
    }]);
