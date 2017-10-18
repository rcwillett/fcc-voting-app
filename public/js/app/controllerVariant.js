var pollApp = angular.module("pollApp", ["ngRoute", "pollControllerModule", "pollsServiceModule", "pollViewControllerModule", "createPollModule", "userPollsControllerModule", "pollStatsControllerModule", "applicationConstants"])
    .config(["$routeProvider", function($routeProvider, appConstants) {
        var onlyLoggedIn = function($location, $q, Auth) {
            var deferred = $q.defer();
            if (Auth.isLogin()) {
                deferred.resolve();
            }
            else {
                deferred.reject();
                $location.url('/login');
            }
            return deferred.promise;
        };
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
                controller: "userPollController"
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