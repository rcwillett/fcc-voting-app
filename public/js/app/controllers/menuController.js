(function() {
    angular.module("pollApp")
        .controller("menuController", ["$scope", "$rootScope", "loginService", function($scope, $rootScope, loginService) {

            var menuVm = $scope.menuVm = {};

            menuVm.logOut = logOut;

            function logOut() {
                loginService.logout().then(logOutSuccess, failResp);
            }

            function logOutSuccess() {
                $rootScope.loggedIn = false;
                window.location.href = "/";
            }

            function failResp() {
                $rootScope.error = true;
            }

        }]);
}());
