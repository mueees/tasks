angular.module('app.services', [

]).factory('dateHelper', function(){

    function getToday(){
        var start = new Date();
        var end = new Date();
        start.setHours(0);
        start.setMinutes(0);
        end.setHours(23);
        end.setMinutes(59);
        return {
            start: start,
            end: end
        };
    }

    function getTomorrow(){
        var start = new Date();
        var end = new Date();

        start.setDate(start.getDate()+1);
        start.setHours(0);
        end.setDate(end.getDate()+1);
        end.setHours(23);
        end.setMinutes(59);
        return {
            start: start,
            end: end
        };
    }

    function getWeek(){
        var start = new Date();
        var curr = new Date();
        var last = curr.getDate() - curr.getDay() + 6;
        var end = new Date(curr.setDate(last));

        start.setHours(0);
        start.setMinutes(0);
        end.setHours(23);
        end.setMinutes(59);

        return {
            start: start,
            end: end
        };
    }

    function getTodayAndTomorrow(){
        var start = new Date();
        var end = new Date();

        start.setHours(0);
        start.setMinutes(0);

        end.setDate(end.getDate()+1);
        end.setHours(23);
        end.setMinutes(59);

        return {
            start: start,
            end: end
        };
    }

    return {
        getToday: getToday,
        getWeek: getWeek,
        getTomorrow: getTomorrow,
        getTodayAndTomorrow: getTodayAndTomorrow
    };

}).factory('SwipeChangeUrl', ['$state', 'SWIPE_STATE', function($state, SWIPE_STATE){
    function swipeLeft(){
        var currentState = $state.current.name;
        if( SWIPE_STATE[currentState] && SWIPE_STATE[currentState].left ){
            $state.go(SWIPE_STATE[currentState].left);
        }
    }
    function swipeRight(){
        var currentState = $state.current.name;
        if( SWIPE_STATE[currentState] && SWIPE_STATE[currentState].right ){
            $state.go(SWIPE_STATE[currentState].right);
        }
    }

    return {
        swipeLeft: swipeLeft,
        swipeRight: swipeRight
    };
}]);