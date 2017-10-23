(function() {
    angular.module("menuControllerModule", [])
        .controller("menuController", ["$scope", "$rootScope", "loginService", menuController]);

    function menuController($scope, $rootScope) {
        var menuVm = $scope.menuVm;
        
        menuVm.logOut = logOut;
        
        loginService.isLoggedIn(successResp, failResp);

        function successResp(resp) {
            $rootScope.loggedIn = resp.status;
        }

        function failResp(resp) {
            $rootScope.loggedIn = false;
        }
        
        function logOut(){
            loginService.logOut();
        }
    }
})();
