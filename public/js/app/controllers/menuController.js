angular.module("menuControllerModule", ["loginServiceModule"])
    .controller("menuController", ["$scope", "$rootScope", "loginService", function($scope, $rootScope, loginService) {
        
        var menuVm = $scope.menuVm = {};

        menuVm.logOut = logOut;

        loginService.isLoggedIn().then(successResp, notLoggedInResp);

        function successResp(resp) {
            $rootScope.loggedIn = resp.status;
        }

        function notLoggedInResp(resp) {
            $rootScope.loggedIn = false;
        }

        function logOut() {
            loginService.logout().then(notLoggedInResp, failResp);
        }
        
        function failResp(){
            $rootScope.error = true;
        }
        
    }]);
