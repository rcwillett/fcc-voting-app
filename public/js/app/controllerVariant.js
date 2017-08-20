var pollApp = angular.module("pollApp", ["ngRoute", "pollControllerModule", "pollsServiceModule", "pollViewControllerModule"])
.config(["$routeProvider", function($routeProvider){
    $routeProvider
    .when("/viewPoll/:pollId", {
        templateUrl: "/public/js/app/templates/poll.html",
        controller: "pollViewController"
    })
    .otherwise({
        templateUrl: "/public/js/app/templates/home.html",
        controller: "pollController"
    });
    
}]);