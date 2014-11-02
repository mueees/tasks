angular.module('app.events.edit', [
    'ui.router'
])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('events_edit', {
                url: '/events/edit/:id',
                templateUrl: 'events/edit/edit.tpl.html',
                resolve: {
                    event: function (EventModel, $stateParams) {
                        return EventModel.getById($stateParams.id);
                    }
                },
                controller: function ($scope, event) {
                    var result = null;
                    if(event.length){
                        result = event[0];
                    }
                    $scope.eventResource = result;
                }
            });
    }])
    .controller('EventsEditCtrl', [
        '$scope',
        '$filter',
        '$location', function ($scope, $filter, $location) {
            $scope.event = $scope.eventResource.data;
            $scope.event.date_start = $filter("date")($scope.event.date_start, 'yyyy-MM-dd');
            if($scope.event.date_end){
                $scope.event.date_end = $filter("date")($scope.event.date_end, 'yyyy-MM-dd');
            }
            $scope.editEvent = function(){
                $scope.eventResource.save().then(function(){
                    $location.url('events/total');
                }, function(){
                });
            };
            $scope.deleteEvent = function(){
                $scope.eventResource.remove().then(function(){
                    $location.url('/events/total');
                });
            };
            $scope.cancel = function(){
                $location.url('/events/total');
            };

        }]);