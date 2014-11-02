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


    return {
        getToday: getToday,
        getWeek: getWeek,
        getTomorrow: getTomorrow
    };
});