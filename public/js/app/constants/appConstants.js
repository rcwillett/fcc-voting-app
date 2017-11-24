(function() {
    angular.module("pollApp")
        .constant("appConstants", {
            createEditEnum: {
                create: 0,
                edit: 1
            },
            restrictedRoutes: ["/myPolls", "/createPoll", "/pollStats", "/editPoll"]
        });
}());