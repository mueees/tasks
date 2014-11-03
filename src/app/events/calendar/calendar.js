angular.module('app.events.calendar', [
    'ui.router'
])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/events/calendar");

        $stateProvider
            .state('events_calendar', {
                url: '/events/calendar',
                templateUrl: 'events/calendar/calendar.tpl.html'
            });
    }])
    .controller('EventsCalendarCtrl', ['$scope', '$location', 'EventModel', 'websqlUtil', function($scope, $location, EventModel, websqlUtil){
        $scope.data = {};
        $scope.data.date = new Date();

        $scope.$watch('data.date', function(){
            EventModel.getMonth($scope.data.date).then(function(events){
                $scope.data.eventsCollections = websqlUtil.eventsByPeriodToObjects(events);
            });
        }, true);


        $scope.isNoEvents = function(){
            var result = true;
            _.find($scope.data.eventsCollections, function(day){
                if( result && day.events.length ){
                    result = false;
                }
            });

            return result;
        };

    }]);