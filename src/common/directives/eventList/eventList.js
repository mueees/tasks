angular.module('app.directives.eventList', [
    'angular-gestures'
])
    .directive('eventList', function(){
        return {
            restrict: "E",
            scope: {
                events: "=events"
            },
            templateUrl: "directives/eventList/eventList.tpl.html",
            link: function(){
            }
        };
    })
    .directive('taskClick', ['$location', function($location){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                scope.isHidden = true;
                scope.hold = function(event, id){
                    if(!id) {
                        return;
                    }
                    $location.url('/events/edit/' + id);
                };
                element.on('tap', function(event){
                    scope.isHidden = !scope.isHidden;
                    scope.$digest();
                });
            }
        };
    }]);