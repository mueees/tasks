angular.module('app.directives.preloader', [])
    .directive('preloader', ['$rootScope', function($rootScope){
        return {
            restrict: "E",
            replace: true,
            templateUrl: "directives/preloader/preloader.tpl.html",
            link: function(scope, element, attrs){
                scope.isShow = false;
                $rootScope.$on('querying', function(){
                    scope.isShow = true;
                });
                $rootScope.$on('queried', function(){
                    scope.isShow = false;
                });
            }
        };
    }]);