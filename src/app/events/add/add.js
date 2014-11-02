angular.module('app.events.add', [
    'ui.router'
])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('events_add', {
                url: '/events/add',
                templateUrl: 'events/add/add.tpl.html'
            });
    }])
    .controller('EventsAddCtrl', [
        '$scope',
        '$filter',
        '$location',
        'EventModel', function ($scope, $filter, $location, EventModel) {

            var event = new EventModel({
                title: '',
                description: '',
                date_create: new Date(),
                date_start: new Date(),
                isRepeat: false,
                date_end: null,
                repeats: 'day',
                repeatDays: [
                    {
                        day: 0,
                        selected: false,
                        name: 'Sunday'
                    },
                    {
                        day: 1,
                        selected: false,
                        name: 'Monday'
                    },
                    {
                        day: 2,
                        selected: false,
                        name: 'Tuesday'
                    },
                    {
                        day: 3,
                        selected: false,
                        name: 'Wednesday'
                    },
                    {
                        day: 4,
                        selected: false,
                        name: 'Thursday'
                    },
                    {
                        day: 5,
                        selected: false,
                        name: 'Friday'
                    },
                    {
                        day: 6,
                        selected: false,
                        name: 'Saturday'
                    }
                ]
            });
            event.data.date_start = $filter("date")(Date.now(), 'yyyy-MM-dd');
            $scope.event = event.data;

            $scope.addEvent = function(){
                event.save().then(function(){
                    $location.url('events/total');
                }, function(){

                });
            };
            $scope.cancel = function(){
                $location.url('events/total');
            };

        }]);