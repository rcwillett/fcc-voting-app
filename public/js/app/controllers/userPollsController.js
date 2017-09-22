angular.module("userPollsControllerModule",["userServiceModule"])
.controller("userPollController", ["$scope", "userService", function($scope, userService){
    $scope.vm = {};
    var vm = $scope.vm;
    vm.loading = true;
    vm.error = false;
    vm.pollArray = [];
    
    vm.generateStatsLink = generateStatsLink;
    
    vm.generateEditLink = generateEditLink;
    
    initData();
    
    function initData(){
        userService.getUserInfo().then(successResp, errorResp);
    }
    
    function successResp(resp) {
        vm.pollArray = resp.data.createdPolls;
        vm.loading = false;
    }

    function errorResp(resp){
        
    }
    
        
    function generateEditLink(pollId){
        return '#!editPoll/' + pollId;
    }
    
    function generateStatsLink(pollId){
        return '#!pollStats/' + pollId;
    }

}]);