angular.module("menuControllerModule", ["loginServiceModule"])
    .controller("menuController", ["$scope", "$rootScope", "loginService", function($scope, $rootScope, loginService) {

        var menuVm = $scope.menuVm = {};

        menuVm.logOut = logOut;

        function logOut() {
            loginService.logout().then(notLoggedInResp, failResp);
        }

        function logOutSuccess() {
            $rootScope.loggedIn = false;
        }

        function failResp() {
            $rootScope.error = true;
        }

    }]);
