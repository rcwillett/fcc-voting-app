angular.module("loginModule",["loginService"])
.controller("loginController", ["$rootScope", "loginService", function($rootScope, pollService){
    var vm = $scope.vm;
    vm.logInWithGit = logInWithGit;
    vm.error = false;
    
    function logInWithGit(){
        loginService.login().then(loginSuccess, loginFail);
    }
    
    function loginSuccess(resp){
        $rootScope.loggedIn = true;
        window.location.href = window.history.length > 0 ? window.history[0] : window.location.origin + "/";
    }
    
    function loginFail(resp){
        vm.error = true;
    }
    
}]);