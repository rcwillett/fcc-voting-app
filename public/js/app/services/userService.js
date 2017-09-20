angular.module("userServiceModule", [])
    .service("userService", ["$http", function($http) {
        var self = this;

        self.getUserInfo = getUserInfo;

        function getUserInfo() {
            var url = "/getUserInfo";
            return $http({
                method: "GET",
                url: url
            });
        }

        return self;
    }]);