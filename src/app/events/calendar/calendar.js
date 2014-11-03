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
    .controller('EventsCalendarCtrl', ['$scope', '$location', 'EventModel', function($scope, $location, EventModel){
        $scope.data = {};
        $scope.data.date = new Date();

        $scope.$watch('data.date', function(){
            EventModel.getMonth(date).then(function(){

            });
        }, true);

    }]);