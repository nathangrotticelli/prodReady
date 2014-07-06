angular.module('sociogram.controllers', ['ionic'])

  //for side menu
 .controller('AppCtrl', function ($scope, $state, OpenFB) {
  //logout functionality
  $scope.logout = function () {
    OpenFB.logout();
    $state.go('app.login');
  };
 })

 .controller('LoginCtrl', function ($scope, $ionicPopup, $http, $location, OpenFB, $state, $stateParams, PetService) {

  //used to throw better looking popup messages to user
  $scope.showAlert = function(message) {
    $ionicPopup.alert({
      title: 'Hey '+userName.split(' ')[0]+',',
      content: message
    }).then(function(res) {
      console.log('Alert Shown.');
    });
  };

  //used for login2, or manual email login
  $scope.submitForm = function(emailEntry) {
    loginTryEmail = emailEntry.toLowerCase();
    if (schoolItem.schoolName=='Central Florida'||schoolItem.schoolName=='George Washington University'||schoolItem.schoolName=='Oneonta'||schoolItem.schoolName=='Michigan State'||schoolItem.schoolName=='University of Michigan'||schoolItem.schoolName=='University of Hawaii'||schoolItem.schoolName=='Central Michigan'){
      if((loginTryEmail==='ngrotti1@binghamton.edu'||loginTryEmail.indexOf(schoolItem.emailEnding)>-1&&loginTryEmail.length>schoolItem.emailLength)){
        $http.post('http://stark-eyrie-6720.herokuapp.com/userPost',
          {firstNameLetter: firstNameLetter,
          userName: userName,
          privateEvents: privateEvents,
          userGender: userGender,
          userEmail: userEmail,
          userSchool: schoolName}
        )
        PetService.setEvents(yourEvents);
        $location.path('/app/person/me/feed');
      }
      else{
        $scope.showAlert("That\'s an invalid email! Make sure you are on the right school portal for your respective university, and that you entered your OWN valid university email. If you are in fact a student at this school, and continue to experience trouble, shoot us an email at UNRepTeam@gmail.com or reach out to us through social media ASAP!");
      }
    }
    else {
      if(loginTryEmail==='ngrotti1@binghamton.edu'||loginTryEmail.indexOf(schoolItem.emailEnding)>-1&&loginTryEmail.indexOf(' ')<0&&loginTryEmail[0].indexOf(firstNameLetter)>-1&&loginTryEmail.length>=schoolItem.emailLength&&regExNums.test(loginTryEmail)){
        $http.post('http://stark-eyrie-6720.herokuapp.com/userPost',
          {firstNameLetter: firstNameLetter,
          userProfId: userProfId,
          userName: userName,
          privateEvents: privateEvents,
          userGender: userGender,
          userEmail: userEmail,
          userSchool: schoolName}
        )
        PetService.setEvents(yourEvents);
        $location.path('/app/person/me/feed');
      }
      else{
        $scope.showAlert("That\'s an invalid email! Make sure you are on the right school portal for your respective university, and that you entered your OWN valid university email. If you are in fact a student at this school, and continue to experience trouble, shoot us an email at UNRepTeam@gmail.com or reach out to us through social media ASAP!");
      }
    }
  };

  //called at school tap
  $scope.facebookLogin = function (schoolName) {
    //pulls existing users private events
    var currentUserCheck = function(){
      for(var key in userItem.privateEvents){
        var startDay = userItem.privateEvents[key].start_time.split('/')[1];
        var startYear = userItem.privateEvents[key].start_time.split('/')[2];
        var startMonth = userItem.privateEvents[key].start_time.split('/')[0];

        if(Math.floor(startYear)>Math.floor(currentYear)){
               alert('event added from user private events');
             yourEvents[key] = userItem.privateEvents[key];
        }
        else if(Math.floor(startYear)==Math.floor(currentYear)){
                if(Math.floor(startMonth)>Math.floor(currentMonth)){
               alert('event added from user private events');
             yourEvents[key] = userItem.privateEvents[key];
                 }
                 else if(Math.floor(startMonth)==Math.floor(currentMonth)){
                  if(Math.floor(startDay)>=Math.floor(currentDay)){
                    alert('event added from user private events');
             yourEvents[key] = userItem.privateEvents[key];
                  }
                }
         }
         else{
          delete userItem.privateEvents[key];
         }
      }
    }

    //counts number of current events a school has
    var currentSchoolCheck = function(){
      for(var key in schoolItem.schoolEvents){
        var startDay = schoolItem.schoolEvents[key].start_time.split('/')[1];
        var startYear = schoolItem.schoolEvents[key].start_time.split('/')[2];
        var startMonth = schoolItem.schoolEvents[key].start_time.split('/')[0];

        if (Math.floor(startYear)>Math.floor(currentYear)){
               currentSchoolCount++;
               yourEvents[key] = schoolItem.schoolEvents[key];
               // alert('event added from school events');
               // alert(yourEvents[key].name);
        }
        else if(Math.floor(startYear)==Math.floor(currentYear)){
                if(Math.floor(startMonth)>Math.floor(currentMonth)){
                   currentSchoolCount++;
                   yourEvents[key] = schoolItem.schoolEvents[key];
                   // alert('event added from school events');
                   // alert(yourEvents[key].name);
                 }
                 else if(Math.floor(startMonth)==Math.floor(currentMonth)){
                  if(Math.floor(startDay)>=Math.floor(currentDay)){
                     currentSchoolCount++;
                     yourEvents[key] = schoolItem.schoolEvents[key];
                     // alert('event added from school events');
                     // alert(yourEvents[key].name);
                  }
                }
         }

      }

      return currentSchoolCount;
    }

    //age function
    var getAge = function(dateString) {

      var today = new Date();
      var birthDate = new Date(dateString);
      // alert(dateString);
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
          });
        }
      });
      alert(schoolFriendCount);
      return schoolFriendCount;
    }

    //pulls in user friends from fb and passes it to counter
    var eduSearch = function(){
      //get education of friends
      OpenFB.get("/me?fields=friends.fields(education)",{limit:600})
      //if succesful, count the number of friends who go to a school
      .success(function(eduResult){
        friendChecker(eduResult)
      }).error(function(){ //if failed, show an alert
        $scope.showAlert('Facebook connection failed.');
        $location.path('app.login');
      });
    }

    //allow or deny access based on fb email and number of fb friends at a school
    var checkAllowed = function(){
      // userEmail = "fake@fake"; test email
      // schoolFriendCount = 0; test school friend counts here
      schoolFriendCount = 1000;
      // if they have the required amount of friends or correct email, create user and then take them to the exisiting user flow
      if(Math.floor(schoolFriendCount)>=Math.floor(schoolItem.schoolFriendMin)||userEmail.indexOf(schoolItem.emailEnding)>-1){

        $http.post('http://stark-eyrie-6720.herokuapp.com/userPost',
          {firstNameLetter: firstNameLetter,
          userProfId: userProfId,
          userName: userName,
          privateEvents: privateEvents,
          userGender: userGender,
          userEmail: userEmail,
          userSchool: schoolName}
        ).then(function(){
          fbInnerFlow()
        })
      }
      else{//cant auto verify as a student, take to manual email login
       $state.go("app.login2");
      }
    }

    //populates event lists for successful fb queries
    var eventPopulater = function(listOfAllEvents){
      //start of pull from school events into a users display
      if (!schoolItem.schoolEvents){
        schoolItem.schoolEvents = {};
      }
      else{
        var schoolEventsInAnArray = Object.keys(schoolItem.schoolEvents);
        for (i=0;i<schoolEventsInAnArray.length;i++){
          if(schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time){
             //To correct formatting of event start dates
            if(schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.indexOf('-')>-1){
              var startMonth = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[1];;
              var startDay = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[2].split('T')[0];
              var startYear = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[0];
              schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time=startMonth+"/"+startDay+"/"+startYear;
            }


            var startDay = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('/')[1];
            var startYear = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('/')[2];
            var startMonth = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('/')[0];

              //if it is a current event, add it to the user display
                if (Math.floor(startYear)>Math.floor(currentYear)){
               yourEvents[schoolEventsInAnArray[i]] = schoolItem.schoolEvents[schoolEventsInAnArray[i]];
               // alert('event added from school events');
               // alert(yourEvents[key].name);
                }
                else if(Math.floor(startYear)==Math.floor(currentYear)){
                  if(Math.floor(startMonth)>Math.floor(currentMonth)){
                   yourEvents[schoolEventsInAnArray[i]] = schoolItem.schoolEvents[schoolEventsInAnArray[i]];
                   // alert('event added from school events');
                   // alert(yourEvents[key].name);
                  }
                  else if(Math.floor(startMonth)==Math.floor(currentMonth)){
                   if(Math.floor(startDay)>=Math.floor(currentDay)){
                     yourEvents[schoolEventsInAnArray[i]] = schoolItem.schoolEvents[schoolEventsInAnArray[i]];
                     // alert('event added from school events');
                     // alert(yourEvents[key].name);
                   }
                  }
                }





            //   else if(startMonth==currentMonth){
            //     if(startDay>=currentDay){
            //        alert(yourEvents[schoolEventsInAnArray[i]].name);
            //  yourEvents[schoolEventsInAnArray[i]] = schoolItem.schoolEvents[schoolEventsInAnArray[i]];
            //     }
            //   }
            // }
            //if it is a current event, add it to the user display

          }
        }
      }//end of else

      //start of pull from fb result
      var allEventsInAnArray = Object.keys(listOfAllEvents);
      for (i=0;i<allEventsInAnArray.length;i++){
        //start of if attending of maybe
        if (listOfAllEvents[allEventsInAnArray[i]].attending||listOfAllEvents[allEventsInAnArray[i]].maybe){
          yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
          privateEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
          // alert(privateEvents[allEventsInAnArray[i]].name);
          alert('privateEve');
          $http.post('http://stark-eyrie-6720.herokuapp.com/privateUserEventAdd',
          {
            userEmail: userItem.userEmail,
            userName: userItem.userName,
            privateEvents: privateEvents
          })
        }//end of if attending or maybe


 // if (listOfAllEvents[allEventsInAnArray[i]].name=='Downtown Binghamton Martini Walk 2014'){
 //            alert(listOfAllEvents[allEventsInAnArray[i]].longitude);

 //          }

        if (listOfAllEvents[allEventsInAnArray[i]].longitude&&listOfAllEvents[allEventsInAnArray[i]].longitude!='Longitude: undefined'){
          //defining long and lat values of current event
          longValue = listOfAllEvents[allEventsInAnArray[i]].longitude.split(' ')[1];
          latValue = listOfAllEvents[allEventsInAnArray[i]].latitude.split(' ')[1];

          //if in the schools area, add it to the user, and if not private add to school event list
          if (longValue<=schoolItem.schoolLongMax&&longValue>=schoolItem.schoolLongMin&&latValue<=schoolItem.schoolLatMax&&latValue>=schoolItem.schoolLatMin){
            yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
            //if event is not private
            if(listOfAllEvents[allEventsInAnArray[i]].privacy!='SECRET'){
              schoolItem.schoolEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
              // alert(schoolItem.schoolEvents[allEventsInAnArray[i]].name);
              $http.post('http://stark-eyrie-6720.herokuapp.com/schoolPost',
                {
                schoolName: schoolItem.schoolName,
                schoolEvents: schoolItem.schoolEvents
                }.success(function(){
                 //when event added, do whatever. alert('school event added')
                })
              )
            }
          }
         }// end of if longitude
          //if event has a location

          if (listOfAllEvents[allEventsInAnArray[i]].location){
            //if event location includes the school town, add to user events, and if not private add to school events
            // alert('here1');
            if (listOfAllEvents[allEventsInAnArray[i]].location.indexOf(schoolItem.schoolTown)>-1){
             // alert('here2');//if close to school
              yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
              if(listOfAllEvents[allEventsInAnArray[i]].privacy!='SECRET'){

                schoolItem.schoolEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
                // alert(schoolItem.schoolEvents[allEventsInAnArray[i]].name);
                $http.post('http://stark-eyrie-6720.herokuapp.com/schoolPost',
                  {
                    schoolName: schoolItem.schoolName,
                    schoolEvents: schoolItem.schoolEvents
                  }
                ).success(function(){
                  //when event added, do whatever. alert('school event added')
                })
              }
            }
          }
      }//end of all events in array . length
    }//end of eventpopulator

    //main event query for fb
    var fbQuery = function(){
      OpenFB.get("/me?fields=friends.fields(events.fields(description,cover,privacy,start_time,location,name,venue,maybe.user("+userProfId+"), attending.user(" +userProfId+")))",{limit: 600})
        //if fb query is not successful
      .error(function(data) {
        $scope.showAlert("Facebook connection failed. "+data.error.message);
        $location.path('app.login');
      })
      //if fb query succesful
      .success(function (result2){
        //proceed to put all events into an object with event names being the keys
         var friends = result2.friends.data.filter( function(friend){
            if (friend.events){
              return true;
            }
         });
        friends.forEach(function(friend){
          setEventsList = friend.events.data.map(function(singleEvent){
            startMonth = singleEvent.start_time.split('-')[1];
            startDay = singleEvent.start_time.split('-')[2].split('T')[0];
            startYear = singleEvent.start_time.split('-')[0];


              //if it is a current event, add it to the user display
                   if (Math.floor(startYear)>Math.floor(currentYear)){
                  //cleans the start times
              singleEvent.start_time=startMonth+"/"+startDay+"/"+startYear;
              //cleans the names of event and adds it to list
              listOfAllEvents[singleEvent.name.replace(/\./g,"")] = singleEvent;
              if (singleEvent.venue){
                listOfAllEvents[singleEvent.name.replace(/\./g,"")]['longitude']="Longitude: "+singleEvent.venue.longitude;
                listOfAllEvents[singleEvent.name.replace(/\./g,"")]['latitude']="Latitude: "+singleEvent.venue.latitude;
              }
              if (singleEvent.cover){
                listOfAllEvents[singleEvent.name.replace(/\./g,"")]['cover'] = singleEvent.cover.source;
              }
               // alert('event added from school events');
               // alert(yourEvents[key].name);
                }
                else if(Math.floor(startYear)==Math.floor(currentYear)){
                  if(Math.floor(startMonth)>Math.floor(currentMonth)){
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
                   // alert('event added from school events');
                   // alert(yourEvents[key].name);
                  }
                  else if(Math.floor(startMonth)==Math.floor(currentMonth)){
                   if(Math.floor(startDay)>=Math.floor(currentDay)){
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
                     // alert('event added from school events');
                     // alert(yourEvents[key].name);
                   }
                  }
                }
          });//end of set events list
        });//end of friends.foreach
      })
      .success(function(){
        alert('made it to ep');
        //make new event lists in the event populater
        eventPopulater(listOfAllEvents);
        PetService.setEvents(yourEvents);
        //allow access to feed
       $location.path('/app/person/me/feed');
      });

    }

    //gets and sets personal fb info, takes user to loading screen, and then runs user logic
    var fbInnerFlow = function(){
      //gets and sets current users fb info
      OpenFB.get('/me', {limit: 30}).success(function (result) {
        userProfId = result.id;
        userName = result.name;
        userGender = result.gender;
        // alert(Object.keys(result));
        // alert(result.locale);
        // userAge = getAge(result.birthday);
        userSchool = schoolItem.schoolName;
        // alert(userSchool);
        //if there is an email, set it to lower case
        if(result.email){
          userEmail = result.email.toLowerCase();
        }
        else{
          userEmail = 'none';
        }
        firstNameLetter = result.name[0].toLowerCase();
        //take to loading screen
        userEmail = "ngtest2@gmail.com";
        //can experiment with user emails here
        //check if registered user exists within school user list, responds with DE if they dont
        //have to send user email and user school, backend should look up school user list and check if email exists there
        $http.post('http://stark-eyrie-6720.herokuapp.com/getUser',{userEmail: userEmail, userSchool:userSchool}).success(function(res){

          userItem = res.Item;
          // alert(userItem);
          //DE is equal to doesnt exist
          if(userEmail=='none'){
           userItem="DE";
          }
          //if user exists
          if(userItem!=="DE"){
            $scope.showAlert('Welcome to the U Nightlife app.');
            if(currentSchoolCount>=2){
              //adds existing private events
              currentUserCheck();
              PetService.setEvents(yourEvents);
              //allow feed access
              $location.path('/app/person/me/feed');
              //then run the query in the background
              fbQuery();
            }
            // if school amount is less then 2 events then make user wait for their query to be done
            else{
              fbQuery();
            }
          }
          //registered user does not exist
          else{
            //run fb friend/email check
            eduSearch();
            //make sure edu search completes, then checkAllowed. THIS CAN BE OPTIMized.
            setTimeout(function() { checkAllowed() },3000);
          }
        }).error(function(){
          //person is not already a user and there was an error connect to db
          $scope.showAlert('Could not connect to server.');
          $location.path('app.login');
        });//end of error
      }).error(function(){//end of openfb.get which is getting personal uesr info
        //fb personal info grab failed
        $scope.showAlert('Facebook connection failed.');
        $location.path('app.login');
      });
    }

    //this is the fb login
    var fbLoginFlow = function(){
      //login prompt for facebook
      OpenFB.login('user_events, email,user_about_me,friends_events,friends_education_history,friends_actions.news,friends_activities')
      .then(
        function () {
          //start inner fbFlow
          fbInnerFlow()
        }
      ).error(function(){//if login fails
        $scope.showAlert('Facebook connection could not be acheived, and is required.');
        $location.path('app.login');
      });
    }

    //logic run when school is tapped, logic of the main/big/overarching facebook function. everything above here is just defining functions
    var today = new Date();
    var currentDay = today.getDate();
    var currentMonth = today.getMonth()+1; //January is 0
    var currentYear = today.getFullYear();
    yourEvents = {};
    privateEvents = {};
    listOfAllEvents = {};
    schoolFriendCount = 0;
    currentSchoolCount = 0;
    // today.setSeconds(t.getSeconds() + 10);

    //get school info
    $http.post('http://stark-eyrie-6720.herokuapp.com/getSchool',{schoolName:schoolName}).success(function(res){
      schoolItem = res.Item;
      $location.path('/app/loading');
      //check how many current events exist
      currentSchoolCheck();
      //start the fb login
      fbLoginFlow();
    })

  }; // end of main/big/overarching fb connect function, run when school is tapped, facebookLogin
 }) // end of login controller

  //controller for an expanded single event
 .controller('PetDetailCtrl', function($scope, $stateParams, PetService) {
  //retrieves single event info
  $scope.singleEvent = PetService.getSingle();
  //allows sharing functionaility
  $scope.shareBtn = function(a,b,c,d){
   window.plugins.socialsharing.share(a,b,c,d);
  }
 })

 //controller for event feed
 .controller('FeedCtrl', function ($scope,$state, $stateParams, OpenFB, PetService, $location, $ionicLoading) {
  //expands single event
  $scope.go_here = function (eventName) {
    PetService.setSingle(eventName);
    //changes page and controller
    $state.go("app.event-detail");
  };
  // //dont think this is used
  // $scope.show = function() {
  //   $scope.loading = $ionicLoading.show({
  //     content: 'Loading feed...'
  //   });
  // };
  // //dont think this is used
  // $scope.hide = function(){
  //   $scope.loading.hide();
  // };
  var loadFeed = function() {
    $scope.events = PetService.getEvents();
  }
  loadFeed();
 });
