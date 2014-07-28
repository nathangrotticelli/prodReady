angular.module('sociogram.services', [])
.factory('PetService', function() {
  var events = {};
  var single = {};

  return {
   				getEvents: function () {
                return events;
            },
            getSingle: function () {
                return single;
            },
            setSingle: function(event) {
                single = event;
            },
            setEvents: function(value) {
                events = value;
            }
  }
});

