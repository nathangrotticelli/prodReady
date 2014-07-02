angular.module('sociogram.controllers', ['ionic'])

    .controller('AppCtrl', function ($scope, $state, OpenFB) {

        $scope.logout = function () {
            OpenFB.logout();
            $state.go('app.login');
        };

        // $scope.revokePermissions = function () {
        //     OpenFB.revokePermissions().then(
        //         function () {
        //             $state.go('app.login');
        //         },
        //         function () {
        //             alert('Revoke permissions failed');
        //         });
        // };

    })

    .controller('LoginCtrl', function ($scope, $ionicPopup, $http, $location, OpenFB, $state, $stateParams, PetService) {
  // analytics.trackView('Login Screen');

      // window.plugins.flurry.logEvent('Login');

//      var introPopup = function(){
//  $ionicPopup.alert({
//              // alert('Hi '+userName);
//           title: 'Hey '+userName,
//           content: 'Welcome to the U Nightlife app. We use your social graph to make sure your a student, customize your event display to include your private events, and share all the public events you know about with the rest of your school. This process may take a few seconds (15+ possibly) but it\'s worth it. You should know all the options for your nightlife.'
//         }).then(function(res) {
//           console.log('Thank you for not eating my delicious ice cream cone');
//         });
// }
  $scope.showAlert = function(message) {
        $ionicPopup.alert({
          title: 'Hey '+userName.split(' ')[0]+',',
          content: message
        }).then(function(res) {
          console.log('Alert Shown.');
        });
  };

$scope.submitForm = function(emailEntry) {
        // console.log("posting data....");
                // alert('hi');

        // alert(emailEntry);
        loginTryEmail = emailEntry.toLowerCase();
   if (schoolItem.schoolName=='Central Florida'||schoolItem.schoolName=='George Washington University'||schoolItem.schoolName=='Oneonta'||schoolItem.schoolName=='Michigan State'||schoolItem.schoolName=='University of Michigan'||schoolItem.schoolName=='University of Hawaii'||schoolItem.schoolName=='Central Michigan'){
        if((loginTryEmail==='ngrotti1@binghamton.edu'||loginTryEmail.indexOf(schoolItem.emailEnding)>-1&&loginTryEmail.length>schoolItem.emailLength)){
          schoolFriendCount=301;
            $http.post('http://stark-eyrie-6720.herokuapp.com/userPost',
            {firstNameLetter: firstNameLetter,
            schoolFriendCount: schoolFriendCount,
            userProfId: userProfId,
            userAge: userAge,
            userName: userName,
            personalEvents: yourEvents,
            userGender: userGender,
            userEmail: userEmail,
            school: schoolItem.schoolName}
            )
            PetService.setEvents(yourEvents);
            $location.path('/app/person/me/feed');
        }
        else{
          $scope.showAlert("That\'s an invalid email! Make sure you are on the right school portal for your respective university, and that you entered your OWN valid university email. If you are in fact a student at this school, and continue to experience trouble, shoot us an email at UNRepTeam@gmail.com or reach out to us through social media ASAP!");
          // $location.path('/app/login2');
        }
   }

   else {
      if(loginTryEmail==='ngrotti1@binghamton.edu'||loginTryEmail.indexOf(schoolItem.emailEnding)>-1&&loginTryEmail.indexOf(' ')<0&&loginTryEmail[0].indexOf(firstNameLetter)>-1&&loginTryEmail.length>=schoolItem.emailLength&&regExNums.test(loginTryEmail)){
        schoolFriendCount=301;
        $http.post('http://stark-eyrie-6720.herokuapp.com/userPost',
            {firstNameLetter: firstNameLetter,
            schoolFriendCount: schoolFriendCount,
            userProfId: userProfId,
            userAge: userAge,
            userName: userName,
            personalEvents: yourEvents,
            userGender: userGender,
            userEmail: userEmail,
            school: schoolItem.schoolName}
            )
            PetService.setEvents(yourEvents);
            $location.path('/app/person/me/feed');
        }
      else{
        $scope.showAlert("That\'s an invalid email! Make sure you are on the right school portal for your respective university, and that you entered your OWN valid university email. If you are in fact a student at this school, and continue to experience trouble, shoot us an email at UNRepTeam@gmail.com or reach out to us through social media ASAP!");
          // $location.path('/app/login2');
      }
   }
        // formData = $scope.form;
        // console.log(formData);
        //$http.post('form.php', JSON.stringify(data)).success(function(){/*success callback*/});
    };

// $scope.showAlert = function() {
//         $ionicPopup.alert({
//           title: 'Don\'t eat that!',
//           content: 'It might taste good'
//         }).then(function(res) {
//           console.log('Thank you for not eating my delicious ice cream cone');
//         });
//       };

$scope.facebookLogin = function (schoolName) {


          var today = new Date();
          var currentDay = today.getDate();
          var currentMonth = today.getMonth()+1; //January is 0
          var currentYear = today.getFullYear();
          yourEvents = {};
          listOfAllEvents = {};
          schoolFriendCount = 0;
          denied='no';
          currentSchoolCount = 0;


          $http.post('http://stark-eyrie-6720.herokuapp.com/getSchool',{schoolName:schoolName}).success(function(res){

            // alert(res.Item.schoolLongMax);

            schoolItem = res.Item;
            currentSchoolCheck();
            // alert(schoolItem.schoolName);
            // alert(schoolItem.schoolEvents);
            // checkSchoolEvents(schoolItem.schoolEvents);
             // alert(schoolItem.schoolEvents[0]);
      // schoolItem.schoolEvents


        //

        // if(event.d){

        // }

            // checkSchoolEvents();


          });
    var currentUserCheck = function(){

      // alert('ima boss leggo my egoo ass so fat i just wana grab it');
                  for(var key in userItem.privateEvents){

                var startDay = userItem.privateEvents[key].start_time.split('/')[1];
                var startYear = userItem.privateEvents[key].start_time.split('/')[2];
                var startMonth = userItem.privateEvents[key].start_time.split('/')[0];

                if (startMonth>=currentMonth&&startDay>=currentDay&&startYear>=currentYear){
                  // alert('event added to yourevents');
                  // currentSchoolCount++;
                  yourEvents[key] = userItem.privateEvents[key];
                }
              }
              // alert(currentSchoolCount);


     }


    var currentSchoolCheck = function(){
                  for(var key in schoolItem.schoolEvents){

                var startDay = schoolItem.schoolEvents[key].start_time.split('/')[1];
                var startYear = schoolItem.schoolEvents[key].start_time.split('/')[2];
                var startMonth = schoolItem.schoolEvents[key].start_time.split('/')[0];

                if (startMonth>=currentMonth&&startDay>=currentDay&&startYear>=currentYear){
                  // alert('event added to yourevents');
                  currentSchoolCount++;
                  yourEvents[key] = schoolItem.schoolEvents[key];
                }
              }
              // alert(currentSchoolCount);

              return currentSchoolCount;
     }

  //age function
  var getAge = function(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

//friend edu algorithm
var friendChecker = function(result){

      result.friends.data.forEach(function(friend){
        if (friend.education){
          friend.education.forEach(function(schoolObj){
            if(schoolObj.school){
              if (schoolObj.school.name.indexOf(schoolItem.schoolName)>-1){
                schoolFriendCount++;
              }
            }
          });}
      });
  // console.log(schoolFriendCount);
}

var notUserFlow = function(){

          //either register a user here, or deny them and redirect them
    if(schoolFriendCount<schoolItem.schoolFriendMin&&userEmail.indexOf(schoolItem.emailEnding)<0){
      // alert('got to school deny: '+schoolFriendCount);
      denied = 'yes';
      $location.path('/app/login2');
      // $location.path('/app/login2');
    }
    else{
      //make a new user here
    }

}


 var eduSearch = function(){
                       //get education of friends
                    OpenFB.get("/me?fields=friends.fields(education)",{limit:390})
                    //when education of friends is gotten, if succesful
                    .success(function(eduResult){
                      //count the number of friends who go to a school
                      friendChecker(eduResult)
                    }).error(function(){
            //person is not already a user
             $scope.showAlert('Facebook connection could not be acheived, and is required3333.');
          });
  }
//event populator function
//populates yourEvents for successful 1st queries
var eventPopulater = function(listOfAllEvents){
      //start of pull from school events

        if (!schoolItem.schoolEvents){
          schoolItem.schoolEvents = {};
        }
        else{
          var schoolEventsInAnArray = Object.keys(schoolItem.schoolEvents);
          for (i=0;i<schoolEventsInAnArray.length;i++){
            if(schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time){
              //almost never going to happen now
              if(schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.indexOf('-')>-1){

                var startMonth = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[1];;
                var startDay = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[2].split('T')[0];
                var startYear = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[0];

                schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time=startMonth+"/"+startDay+"/"+startYear;
              }


              var startDay = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('/')[1];
                var startYear = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('/')[2];
                var startMonth = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('/')[0];
                // alert(startDay);
                // alert(startMonth);
                // alert(startYear);
                // alert(schoolItem.schoolEvents[schoolEventsInAnArray[i]].name);
                // alert(schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time);
                // alert(currentMonth);
                // alert('start month:'+startMonth+'is bigger then '+currentMonth);
                //  alert('start day:'+startDay+'is bigger then '+currentDay);
                //    alert('start year:'+startYear+'is bigger then '+currentYear);
                if (startMonth>=currentMonth&&startDay>=currentDay&&startYear>=currentYear){
                  // alert('event added to yourevents');
                  yourEvents[schoolEventsInAnArray[i]] = schoolItem.schoolEvents[schoolEventsInAnArray[i]];
                }
             }
          }
        }//end of school event pull
        //start of pull from fb result
        var allEventsInAnArray = Object.keys(listOfAllEvents);

        for (i=0;i<allEventsInAnArray.length;i++){
          if (listOfAllEvents[allEventsInAnArray[i]].attending||listOfAllEvents[allEventsInAnArray[i]].maybe){
            yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
            // alert(yourEvents[allEventsInAnArray[i]]);
          }
          if (listOfAllEvents[allEventsInAnArray[i]].longitude){
            longValue = listOfAllEvents[allEventsInAnArray[i]].longitude.split(' ')[1];
            latValue = listOfAllEvents[allEventsInAnArray[i]].latitude.split(' ')[1];

            //defining long and lat values

            if (longValue<=schoolItem.schoolLongMax&&longValue>=schoolItem.schoolLongMin&&latValue<=schoolItem.schoolLatMax&&latValue>=schoolItem.schoolLatMin){//if close to school

              yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
              if(listOfAllEvents[allEventsInAnArray[i]].privacy!='SECRET'){

                schoolItem.schoolEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
                // timestamp=5;
               $http.post('http://stark-eyrie-6720.herokuapp.com/schoolPost',
                 {
                  schoolName: schoolItem.schoolName,
                  // timestamp:timestamp,
                  schoolEvents: schoolItem.schoolEvents
                }.success(function(){
                  // alert('school event added')
                })
          )
                  // alert(schoolItem.schoolEvents[allEventsInAnArray[i]]);
              }
            }
            if (listOfAllEvents[allEventsInAnArray[i]].location){
              if (listOfAllEvents[allEventsInAnArray[i]].location.indexOf(schoolItem.schoolTown)>-1){//if close to school
                yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
                if(listOfAllEvents[allEventsInAnArray[i]].privacy!='SECRET'){
                  schoolItem.schoolEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
                  // timestamp=5;
                  $http.post('http://stark-eyrie-6720.herokuapp.com/schoolPost',
                 {
                  schoolName: schoolItem.schoolName,
                  // timestamp:timestamp,
                  schoolEvents: schoolItem.schoolEvents
                }
                ).success(function(){
                  // alert('school event added')
                })
                  // alert(schoolItem.schoolEvents[allEventsInAnArray[i]]);
                  // alert(schoolItem.schoolEvents[allEventsInAnArray[i]].name);
                    // alert(schoolItem.schoolEvents[allEventsInAnArray[i]]);
                 }
              }
            }
          }
        }



    }//end of eventpopulator

var fbQuery = function(){

// alert(userProfId);
// $location.path('/app/loading');
              //start of fb query
                  OpenFB.get("/me?fields=friends.fields(events.fields(description,cover,privacy,start_time,location,name,venue,maybe.user("+userProfId+"), attending.user(" +userProfId+")))",{limit: 390})
                    //if fb query is not successful
                 .error(function(data) {
                      $scope.showAlert("Oops! There was an error! Contact us at UNRepTeam@gmail.com if this keeps happening. "+data.error.message);
                  })
                  //if fb query succesful
                  .success(function (result2){

                    //proceed to put all events into an object with event names being the keys
                   var friends = result2.friends.data.filter( function(friend){
                      if (friend.events){
                        return true;
                      }
                   });
                // alert('made it to here 1');
            friends.forEach(function(friend){

              setEventsList = friend.events.data.map(function(singleEvent){

                    startMonth = singleEvent.start_time.split('-')[1];
                    startDay = singleEvent.start_time.split('-')[2].split('T')[0];
                    startYear = singleEvent.start_time.split('-')[0];
                    // alert('startMonth equal to: '+startMonth);
                    //  alert('startDay equal to: '+startDay);
                    //  alert('startyear equal to: '+startYear);

                  if (startMonth>=currentMonth&&startDay>=currentDay&&startYear>=currentYear){
                    //cleans the start times
                    singleEvent.start_time=startMonth+"/"+startDay+"/"+startYear;
                    //cleans the names of events
                      listOfAllEvents[singleEvent.name.replace(/\./g,"")] = singleEvent;

                          if (singleEvent.venue){
                            listOfAllEvents[singleEvent.name.replace(/\./g,"")]['longitude']="Longitude: "+singleEvent.venue.longitude;
                            listOfAllEvents[singleEvent.name.replace(/\./g,"")]['latitude']="Latitude: "+singleEvent.venue.latitude;
                          }
                          if (singleEvent.cover){
                            listOfAllEvents[singleEvent.name.replace(/\./g,"")]['cover'] = singleEvent.cover.source;
                          }

                  }//end of date check
                });//set events list
              });//friends.foreach
        })
            .success(function(){

              alert('made it to ep');
              //make new event lists in the event populater
  eventPopulater(listOfAllEvents);
  PetService.setEvents(yourEvents);
   $location.path('/app/person/me/feed');
// $location.path('/app/loading');

// location.reload();
            });

}


//this is the fb login
            OpenFB.login('user_events, email,user_about_me,friends_events,friends_education_history,friends_actions.news,friends_activities')
            .then(

                  function () {

                 OpenFB.get('/me', {limit: 30}).success(function (result) {
                    // alert(result.name);
                  userProfId = result.id;
                  userName = result.name;
                  userGender = result.gender;
                  userAge = getAge(result.birthday);
                  // school = schoolItem.schoolName;
                  if(result.email){
                    userEmail = result.email.toLowerCase();
                  }
                  else{
                    userEmail = 'none';
                  }
                  firstNameLetter = result.name[0].toLowerCase();
                  $scope.showAlert('Welcome to the U Nightlife app.');
                  $location.path('/app/loading');
                  // analytics.trackView('Loading');

                  // alert('i made it here');
                  //check if user exists hereeeeee
                  //check if person is user, if they are check for amount of school events
                  user='false';
                  // userEmail = "DickButkis@aol.com";


                  $http.post('http://stark-eyrie-6720.herokuapp.com/getUser',{userEmail: userEmail}).success(function(res){

            // alert(res.Item.schoolLongMax);
            //person is already a user

            userItem = res.Item;
            //DE is equal to doesnt exist
            //if user exists
            if(userItem!=="DE"){

              // checkSchoolEvents();
              alert("here");
                    if(currentSchoolCount>=2){
                        alert("here2");
                       //adds existing private events
                       currentUserCheck();
                      PetService.setEvents(yourEvents);

                      $location.path('/app/person/me/feed');
                      //then run the query

                      fbQuery();


                      // $location.path('/app/person/me/feed')
                      //when its done, reload the feed
                     }

                  //   if school amount is less then 3 query then
                  //     let in

                    else{
                        alert("here3");
                      fbQuery();
                  //     run query, create new lists,  when done, let in and display
                    }

            }
            //user does not exist
            //run fb friend/email check
            else{
              eduSearch();
              alert(schoolFriendCount)
              // if(schoolFriendCount)

            }

          }).error(function(){
            //person is not already a user
             $scope.showAlert('Could not connect to server.');
          });

                 }).error(function(){
            //person is not already a user
             $scope.showAlert('Facebook connection could not be acheived, and is required.');
          });
        }

        ).error(function(){
            //person is not already a user
             $scope.showAlert('Facebook connection could not be acheived, and is required2222.');
          });

}; // end of big fb connect function
    }) // end of login controller

    // .controller('ShareCtrl', function ($scope, OpenFB) {

    //     $scope.item = {};

    //     $scope.share = function () {
    //         OpenFB.post('/me/feed', $scope.item)
    //             .success(function () {
    //                 $scope.status = "This item has been shared on OpenFB";
    //             })
    //             .error(function(data) {
    //                 $scope.showAlert("Oops! There was an error! Contact us at UNRepTeam@gmail.com if this keeps happening. "+data.error.message);
    //             });
    //     };

    // })

    // .controller('ProfileCtrl', function ($scope, OpenFB) {
    //     OpenFB.get('/me').success(function (user) {
    //         $scope.user = user;
    //     });
    // })

    // .controller('PersonCtrl', function ($scope, $stateParams, OpenFB) {
    //     OpenFB.get('/' + $stateParams.personId).success(function (user) {
    //         $scope.user = user;
    //     });
    // })

    // .controller('FriendsCtrl', function ($scope, $stateParams, OpenFB) {
    //     OpenFB.get('/' + $stateParams.personId + '/friends', {limit: 50})
    //         .success(function (result) {
    //             $scope.friends = result.data;
    //         })
    //         .error(function(data) {
    //             $scope.showAlert("Oops! There was an error! Contact us at UNRepTeam@gmail.com if this keeps happening. "+data.error.message);
    //         });
    // })

    // .controller('MutualFriendsCtrl', function ($scope, $stateParams, OpenFB) {
    //     OpenFB.get('/' + $stateParams.personId + '/mutualfriends', {limit: 50})
    //         .success(function (result) {
    //             $scope.friends = result.data;
    //         })
    //         .error(function(data) {
    //             $scope.showAlert("Oops! There was an error! Contact us at UNRepTeam@gmail.com if this keeps happening. "+data.error.message);
    //         });
    // })
    .controller('PetDetailCtrl', function($scope, $stateParams, PetService) {
  // "Pets" is a service returning mock data (services.js)
      $scope.singleEvent = PetService.getSingle();
      // analytics.trackView('Ind. Event: '+$scope.singleEvent.name);


      // window.plugins.flurry.logEvent('Event Detail'+$scope.singleEvent);

      $scope.shareBtn = function(a,b,c,d){
        window.plugins.socialsharing.share(a,b,c,d);
        }


    })

    .controller('FeedCtrl', function ($scope,$state, $stateParams, OpenFB, PetService, $location, $ionicLoading) {
       // analytics.trackView('Event Feed');
      // window.plugins.flurry.logEvent('Event Feed');

      // $http({method: 'GET', url: 'http://stark-eyrie-6720.herokuapp.com/userGet'}).success
      // $scope.events = PetService.all(); //equal to event array located in services


      $scope.go_here = function (eventName) {
        // alert(eventName);
        PetService.setSingle(eventName);
        $state.go("app.event-detail");
      };

        $scope.show = function() {
            $scope.loading = $ionicLoading.show({
                content: 'Loading feed...'
            });
        };
        $scope.hide = function(){
            $scope.loading.hide();
        };


        function loadFeed() {
          // $scope.show();
          $scope.events = PetService.getEvents();
            //
            // $http({method: 'GET', url: 'http://stark-eyrie-6720.herokuapp.com/userGet'}).success(function(result){
            //  // $scope.hide();
            //  alert('got events from server');
            //  $scope.events = result;
            // })
            // $scope.show();
            // OpenFb.get('/'+$stateParams.personId+'/?fields=events').success(function(res){
            //  alert(res.data);
            //  $scope.events=result.data;
            //  // $scope.$broadcast('scroll.refreshComplete');
            // }).error(function(e){
            //  $scope.hide();
            //  alert(e.error.message);
            // });

            // OpenFB.get('/' + $stateParams.personId + '/home', {limit: 30})
            //     .success(function (result) {
            //         $scope.hide();
            //         console.log('hi');
            //         $scope.items = result.data;
            //         // Used with pull-to-refresh
            //         // $scope.$broadcast('scroll.refreshComplete');
            //     })
            //     .error(function(data) {
            //         $scope.hide();
            //         alert(data.error.message);
            //     });
        }

        // $scope.doRefresh = function(){
        //  alert('hi');
        // };

        loadFeed();

    });
