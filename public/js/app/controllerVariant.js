var pollApp = angular.module("pollApp", ["ngRoute", "pollControllerModule", "pollsServiceModule", "pollViewControllerModule", "createPollModule", "userPollsControllerModule", "applicationConstants"])
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
    .when("/myPolls", {
        templateUrl: "/public/js/app/templates/userPolls.html",
        controller: "userPollController"
    })
    .otherwise({
        templateUrl: "/public/js/app/templates/home.html",
        controller: "pollController"
    });
    
}]);