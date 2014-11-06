angular.module('app.directives.dateChoose', [
    'angular-gestures'
])
    .directive('dateChoose', ['$filter', function($filter){
        return {
            restrict: "E",
            scope: {
                dateStart: "=ngModel"
            },
            templateUrl: "directives/dateChoose/dateChoose.tpl.html",
            link: function(scope, element, attrs){
                scope.prev = function(){
                    var d = new Date(scope.dateStart);
                    d.setDate(d.getDate()-1);
                    scope.dateStart = $filter('date')(d, 'yyyy-MM-dd');
                };
                scope.next = function(){
                    var d = new Date(scope.dateStart);
                    d.setDate(d.getDate()+1);
                    scope.dateStart = $filter('date')(d, 'yyyy-MM-dd');
                };
                scope.today = function(){
                    var d = new Date();
                    scope.dateStart = $filter('date')(d, 'yyyy-MM-dd');
                };
            }
        };
    }]);