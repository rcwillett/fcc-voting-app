(function() {
    angular.module("pollApp", ["ngRoute", "toastr"])
        .run(["$rootScope", "$location", "loginService", "notificationService", "appConstants", function($rootScope, $location, loginService, notificationService, appConstants) {

            $rootScope.loading = true;
            $rootScope.loggedIn = false;

            loginService.isLoggedIn().then(successResp, notLoggedInResp);

            $rootScope.$on("$routeChangeStart", function(event, next, current) {
                if ($rootScope.loggedIn) {
                    return;
                }
                else if (next.$$route && appConstants.restrictedRoutes.indexOf(next.$$route.originalPath) > -1) {
                    $location.path("/login");
                    notificationService.warn("You must log in to access this part of the site");
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
(function() {
    angular.module("pollApp")
        .service("loginService", ["$rootScope", "$http", function($rootScope, $http) {
            var self = this;

            self.login = login;

            self.logout = logout;

            self.isLoggedIn = isLoggedIn;

            function login() {
                return $http.get("/auth/github");
            }

            function logout() {
                return $http.get("/logout");
            }

            function isLoggedIn() {
                return $http.get("/isLoggedIn");
            }

            return self;
        }]);
}());
(function(){
    angular.module("pollApp")
    .service("notificationService", ["toastr", function(toastr){
        return {
          success: successFunction,
          error: errorFunction,
          warn: warnFunction
        };
        
        function successFunction(msg){
            toastr.success(msg);
        }
        
        function errorFunction(msg){
            toastr.error(msg);
        }
        
        function warnFunction(msg){
            toastr.warning(msg);
        }
        
    }]);
}());
(function() {
    angular.module("pollApp")
        .service("pollService", ["$http", function($http) {
            var self = this;

            self.getPoll = function(id) {
                var url = "/poll/" + id;
                return $http({
                    method: "GET",
                    url: url
                });
            };

            self.getPolls = function(numItems) {
                var requestObj = { "numItems": numItems };
                return $http({
                    method: "GET",
                    url: "/polls",
                    params: requestObj
                });
            };

            self.getUserPolls = function(userId) {
                return $http({
                    method: "GET",
                    url: "/userPolls"
                });
            };

            self.createPoll = function(pollObj) {
                var requestData = pollObj;
                return $http({
                    method: "POST",
                    url: "/addPoll",
                    data: requestData
                });
            };

            self.editPoll = function(pollObj) {
                var requestData = pollObj;
                return $http({
                    method: "POST",
                    url: "/addPoll",
                    data: requestData
                });
            };

            self.addPollOption = function(pollId, optionText) {
                var requestData = {
                    "pollId": pollId,
                    "optionText": optionText
                };

                return $http({
                    method: "POST",
                    url: "/addPollOption",
                    data: requestData,
                    type: "application/json"
                });
            }

            self.vote = function(pollId, optionId) {
                var requestData = {
                    "pollId": pollId,
                    "optionId": optionId
                };
                return $http({
                    method: "POST",
                    url: "/vote",
                    data: requestData,
                    type: "application/json"
                });
            };

            return self;
        }]);
}());

(function() {
    angular.module("pollApp")
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
}());

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
(function() {
    angular.module("pollApp")
        .controller("createEditPollController", ["$scope", "$timeout", "$route", "$routeParams", "pollService", "appConstants", "notificationService", createEditPollController]);

    function createEditPollController($scope, $timeout, $route, $routeParams, pollService, appConstants, notificationService) {
        $scope.vm = {};
        var vm = $scope.vm;
        vm.addOption = addOption;
        vm.removeOption = removeOption;
        vm.submitPoll = submitPoll;

        initData();

        function initData() {
            if ($route.current.$$route.createEdit === appConstants.createEditEnum.edit) {
                pollService.getPoll($routeParams.pollId).then(
                    function(serverResp) {
                        vm.pollId = serverResp.data.pollInfo.id
                        vm.pollTitle = serverResp.data.pollInfo.name
                        vm.pollDescription = serverResp.data.pollInfo.description;
                        vm.pollOptions = serverResp.data.pollInfo.options;
                        vm.submitText = "Update Poll";
                    },
                    function(serverResp) {
                        vm.unexpectedError = true;
                    }
                );
            }
            else {
                vm.pollTitle = "";
                vm.pollDescription = "";
                vm.pollId = null;
                vm.pollOptions = [{ optionId: 0, optionText: "" }];
                vm.submitText = "Create Poll";
            }
        }

        function addOption() {
            vm.errorMsg = "";
            if (vm.pollOptions.length === 0 || vm.pollOptions[vm.pollOptions.length - 1].optionText !== "") {
                var pollOptionId = vm.pollOptions.length;
                vm.pollOptions.push({ optionId: pollOptionId, optionText: "" });
            }
            else {
                notificationService.error("The poll option text must not be empty before adding another option");
            }
        }

        function removeOption(optionId) {
            vm.pollOptions.splice(optionId, 1);
            vm.pollOptions.forEach(function(option, index) {
                option.optionId = index;
            });
            scopeApply();
        }

        function submitPoll() {
            vm.errorMsg = "";
            if (vm.pollOptions.length > 2 && $route.current.$$route.createEdit === appConstants.createEditEnum.edit) {
                pollService.editPoll(new pollObject(vm.pollId, vm.pollTitle, vm.pollDescription, vm.pollOptions))
                    .then(successfulPollCreation, failedPollCreation);
            }
            else if (vm.pollOptions.length > 2 && vm.pollTitle) {
                pollService.createPoll(new pollObject(vm.pollId, vm.pollTitle, vm.pollDescription, vm.pollOptions))
                    .then(successfulPollCreation, failedPollCreation);
            }
            else {
                notificationService.error("You must have at least two options for your poll and a title");
            }
        }

        function successfulPollCreation(res) {
            window.location = "/#!/viewPoll/" + res.data.pollId;
        }

        function failedPollCreation(res) {
            if (res.status === 401 || res.status === 403) {
                window.location.href = "/#!/login";
            }
            else {
                vm.error = true;
                vm.errorMessage = res.message;
            }
        }

        function pollObject(pollId, pollName, pollDescription, pollOptions) {
            this.pollId = pollId;
            this.name = pollName;
            this.description = pollDescription;
            this.options = pollOptions;
        }

        function scopeApply() {
            $timeout(function() { $scope.$apply(); });
        }

    }
}());

(function() {
    angular.module("pollApp")
        .controller("loginController", ["$scope", "$rootScope", "$routeParams", "loginService", function($scope, $rootScope, $routeParams, loginService) {
            $scope.vm = {};
            var vm = $scope.vm;
            vm.logInWithGit = logInWithGit;
            vm.showError = Boolean($routeParams.error);
            vm.errorMessage = "Login Failed, Please Try Again";

            function logInWithGit() {
                loginService.login().then(loginSuccess, loginFail);
            }

            function loginSuccess(resp) {
                $rootScope.loggedIn = true;
                window.location.href = "/";
            }

            function loginFail(resp) {
                vm.error = true;
            }

        }]);
}());

(function() {
    angular.module("pollApp")
        .controller("menuController", ["$scope", "$rootScope", "loginService", function($scope, $rootScope, loginService) {

            var menuVm = $scope.menuVm = {};

            menuVm.logOut = logOut;

            function logOut() {
                loginService.logout().then(logOutSuccess, failResp);
            }

            function logOutSuccess() {
                $rootScope.loggedIn = false;
                window.location.href = "/";
            }

            function failResp() {
                $rootScope.error = true;
            }

        }]);
}());

(function() {
    angular.module("pollApp")
        .controller("pollStatsController", ["$routeParams", "$scope", "$timeout", "pollService", function($routeParams, $scope, $timeout, pollService) {
            $scope.vm = {};
            var vm = $scope.vm;
            vm.unexpectedError = false;
            vm.optionResults = [];
            if ($routeParams.pollId != null && $routeParams.pollId !== "") {
                pollService.getPoll($routeParams.pollId).then(
                    function(serverResp) {
                        vm.poll = serverResp.data.pollInfo;
                        var optionNames = [];
                        var optionVotes = [];
                        var optionColors = [];
                        vm.poll.options.forEach(function(option, index, optionArray) {
                            optionNames.push(option.optionText);
                            optionVotes.push(option.numTimesSelected);
                            optionColors.push(rainbow(optionArray.length, index));
                        });
                        initBarChart(optionNames, optionVotes, optionColors);
                        initPieChart(optionNames, optionVotes, optionColors);
                        $timeout(function() { $scope.$apply(); });
                    },
                    function(serverResp) {
                        vm.unexpectedError = true;
                    }
                );
            }
            else {
                window.location.href = "/404";
            }

            function initBarChart(labels, votes, colours) {
                var ctx = document.getElementById("bar-chart-results").getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: '# of Votes',
                            data: votes,
                            backgroundColor: colours,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                },
                                label: '# of Votes'
                            }]
                        }
                    },
                    responsive: true
                });
            }

            function initPieChart(labels, votes, colours) {
                var ctx = document.getElementById("pie-chart-results").getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: '# of Votes',
                            data: votes,
                            backgroundColor: colours,
                            borderWidth: 1
                        }]
                    },
                    options: {

                    },
                    responsive: true
                });
            }

            function rainbow(numOfSteps, step) {
                // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
                // Adam Cole, 2011-Sept-14
                // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
                var r, g, b;
                var h = step / numOfSteps;
                var i = ~~(h * 6);
                var f = h * 6 - i;
                var q = 1 - f;
                switch (i % 6) {
                    case 0:
                        r = 1;
                        g = f;
                        b = 0;
                        break;
                    case 1:
                        r = q;
                        g = 1;
                        b = 0;
                        break;
                    case 2:
                        r = 0;
                        g = 1;
                        b = f;
                        break;
                    case 3:
                        r = 0;
                        g = q;
                        b = 1;
                        break;
                    case 4:
                        r = f;
                        g = 0;
                        b = 1;
                        break;
                    case 5:
                        r = 1;
                        g = 0;
                        b = q;
                        break;
                }
                var c = "#" + ("00" + (~~(r * 255)).toString(16)).slice(-2) + ("00" + (~~(g * 255)).toString(16)).slice(-2) + ("00" + (~~(b * 255)).toString(16)).slice(-2);
                return (c);
            }

        }]);
}());

(function() {
    angular.module("pollApp")
        .controller("pollViewController", ["$routeParams", "$scope", "$rootScope", "$timeout", "pollService", "notificationService", function($routeParams, $scope, $rootScope, $timeout, pollService, notificationService) {
            $scope.vm = {};

            var vm = $scope.vm;

            initViewModel();

            function initViewModel() {

                vm.unexpectedError = false;
                vm.newOptionFormVisible = false;
                vm.addNewOptionVisible = true;
                vm.submitSelection = submitSelection;
                vm.submitNewOption = submitNewOption;
                vm.addNewOption = addNewOption;
                vm.inputValidationPattern = /[a-zA-Z0-9]/;
                vm.newPollOption = "";

                if ($routeParams.pollId != null && $routeParams.pollId !== "") {
                    pollService.getPoll($routeParams.pollId).then(getPollSuccess, requestFailure);
                }
                else {
                    window.location.href = "/404";
                }
            }

            function getPollSuccess(serverResp) {
                vm.poll = serverResp.data.pollInfo;
                vm.selectedOption = serverResp.data.userSelection ? vm.poll.options[serverResp.data.userSelection] : vm.poll.options[0];
                vm.facebookShareLink = 'https://www.facebook.com/sharer/sharer.php?u=' + window.encodeURI(window.location.href);
                vm.twitterShareLink = 'https://twitter.com/home?status=' + window.encodeURI(window.location.href);
            }

            function submitSelection() {
                pollService.vote($routeParams.pollId, vm.selectedOption.optionId)
                    .then(function(resp) {
                        notificationService.success("Option Selection Successful");
                    });
            }

            function submitNewOption() {
                if (!$scope.newOptionForm.newPollOption.$error.required && !$scope.newOptionForm.newPollOption.$error.pattern) {
                    pollService.addPollOption($routeParams.pollId, vm.newPollOption).then(newOptionSuccess, requestFailure);
                }
            }

            function newOptionSuccess(resp) {
                vm.newOptionFormVisible = false;
                vm.addNewOptionVisible = false;
                vm.poll = resp.data.data;
                notificationService.success("New Option Added");
            }

            function addNewOption() {
                if ($rootScope.loggedIn) {
                    showNewOptionForm();
                }
            }

            function showNewOptionForm() {
                vm.newOptionFormVisible = true;
                vm.addNewOptionVisible = false;
            }

            function requestFailure(resp) {
                notificationService.error(resp.message);
            }

        }]);
}());
(function() {
    angular.module("pollApp")
        .controller("pollController", ["$scope", "pollService", function($scope, pollService) {
            $scope.pollArray = [];
            pollService.getPolls(10).then(function(pollResult) {
                $scope.pollArray = pollResult.data;
            });
        }]);
}());

(function() {
    angular.module("pollApp")
        .controller("userPollController", ["$scope", "pollService", function($scope, pollsService) {
            $scope.vm = {};
            var vm = $scope.vm;
            vm.loading = true;
            vm.error = false;
            vm.pollArray = [];

            vm.generateStatsLink = generateStatsLink;

            vm.generateEditLink = generateEditLink;

            initData();

            function initData() {
                pollsService.getUserPolls().then(successResp, errorResp);
            }

            function successResp(resp) {
                vm.pollArray = resp.data;
                vm.loading = false;
            }

            function errorResp(resp) {
                if (resp.status === 401 || resp.status === 403) {
                    window.location.href = "/#!/login";
                }
            }

            function generateEditLink(pollId) {
                return '#!editPoll/' + pollId;
            }

            function generateStatsLink(pollId) {
                return '#!pollStats/' + pollId;
            }

        }]);
}());
