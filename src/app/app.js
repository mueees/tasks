
var app = angular.module( 'app', [
    'ngTouch',
    'angular-gestures',
    'ngStorage',
    'headroom',

    'templates-app',
    'templates-common',

    'app.directives',
    'app.services',
    'resources',
    'ui.router',

    'ngAnimate',

    'app.events'
])

    .run(['websqlUtil', '$localStorage', function($websqlUtil, $localStorage){
        //init database
        if(!$localStorage.isInitDatabase){
            $websqlUtil.initDb().then(function(){
                $localStorage.isInitDatabase = true;
            });
        }
    }])

    .controller( 'AppCtrl', ['$scope', function($scope){

    }]);