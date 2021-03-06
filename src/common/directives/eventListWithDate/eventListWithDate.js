angular.module('app.directives.eventListWithDate', [
    'angular-gestures'
])
    .directive('eventListWithDate', ['$filter', function($filter){
        return {
            restrict: "E",
            scope: {
                day: "=day",
                noEventsHide: "=noEventsHide"
            },
            templateUrl: "directives/eventListWithDate/eventListWithDate.tpl.html",
            link: function(scope){
                var date = new Date();
                if( $filter('date')(date, 'yyyy-MM-dd') == $filter('date')(scope.day.date, 'yyyy-MM-dd') ){
                    scope.description = 'Today';
                }

                if( $filter('date')(date.setDate(date.getDate()+1), 'yyyy-MM-dd') == $filter('date')(scope.day.date, 'yyyy-MM-dd') ){
                    scope.description = 'Tomorrow';
                }

                scope.isShow = function(){
                    var result = true;
                    if(scope.noEventsHide){
                        if( !scope.day.events.length ){
                            result = false;
                        }
                    }
                    return result;
                };
            }
        };
    }]);