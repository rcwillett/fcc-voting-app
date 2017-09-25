var pollApp = angular.module("pollApp", ["ngRoute", "pollControllerModule", "pollsServiceModule", "pollViewControllerModule", "createPollModule", "userPollsControllerModule", "pollStatsControllerModule", "applicationConstants"])
.config(["$routeProvider", "appConstants", function($routeProvider, appConstants){
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
    .otherwise({
        templateUrl: "/public/js/app/templates/home.html",
        controller: "pollController"
    });
    
}]);