angular.module("applicationConstants", [])
.constant("appConstants", {
    createEditEnum:{
        create: 0,
        edit: 1
    },
    restrictedRoutes:["/myPolls", "/createPoll"]
});