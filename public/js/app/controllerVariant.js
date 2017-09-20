var pollApp = angular.module("pollApp", ["ngRoute", "pollControllerModule", "pollsServiceModule", "pollViewControllerModule", "createPollModule", "userPollsControllerModule"])
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
    .when("/myPolls", {
        templateUrl: "/public/js/app/templates/userPolls.html",
        controller: "userPollController"
    })
    .otherwise({
        templateUrl: "/public/js/app/templates/home.html",
        controller: "pollController"
    });
    
}]);