angular.module("loginControllerModule",["loginServiceModule"])
.controller("loginController", ["$scope", "$rootScope", "$routeParams", "loginService", function($scope, $rootScope, $routeParams, loginService){
    $scope.vm = {};
    var vm = $scope.vm;
    vm.logInWithGit = logInWithGit;
    vm.showError = Boolean($routeParams.error);
    vm.errorMessage = "Login Failed, Please Try Again";
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