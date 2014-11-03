angular.module('app.directives.eventList', [
    'angular-gestures'
])
    .directive('eventList', function(){
        return {
            restrict: "E",
            scope: {
                events: "=events"
            },
            templateUrl: "directives/eventList/eventList.tpl.html",
            link: function(){
            }
        };
    })
    .directive('taskClick', ['$location', 'EventModel', function($location, EventModel){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                scope.isHidden = true;
                scope.isDeleteHidden = true;

                scope.hold = function(event, id){
                    if(!id) {
                        return;
                    }
                    $location.url('/events/edit/' + id);
                };

                scope.leftSwipe = function(event){
                    event.stopPropagation();
                    scope.isDeleteHidden = false;
                };

                scope.deleteHandler = function(event, eventId){
                    EventModel.remove(eventId).then(function(){
                        //$location.url('/events/total');
                        var idx;
                        _.find(scope.events, function(event, index){
                            if(event.id == eventId){
                                idx = index;
                            }
                        });
                        if(idx === 0 || idx){
                            scope.events.splice(idx, 1);
                        }
                    });
                };

                element.on('tap', function(event){
                    scope.isHidden = !scope.isHidden;
                    scope.$digest();
                });
            }
        };
    }]);