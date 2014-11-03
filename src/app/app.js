
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

    .constant('SWIPE_STATE', {
        events_total: {
            right: 'events_calendar'
        },
        events_calendar: {
            right: 'events_total'
        }
    })
    .controller( 'AppCtrl', ['$scope', 'SwipeChangeUrl', function($scope, SwipeChangeUrl){
        $scope.swipeLeft = SwipeChangeUrl.swipeLeft;
        $scope.swipeRight = SwipeChangeUrl.swipeRight;
    }]);

