angular.module('app.directives.buttonsGroup', [
    'angular-gestures'
])
    .directive('buttonsGroup', function(){
        return {
            restrict: "E",
            scope: {
                buttonsData: "=buttonsData"
            },
            templateUrl: "directives/buttonsGroup/buttonsGroup.tpl.html",
            link: function(scope, element, attrs){
                scope.buttonClick = function(name){
                    scope.buttonsData.active = name;
                };
                scope.isActive = function(name){
                    if( scope.buttonsData.active == name ){
                        return true;
                    }else{
                        return false;
                    }
                };
            }
        };
    });