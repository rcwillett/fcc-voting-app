angular.module("userPollsControllerModule",["pollsServiceModule"])
.controller("userPollController", ["$scope", "pollService", function($scope, pollsService){
    $scope.vm = {};
    var vm = $scope.vm;
    vm.loading = true;
    vm.error = false;
    vm.pollArray = [];

    vm.generateStatsLink = generateStatsLink;

    vm.generateEditLink = generateEditLink;

    initData();

    function initData() {
        pollsService.getUserPolls().then(successResp, errorResp);
    }

    function successResp(resp) {
        vm.pollArray = resp.data;
        vm.loading = false;
    }

    function errorResp(resp) {
        if (resp.status === 401 || resp.status === 403) {
            window.location.href = "/login";
        }
    }
        
    function generateEditLink(pollId){
        return '#!editPoll/' + pollId;
    }
    
    function generateStatsLink(pollId){
        return '#!pollStats/' + pollId;
    }

}]);