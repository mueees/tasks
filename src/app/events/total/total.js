angular.module('app.events.total', [
    'ui.router'
])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/events/total");

        $stateProvider
            .state('events_total', {
                url: '/events/total',
                templateUrl: 'events/total/total.tpl.html'
            });
    }])
    .controller('EventsTotalCtrl', ['$scope', '$location', 'EventModel', '$q', 'websqlUtil', '$timeout', function($scope, $location, EventModel, $q, websqlUtil, $timeout){
        $scope.data = {};
        $scope.data.date = new Date();

        $scope.buttonsData = {
            active: 'Week',
            buttons: [
                {
                    name: "Week"
                },
                {
                    name: "Month"
                }
            ]
        };

        $scope.$watch('buttonsData.active', function(){
            switch ($scope.buttonsData.active){
                case "Week":
                    $scope.events = [];
                    EventModel.getWeek()
                        .then(function(events){
                            $scope.events = websqlUtil.eventsByPeriodToObjects(events);
                        });
                    break;
            }
        });

        $scope.$watch('data.date', function(){
            if( $scope.buttonsData.active != "Month" ) {
                return;
            }
            EventModel.getMonth($scope.data.date).then(function(events){
                $scope.events = websqlUtil.eventsByPeriodToObjects(events);
            });
        }, true);

        $scope.isShowCalendar = function(){
            if( $scope.buttonsData.active == 'Month' ){
                return true;
            }else{
                return false;
            }
        };
    }]);