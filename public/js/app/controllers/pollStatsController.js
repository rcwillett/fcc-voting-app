angular.module("pollStatsControllerModule", ["pollsServiceModule"])
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
                        optionColors.push(rainbow(index, optionArray.length));
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
                            }
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
