angular.module('sociogram.services', [])
.factory('PetService', function() {
  var events = {};
  var single = {};
  var school = "";
  var unFriends = [];
  var userProfId = "";
  // var unFriends = [];
  // var notifications = {};

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
            },
            setSchool: function(schoolName) {
                school = schoolName;
            },
            getSchool: function () {
                return school;
            },
              setUserId: function(userId) {
                // alert('setting id');
                // alert(userProfId);
                userProfId = userId;
            },
            getUserId: function () {
                return userProfId;
            },
             setUNFriends: function(friends) {
                // alert('setting id');
                // alert(userProfId);
                unFriends = friends;

            },
            getUNFriends: function () {
                return unFriends;
            },
             refreshEvents: function(value) {

               for(var key in value){
                    // alert('hi');
                    if(value[key].banned=="banned"){
                      // alert('hi');
                      delete events[key];
                    }
                    else{
                       events[key] = value[key];
                    }

                        // alert('hi');
                  }

          }
        }
});

