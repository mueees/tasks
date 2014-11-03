angular.module('app.directives.calendar', [
    'angular-gestures'
])
    .directive('calendar', function(){
        return {
            restrict: "E",
            scope: {
                date: "=date"
            },
            templateUrl: "directives/calendar/calendar.tpl.html",
            link: function(scope, element, attrs){
                scope.prev = function () {
                    scope.date.setMonth(scope.date.getMonth()-1);
                };

                scope.next = function () {
                    scope.date.setMonth(scope.date.getMonth()+1);
                };
            }
        };
    });