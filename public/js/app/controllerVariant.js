var pollApp = angular.module("pollApp", ["ngRoute", "pollControllerModule", "pollsServiceModule", "pollViewControllerModule", "createPollModule"])
.config(["$routeProvider", function($routeProvider){
    $routeProvider
    .when("/viewPoll/:pollId", {
        templateUrl: "/public/js/app/templates/poll.html",
        controller: "pollViewController"
    })
    .when("/createPoll", {
        templateUrl: "/public/js/app/templates/createEditPoll.html",
        controller: "createEditPollController"
    })
    .otherwise({
        templateUrl: "/public/js/app/templates/home.html",
        controller: "pollController"
    });
    
}]);