angular.module('app.events.total', [
    'ui.router'
])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/events/total");

        $stateProvider
            .state('events_total', {
                url: '/events/total',
                templateUrl: 'events/total/total.tpl.html',
                resolve: {
                    today: function (EventModel) {
                        return EventModel.getToday();
                    },
                    tomorrow: function(EventModel){
                        return EventModel.getTomorrow();
                    },
                    week: function(EventModel){
                        return EventModel.getWeek();
                    }
                },
                controller: function ($scope, today, tomorrow, week, websqlUtil) {
                    $scope.todayRow = today[0];
                    $scope.today = websqlUtil.eventsByPeriodToObjects(today)[0];

                    $scope.tomorrowRow = tomorrow[0];
                    $scope.tomorrow = websqlUtil.eventsByPeriodToObjects(tomorrow)[0];

                    $scope.weekRow = week;
                    $scope.week = websqlUtil.eventsByPeriodToObjects(week);
                }
            });
    }])
    .controller('EventsTotalCtrl', ['$scope', '$location', function($scope, $location){

        $scope.swipeLeft = function(){
            $location.url('/events/add');
        };

    }]);