angular.module('resources.event', ['websql']);
angular.module('resources.event').factory('EventModel', [
    'websqlResource',
    'websqlUtil',
    'dateHelper',
    '$q',
    '$filter',
    function($websqlResource, websqlUtil, dateHelper, $q, $filter){

        var tableName = 'event';

        var Event = $websqlResource(tableName);

        Event.getByPeriod = function(period, successcb, errorcb){
            var deferred = $q.defer();
            var sql1 = "SELECT * FROM " + tableName + " WHERE datetime(date_start) >= datetime('" + period.start + "') AND datetime(date_start) <= datetime('"+period.end+"') AND isRepeat=''";
            var promise1 = Event.query(sql1, [], successcb, errorcb);

            var sql2 = "SELECT * FROM " + tableName + " WHERE datetime(date_start) <= datetime('"+period.end+"') AND isRepeat='true'";
            var promise2 = Event.query(sql2, [], successcb, errorcb);

            $q.all([promise1, promise2]).then(function(values){
                var singleEvents = values[0],
                    zipEvents = values[1];
                var result = [];
                zipEvents = Event.filterDateEnd(zipEvents, period.start);
                zipEvents = Event.unzipEvents(zipEvents, period);


                result = result.concat(singleEvents);
                result = result.concat(zipEvents);
                var events = Event.sortByDay(result, period);

                deferred.resolve(events);
            }, function(){});


            return deferred.promise;

        };

        Event.filterDateEnd = function(events, dateStart){
            if(angular.isString(dateStart)){
                dateStart = new Date(dateStart);
            }
            var result = [];
            angular.forEach(events, function(event){
                if(!event.data.date_end || event.data.date_end > dateStart ){
                    result.push(event);
                }
            });
            return result;
        };

        Event.unzipEvents = function(events, period){
            var result =[];
            var p = angular.copy(period);
            if(angular.isString(p.start)){
                p.start = new Date(p.start);
            }
            if(angular.isString(p.end)){
                p.end = new Date(p.end);
            }

            angular.forEach(events, function(event){
                var events = [];
                switch (event.data.repeats){
                    case 'day':
                        events = Event.unzipEveryDay(event, p);
                        result = result.concat(events);
                        break;
                    case 'week':
                        events = Event.unzipWeekly(event, p);
                        result = result.concat(events);
                        break;
                    case 'month':
                        events = Event.unzipMonthly(event, p);
                        result = result.concat(events);
                        break;
                    case 'year':
                        events = Event.unzipYearly(event, p);
                        result = result.concat(events);
                        break;

                }
            });

            return result;
        };

        Event.unzipEveryDay = function(event, period){
            var result = [];
            var startDay = (event.data.date_start > period.start) ? event.data.date_start : period.start;
            var d = new Date(startDay);

            for(d; d <= period.end; d.setDate(d.getDate() + 1)){
                var currentDate = new Date(d);
                if( event.data.date_end && currentDate > event.data.date_end ){
                    break;
                }
                var cloneEvent = angular.copy(event);
                cloneEvent.data.date_start = new Date(currentDate);
                result.push(cloneEvent);
            }

            return result;
        };

        Event.unzipWeekly = function(event, period){
            var result = [];
            var startDay = (event.data.date_start > period.start) ? event.data.date_start : period.start;
            var d = new Date(startDay);

            for(d; d <= period.end; d.setDate(d.getDate() + 1)){
                var currentDate = new Date(d);
                var currentDay = d.getDay();
                if( event.data.date_end && currentDate > event.data.date_end ){
                    break;
                }

                var res = _.findWhere(event.data.repeatDays, {
                    day: currentDay,
                    selected: true
                });

                if(res){
                    var cloneEvent = angular.copy(event);
                    cloneEvent.data.date_start = new Date(currentDate);
                    result.push(cloneEvent);
                }
            }

            return result;
        };

        Event.unzipMonthly = function(event, period){
            var result = [];
            var startDay = (event.data.date_start > period.start) ? event.data.date_start : period.start;
            var d = new Date(startDay);

            for(d; d <= period.end; d.setDate(d.getDate() + 1)){
                var currentDate = new Date(d);
                if( event.data.date_end && currentDate > event.data.date_end ){
                    break;
                }

                if( $filter('date')(event.data.date_start, 'dd') == $filter('date')(currentDate, 'dd') ){
                    var cloneEvent = angular.copy(event);
                    cloneEvent.data.date_start = new Date(currentDate);
                    result.push(cloneEvent);
                }
            }

            return result;
        };

        Event.unzipYearly = function(event, period){
            var result = [];
            var startDay = (event.data.date_start > period.start) ? event.data.date_start : period.start;
            var d = new Date(startDay);

            for(d; d <= period.end; d.setDate(d.getDate() + 1)){
                var currentDate = new Date(d);
                if( event.data.date_end && currentDate > event.data.date_end ){
                    break;
                }

                if( $filter('date')(event.data.date_start, 'MM-dd') == $filter('date')(currentDate, 'MM-dd') ){
                    var cloneEvent = angular.copy(event);
                    cloneEvent.data.date_start = new Date(currentDate);
                    result.push(cloneEvent);
                }
            }

            return result;
        };

        Event.sortByDay = function(events, period){
            var result =[];
            var p = angular.copy(period);
            if(angular.isString(p.start)){
                p.start = new Date(p.start);
            }
            if(angular.isString(p.end)){
                p.end = new Date(p.end);
            }

            var startDay = p.start;
            var d = new Date(startDay);


            for(d; d <= p.end; d.setDate(d.getDate() + 1)){
                result.push({
                    date: new Date(d),
                    events: []
                });
            }

            angular.forEach(events, function(event){
                var idx;
                if(result.length){
                    _.find(result, function(item, itemIdx){
                        if( $filter('date')(event.data.date_start, 'yyyy-MM-dd') == $filter('date')(item.date, 'yyyy-MM-dd') ){
                            idx = itemIdx;
                        }
                    });

                    if( idx === 0 || idx ){
                        var day = result[idx];
                        day.events.push(event);
                        result.splice(idx, 1, day);
                    }else{
                        result.push({
                            date: event.data.date_start,
                            events: [event]
                        });
                    }
                }else{
                    result.push({
                        date: event.data.date_start,
                        events: [event]
                    });
                }
            });
            return result;
        };

        Event.getToday = function(successcb, errorcb){
            var date = dateHelper.getToday();

            return Event.getByPeriod({
                start: websqlUtil.convertDateToDatetime(date.start, 'yyyy-MM-dd HH:mm:ss'),
                end: websqlUtil.convertDateToDatetime(date.end, 'yyyy-MM-dd HH:mm:ss')
            });
        };

        Event.getTomorrow = function(successcb, errorcb){

            var date = dateHelper.getTomorrow();

            return Event.getByPeriod({
                start: websqlUtil.convertDateToDatetime(date.start, 'yyyy-MM-dd HH:mm:ss'),
                end: websqlUtil.convertDateToDatetime(date.end, 'yyyy-MM-dd HH:mm:ss')
            });
        };

        Event.getWeek = function(successcb, errorcb){

            var date = dateHelper.getWeek();

            return Event.getByPeriod({
                start: websqlUtil.convertDateToDatetime(date.start, 'yyyy-MM-dd HH:mm:ss'),
                end: websqlUtil.convertDateToDatetime(date.end, 'yyyy-MM-dd HH:mm:ss')
            });
        };

        Event.getMonth = function(d, successcb, errorcb){

            var start = new Date(d);
            var date = {
                start: start.setDay()
            };

            return Event.getByPeriod({
                start: websqlUtil.convertDateToDatetime(date.start, 'yyyy-MM-dd HH:mm:ss'),
                end: websqlUtil.convertDateToDatetime(date.end, 'yyyy-MM-dd HH:mm:ss')
            });
        };

        Event.remove = function(id, successcb, errorcb){
            var deferred = $q.defer();
            var _this = this;
            var sql = "DELETE FROM " + tableName + " WHERE id='" + id + "'";
            return Event.query(sql, [], successcb, errorcb);
        };

        Event.prototype.parse = function(data){
            if(data.date_create && angular.isString(data.date_create)){
                data.date_create = new Date(data.date_create);
            }

            if(data.date_start && angular.isString(data.date_start)){
                data.date_start = new Date(data.date_start);
            }

            if(data.date_end && angular.isString(data.date_end)){
                data.date_end = new Date(data.date_end);
            }

            if(data.repeatDays && angular.isString(data.repeatDays)){
                data.repeatDays = JSON.parse(data.repeatDays);
            }

            return data;
        };


        return Event;

    }]);