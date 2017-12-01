(function() {
    angular.module("pollApp", ["ngRoute", "toastr"])
        .run(["$rootScope", "$location", "loginService", "appConstants", function($rootScope, $location, loginService, appConstants) {

            $rootScope.loading = true;
            $rootScope.loggedIn = false;

            loginService.isLoggedIn().then(successResp, notLoggedInResp);

            $rootScope.$on("$routeChangeStart", function(event, next, current) {
                if ($rootScope.loggedIn) {
                    return;
                }
                else if (next.$$route && appConstants.restrictedRoutes.indexOf(next.$$route.originalPath) > -1) {
                    $location.path("/login");
                }
            });

            function successResp(resp) {
                $rootScope.loggedIn = resp.data.status;
                $rootScope.loading = false;
            }

            function notLoggedInResp(resp) {
                $rootScope.loggedIn = false;
                $rootScope.loading = false;
            }
        }])
        .config(["$routeProvider", "appConstants", function($routeProvider, appConstants) {
            $routeProvider
                .when("/viewPoll/:pollId", {
                    templateUrl: "/public/js/app/templates/poll.html",
                    controller: "pollViewController"
                })
                .when("/createPoll", {
                    templateUrl: "/public/js/app/templates/createEditPoll.html",
                    controller: "createEditPollController",
                    createEdit: appConstants.createEditEnum.create
                })
                .when("/editPoll/:pollId", {
                    templateUrl: "/public/js/app/templates/createEditPoll.html",
                    controller: "createEditPollController",
                    createEdit: appConstants.createEditEnum.edit
                })
                .when("/pollStats/:pollId", {
                    templateUrl: "/public/js/app/templates/pollStats.html",
                    controller: "pollStatsController",
                })
                .when("/myPolls", {
                    templateUrl: "/public/js/app/templates/userPolls.html",
                    controller: "userPollController",
                })
                .when("/login", {
                    templateUrl: "/public/js/app/templates/login.html",
                    controller: "loginController"
                })
                .otherwise({
                    templateUrl: "/public/js/app/templates/home.html",
                    controller: "pollController"
                });
        }]);
}());