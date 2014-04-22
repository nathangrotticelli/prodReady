angular.module('sociogram.services', [])

/**
 * A simple example service that returns some data.
 */

.factory('PetService', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  //changing format for test data (removed object key that was event name)
  var events = {};
  var single = {};

  return {
   				getEvents: function () {
                return events;
            },
            getSingle: function () {
                return single;
            },
            setSingle: function(eventName) {
                single = events[eventName];
            },
            setEvents: function(value) {
                events = value;
            }
  }
});

