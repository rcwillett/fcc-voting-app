(function() {
    angular.module("pollApp")
        .controller("loginController", ["$scope", "$rootScope", "$route", "$routeParams", "loginService", function($scope, $rootScope, $route, $routeParams, loginService) {
            $scope.vm = {};
            var vm = $scope.vm;
            vm.logInWithGit = logInWithGit;
            vm.showError = Boolean($routeParams.error);
            vm.errorMessage = "Login Failed, Please Try Again";

            function logInWithGit() {
                loginService.login().then(loginSuccess, loginFail);
            }

            function loginSuccess(resp) {
                //This is effectively never hit
            }

            function loginFail(resp) {
                vm.error = true;
            }

        }]);
}());
