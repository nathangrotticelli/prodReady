angular.module('sociogram.controllers', ['ionic'])

  //for side menu
  .controller('AppCtrl', function ($scope, $state,$location, OpenFB) {

      $scope.main={};
      $scope.main.dragContent = true;

    //logout functionality
    $scope.logout = function () {

      // if(!$state.is('app.login')){
        OpenFB.logout();

      $state.go('app.login');
      // }

    };

    $scope.goEvents = function(){
      $location.path('/app/person/me/feed');
      //allows for scroll position on the event feed to be maintained. Think about doing this for the other menu buttons
    }

    $scope.goAdd = function(){
      $state.go('app.addAnEvent');
    }

    $scope.goHelp = function(){
      $state.go('app.help');
    }

  })


  .controller('LoginCtrl', function ($scope, $ionicPopup, $http, $location, $ionicLoading,OpenFB, $state, $stateParams, PetService) {
    // $scope.main = {};
    $scope.main.dragContent = false;

    setTimeout(function() {
      navigator.splashscreen.hide();
    }, 500);

    $scope.noPop='false';
    queryGo=false;

    //used to throw better looking popup messages to user
    $scope.showAlert = function(message,title) {
      if(title==undefined){
        title=null;
      }
      $ionicPopup.alert({
        title: title,
        content: message
      }).then(function(res) {
        console.log('Alert Shown.');
      });
    };

    $scope.goLogin = function(){
      $state.go('app.login');
    };

    //used for login2, or manual email login
    $scope.submitForm = function(emailEntry) {

      loginTryEmail = emailEntry.toLowerCase();
      if (schoolItem.schoolName.indexOf('Binghamton')<0){
        if((loginTryEmail==='ngrotti1@binghamton.edu'||loginTryEmail.indexOf(schoolItem.emailEnding)>-1&&loginTryEmail.length>schoolItem.emailLength)){

          $http.post('http://stark-eyrie-6720.herokuapp.com/userPost',
          {firstNameLetter: firstNameLetter,
          userProfId: userProfId,
          userName: userName,
          privateEvents: privateEvents,
          userGender: userGender,
          userEmail: userEmail,
          entranceEmail: loginTryEmail,
          userSchool: schoolItem.schoolName}
          ).then(function(){
            $scope.noPop='true';
            $scope.facebookLogin(schoolItem.schoolName);
          }).then(function(){
            setTimeout(function() { $scope.showAlert('Your U Nightlife feed consists of a refreshing blend of events, which can only be seen right here on the app by verified students. <br>To navigate or reach out to us at any time, just use the menu button in the right hand corner.<br> <br>Smile,<br> U Nightlife Team','Welcome!') },2500);
          })
        }
        else{
          $scope.showAlert("We couldn't verify that as a valid university email. Make sure you are on the right portal for your respective university, and that you have entered your OWN valid email. If you are in fact a student at this school, and continue to experience trouble, shoot us an email at UNightlifeTeam@gmail.com.");
        }
      }//&&loginTryEmail[0].indexOf(firstNameLetter)>-1
      else {
        var regExNums = /[0-9]/g;
        if(loginTryEmail==='ngrotti1@binghamton.edu'||loginTryEmail.indexOf(schoolItem.emailEnding)>-1&&loginTryEmail.length>=schoolItem.emailLength&&regExNums.test(loginTryEmail)){
          $http.post('http://stark-eyrie-6720.herokuapp.com/userPost',
          {firstNameLetter: firstNameLetter,
          userProfId: userProfId,
          userName: userName,
          privateEvents: privateEvents,
          userGender: userGender,
          userEmail: userEmail,
          entranceEmail: loginTryEmail,
          userSchool: schoolItem.schoolName}
          ).then(function(){
            $scope.noPop='true';
            $scope.facebookLogin(schoolItem.schoolName);
          }).then(function(){
            setTimeout(function() { $scope.showAlert('Your U Nightlife feed consists of a refreshing blend of events, which can only be seen right here on the app by verified students. <br>To navigate or reach out to us at any time, just use the menu button in the right hand corner.<br> <br>Smile,<br> U Nightlife Team','Welcome!') },2500);
          })
        }
        else{
          $scope.showAlert("We couldn't verify that as a valid university email. Make sure you are on the right portal for your respective university, and that you entered your OWN valid email. If you are in fact a student at this school, and continue to experience trouble, shoot us an email at UNightlifeTeam@gmail.com.");
        }
      }
    };

    $scope.alert2 = function(){
      $location.path('/app/loading');
    };

    //called at login enter
    $scope.facebookLogin = function (schoolName) {

      $scope.alert2();
      schoolName=schoolName;

      //pulls existing users private events
      var currentUserCheck = function(){
        for(var key in privateEvents){
          var startDay = privateEvents[key].start_time.split('/')[1];
          var startYear = privateEvents[key].start_time.split('/')[2];
          var startMonth = privateEvents[key].start_time.split('/')[0];
          privateEvents[key].startYear = startYear;
          if(privateEvents[key].timeOfEvent!=undefined){
           if(privateEvents[key].timeOfEvent.length<7){
                privateEvents[key].timeString = '0'+privateEvents[key].timeOfEvent;
              }
              else{
                privateEvents[key].timeString = privateEvents[key].timeOfEvent;
              }
          }
          else{
             privateEvents[key].timeString = null;
          }



          if(Math.floor(startYear)>Math.floor(currentYear)){
           yourEvents[key] = privateEvents[key];
          }
          else if(Math.floor(startYear)==Math.floor(currentYear)){
            if(Math.floor(startMonth)>Math.floor(currentMonth)){
             yourEvents[key] = privateEvents[key];
            }
            else if(Math.floor(startMonth)==Math.floor(currentMonth)){
              if(Math.floor(startDay)>=Math.floor(currentDay)){
                yourEvents[key] = privateEvents[key];
              }
            }
          }
          else{
           delete privateEvents[key];
          }
        }
      };

      //counts number of current events a school has
      var currentSchoolCheck = function(){
        for(var key in schoolItem.schoolEvents){
          if(schoolItem.schoolEvents[key].banned!=="banned"){

            var startDay = schoolItem.schoolEvents[key].start_time.split('/')[1];
            var startYear = schoolItem.schoolEvents[key].start_time.split('/')[2];
            var startMonth = schoolItem.schoolEvents[key].start_time.split('/')[0];
            schoolItem.schoolEvents[key].startYear = startYear;

        if(schoolItem.schoolEvents[key].timeOfEvent!=undefined){
           if(schoolItem.schoolEvents[key].timeOfEvent.length<7){
                schoolItem.schoolEvents[key].timeString = '0'+schoolItem.schoolEvents[key].timeOfEvent;
              }
              else{
                schoolItem.schoolEvents[key].timeString = schoolItem.schoolEvents[key].timeOfEvent;
              }
        }
         else{
             schoolItem.schoolEvents[key].timeString = null;
          }



            if (Math.floor(startYear)>Math.floor(currentYear)){
              currentSchoolCount++;
              yourEvents[key] = schoolItem.schoolEvents[key];
            }
            else if(Math.floor(startYear)==Math.floor(currentYear)){
              if(Math.floor(startMonth)>Math.floor(currentMonth)){
                currentSchoolCount++;
                yourEvents[key] = schoolItem.schoolEvents[key];
              }
              else if(Math.floor(startMonth)==Math.floor(currentMonth)){
                if(Math.floor(startDay)>=Math.floor(currentDay)){
                 currentSchoolCount++;
                 yourEvents[key] = schoolItem.schoolEvents[key];
                }
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
                if(schoolItem.schoolName=='SUNY Binghamton'){
                 if (schoolObj.school.name.indexOf('Binghamton University')>-1){
                   schoolFriendCount++;
                 }
                }
                if(schoolItem.schoolName=='SUNY Oneonta'){
                  if (schoolObj.school.name.indexOf('Oneonta')>-1){
                    schoolFriendCount++;
                  }
                }
              }
            });
          }
        });
        return schoolFriendCount;
      }

      //pulls in user friends from fb and passes it to counter
      var eduSearch = function(){
        //get education of friends
        OpenFB.get("/me?fields=friends.fields(education)",{limit:1100})
        //if succesful, count the number of friends who go to a school
        .success(function(eduResult){
          friendChecker(eduResult)
        }).success(function(){
         checkAllowed();
        }).error(function(){
          OpenFB.get("/me?fields=friends.fields(education)",{limit:700})
          .success(function(eduResult){
           friendChecker(eduResult)
          }).success(function(){
           checkAllowed();
          }).error(function(){
            OpenFB.get("/me?fields=friends.fields(education)",{limit:400})
            .success(function(eduResult){
              friendChecker(eduResult)
            }).success(function(){
              checkAllowed();
            }).error(function(){
            //if failed, show an alert
              $scope.showAlert('Facebook connection failed.');
              $location.path('app.login');
            });
          })
        })
      }

      //allow or deny access based on fb email and number of fb friends at a school
      var checkAllowed = function(){
        // if they have the required amount of friends or correct email, create user and then take them to the exisiting user flow
        if(Math.floor(schoolFriendCount)>=Math.floor(schoolItem.schoolFriendMin)||userEmail.indexOf(schoolItem.emailEnding)>-1){
          $http.post('http://stark-eyrie-6720.herokuapp.com/userPost',
          {firstNameLetter: firstNameLetter,
          userProfId: userProfId,
          userName: userName,
          privateEvents: privateEvents,
          userGender: userGender,
          userEmail: userEmail,
          userSchool: schoolItem.schoolName}
          ).then(function(){ fbInnerFlow() }).then(function(){
           setTimeout(function() { $scope.showAlert('Your U Nightlife feed consists of a refreshing blend of events, which can only be seen right here on the app by verified students. <br>To navigate or reach out to us at any time, just use the menu button in the right hand corner.<br> <br>Smile,<br> U Nightlife Team','Welcome!') },2500);
          })
        }
        else{//cant auto verify as a student, take to manual email login
         $state.go("app.login2");
        }
      }

      //populates event lists for successful fb queries
      var eventPopulater = function(listOfAllEvents){
        var inviteCheck = function(event){
          OpenFB.get("/"+event.id+"/invited",{limit:105}).success(function(res){
            if(res.data.length>schoolItem.inviteNum){
              schoolItem.schoolEvents[event.name] = event;
              $http.post('http://stark-eyrie-6720.herokuapp.com/schoolPost',
                {
                  schoolName: schoolItem.schoolName,
                  schoolEvents: schoolItem.schoolEvents
                }).success(function(){
                //when event added, do whatever. alert('school event added')
              })
            }
          })
        }

        //start of pull from fb result
        var allEventsInAnArray = Object.keys(listOfAllEvents);
        for (i=0;i<allEventsInAnArray.length;i++){
          if (listOfAllEvents[allEventsInAnArray[i]].longitude&&listOfAllEvents[allEventsInAnArray[i]].longitude!='Longitude: undefined'){
            //defining long and lat values of current event
            longValue = listOfAllEvents[allEventsInAnArray[i]].longitude.split(' ')[1];
            latValue = listOfAllEvents[allEventsInAnArray[i]].latitude.split(' ')[1];
            //if in the schools area, add it to the user, and if not private add to school event list
            if (longValue<=schoolItem.schoolLongMax&&longValue>=schoolItem.schoolLongMin&&latValue<=schoolItem.schoolLatMax&&latValue>=schoolItem.schoolLatMin){
              if(schoolItem.schoolEvents[allEventsInAnArray[i]]==undefined||schoolItem.schoolEvents[allEventsInAnArray[i]].start_time!==listOfAllEvents[allEventsInAnArray[i]].start_time){
                yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
                //if event is not private
                if(listOfAllEvents[allEventsInAnArray[i]].privacy!='SECRET'){
                  inviteCheck(listOfAllEvents[allEventsInAnArray[i]]);
                }
              }
            }
          }// end of if longitude

          //if event has a location
          if (listOfAllEvents[allEventsInAnArray[i]].location){
            //if event location includes the school town, add to user events, and if not private add to school events
            if (listOfAllEvents[allEventsInAnArray[i]].location.indexOf(schoolItem.schoolTown)>-1){
              if(schoolItem.schoolEvents[allEventsInAnArray[i]]==undefined){
                yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
                if(listOfAllEvents[allEventsInAnArray[i]].privacy!='SECRET'){
                  inviteCheck(listOfAllEvents[allEventsInAnArray[i]]);
                }
              }
            }
          }

          if(schoolItem.schoolEvents[allEventsInAnArray[i]]==undefined){
            //start of if attending of maybe
            if (listOfAllEvents[allEventsInAnArray[i]].attending||listOfAllEvents[allEventsInAnArray[i]].maybe){
              if(!privateEvents[allEventsInAnArray[i]]){
                yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
                privateEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
                $http.post('http://stark-eyrie-6720.herokuapp.com/privateUserEventAdd',
                {userEmail: userItem.userEmail,

                privateEvents: privateEvents
                })
              }
            }//end of if attending or maybe
          }//end of if to prevent events that are already school events and/or banned to become private
        }//end of all events in array . length
      };//end of eventpopulator


      var getFormattedTime = function (fourDigitTime) {
        var hours24 = parseInt(fourDigitTime.substring(0, 2),10);
        var hours = ((hours24 + 11) % 12) + 1;
        var amPm = hours24 > 11 ? 'pm' : 'am';
        var minutes = fourDigitTime.substring(2);
        return hours + ':' + minutes + amPm;
      };

      var fbWorked = function(result2){
      //proceed to put all events into an object with event names being the keys
      var friends = result2.friends.data.filter( function(friend){
        if (friend.events){
          return true;
        }
      });
      friends.forEach(function(friend){
          setEventsList = friend.events.data.map(function(singleEvent){
            var startMonth = singleEvent.start_time.split('-')[1];
            var startDay = singleEvent.start_time.split('-')[2].split('T')[0];
            var startYear = singleEvent.start_time.split('-')[0];
            singleEvent.startYear = startYear;


            if(singleEvent.start_time.indexOf(':')>-1){
              startTime = singleEvent.start_time.split('-')[2].split('T')[1].replace(":", "").substring(0, 4);
              singleEvent.timeOfEvent = getFormattedTime(startTime);
              if(singleEvent.timeOfEvent.length<7){
                singleEvent.timeString = '0'+singleEvent.timeOfEvent;
              }
              else{
                singleEvent.timeString = singleEvent.timeOfEvent;
              }
            }
            else{
             singleEvent.timeOfEvent = null;
            }

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
                }
              }
            }
          });//end of set events list
        });//end of friends.foreach
      }


      //main event query for fb
      var fbQuery = function(){
        OpenFB.get("/me?fields=friends.fields(events.fields(description,cover,privacy,start_time,location,attending,name,maybe.user("+userProfId+"), attending.user(" +userProfId+")))",{limit:950})
        //if fb query is not successful
        .error(function() {
          OpenFB.get("/me?fields=friends.fields(events.fields(description,cover,privacy,start_time,location,attending,name,maybe.user("+userProfId+"), attending.user(" +userProfId+")))",{limit: 600}).error(function(){
            OpenFB.get("/me?fields=friends.fields(events.fields(description,cover,privacy,start_time,location,attending,name,maybe.user("+userProfId+"), attending.user(" +userProfId+")))",{limit: 250}).error(function(){
              OpenFB.get("/me?fields=friends.fields(events.fields(description,cover,privacy,start_time,location,attending,name,maybe.user("+userProfId+"), attending.user(" +userProfId+")))",{limit: 10}).error(function(data){
                $scope.showAlert("Facebook connection could not be achieved at this time. "+data.error.message);
                $location.path('app.login');
              }).success(function(result2){
                fbWorked(result2);
              }).success(function(){
                //make new event lists in the event populater
                eventPopulater(listOfAllEvents);
                PetService.setEvents(yourEvents);
                //allow access to feed
                if(queryGo==true){
                  $location.path('/app/person/me/feed');
                }
              });
            }).success(function(result2){
              fbWorked(result2);
            }).success(function(){
              //make new event lists in the event populater
              eventPopulater(listOfAllEvents);
              PetService.setEvents(yourEvents);
              //allow access to feed
              if(queryGo==true){
               $location.path('/app/person/me/feed');
              }
            });
          }).success(function(result2){
            fbWorked(result2);
          }).success(function(){
            //make new event lists in the event populater
            eventPopulater(listOfAllEvents);
            PetService.setEvents(yourEvents);
            //allow access to feed
            if(queryGo==true){
            $location.path('/app/person/me/feed');
            }
          });
        })
        //if fb query succesful
        .success(function (result2){
         fbWorked(result2);
        })
        .success(function(){
          //make new event lists in the event populater
          eventPopulater(listOfAllEvents);
          PetService.setEvents(yourEvents);
          //allow access to feed
          if(queryGo==true){
            $location.path('/app/person/me/feed');
          }
        });
      };

      //gets and sets personal fb info, takes user to loading screen, and then runs user logic
      var fbInnerFlow = function(){
        //gets and sets current users fb info
        OpenFB.get('/me', {limit: 30}).success(function (result) {
          userProfId = result.id;
          PetService.setUserId(userProfId);
          // alert(PetService.getUserId());
          userSchool = schoolItem.schoolName;
          if(result.gender){
             userGender = result.gender;
          }
          else{
           userGender= "none";
          }
           if(result.name){
            userName = result.name;
            firstNameLetter = result.name[0].toLowerCase();
          }
          else{
           userName = "none";
           firstNameLetter = "none";
          }
          //if there is an email, set it to lower case
          if(result.email){
            userEmail = result.email.toLowerCase();
          }
          else{
           userEmail = userProfId;
          }

          //take to loading screen
          // userEmailchange = "ngtestnew6@gmail.com";
          //can experiment with user emails here
          //check if registered user exists within school user list, responds with DE if they dont
          //have to send user email and user school, backend should look up school user list and check if email exists there
          $http.post('http://stark-eyrie-6720.herokuapp.com/getUser',{userEmail: userEmail, userSchool:userSchool}).success(function(res){
            userItem = res.Item;
            if(userItem.privateEvents==null){
             privateEvents = {};
            }
            else{
             privateEvents = userItem.privateEvents;
            }
            if(userItem.banned==="banned"){
              $scope.showAlert('This account has been banned for violating our Terms of Use. Contact us at UNightlifeTeam@gmail.com if you think is a mistake.');
              $state.go('app.login');
            }
            else{
              //DE is equal to doesnt exist
              //if user exists
              if(userItem!=="DE"){
                //check how many current events exist
                currentSchoolCheck();
                //adds existing private events
                currentUserCheck();
                if(currentSchoolCount>=2){
                  PetService.setEvents(yourEvents);
                  //allow feed access
                  $location.path('/app/person/me/feed');
                  //then run the query in the background
                  fbQuery();
                }
                // if school amount is less then 2 events then make user wait for their query to be done
                else{
                  queryGo = true;
                  fbQuery();
                }
                if(userItem.userSchool!==schoolItem.schoolName){
                  $http.post('http://stark-eyrie-6720.herokuapp.com/userSchoolPost',
                  {userEmail: userEmail,
                  userName: userName,
                  userSchool: userSchool
                  })
                }
              }
              //registered user does not exist
              else{
              //run fb friend/email check
                eduSearch();
              }
            }//end of else
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
      };

      //this is the fb login
      var fbLoginFlow = function(){
        //login prompt for facebook, where permissions are asked
        OpenFB.login('user_events, email,friends_events,friends_education_history',function(res) {
        },
        function(error) {
          // alert('Facebook login failed: ' + error.error_description);
        })
        .then(function(){
          //start inner fbFlow
          fbInnerFlow();
        }
        ).error(function(){//if login fails
          $scope.showAlert('Facebook connection could not be achieved, and is required.');
          $location.path('app.login');
        });
      }

      //logic run when school is tapped, logic of the main/big/overarching facebook function. everything above here is just defining functions
      var today = new Date();
      var currentDay = today.getDate();
      var currentMonth = today.getMonth()+1; //January is 0
      var currentYear = today.getFullYear();
      yourEvents = {};
      listOfAllEvents = {};
      schoolFriendCount = 0;
      currentSchoolCount = 0;
      PetService.setSchool(schoolName);

      if($scope.noPop=='false'){
        //get school info
        $http.post('http://stark-eyrie-6720.herokuapp.com/getSchool', {schoolName:schoolName}).success(function(res){
          schoolItem = res.Item;
          //start the fb login
          fbLoginFlow();
        }).error(function(){
          $scope.showAlert("Connection could not be achieved at this time. Try again when service increases.");
          $location.path('/app/login');
        })
      }
      else{
       fbInnerFlow();
      }
    }; // end of main/big/overarching fb connect function, run when school is tapped, facebookLogin
  }) // end of login controller

  //controller for an expanded single event
  .controller('PetDetailCtrl', function($scope,$http, $state,$ionicNavBarDelegate,$location,$stateParams,$ionicPopup, PetService) {
    // $scope.main = {};
    $scope.main.dragContent = true;
    // alert(main.dragContent);
    //retrieves single event info
    $scope.singleEvent = PetService.getSingle();

    $scope.scrollTop = function() {
    $state.go('app.feed');
    };
    $scope.goTicket = function() {
      //go to ticket link
      window.open($scope.singleEvent.ticketLink,"_system");
       schoolName = PetService.getSchool();

      $http.post('http://stark-eyrie-6720.herokuapp.com/ticketCount', {schoolName:schoolName}).success(function(){
        alert("worked!");
      })
      //add one to counter
    // $location.path('/app/person/me/feed');
    };

    $scope.goBack = function() {
    $location.path('/app/person/me/feed');
    };


    // Show a custom alertDismissed
    //
    $scope.showAlert1 = function() {
        navigator.notification.alert(
            'You are the winner!',  // message
            alert('hi'),         // callback
            'Game Over',            // title
            'Done'                  // buttonName
        );
    }


    $scope.link = "maps://?q="+$scope.singleEvent.location;

    $scope.mapThis = function(){
      window.location.href = $scope.link;
    }
    $scope.showAlert = function(message) {
      $ionicPopup.alert({
      title: null,
      content: message
      }).then(function(res) {
      console.log('Alert Shown.');
      });
    };
    //in progress add to calendar
    $scope.calAdd = function() {

        //replace these with times and then the thing below
        var year=$scope.singleEvent.start_time.split("/")[2];
        var month=$scope.singleEvent.start_time.split("/")[0];
        var month=month-1;
        var day=$scope.singleEvent.start_time.split("/")[1];
        var hour=$scope.singleEvent.timeOfEvent.split(":")[0];
        var hour=Math.floor(hour);
        var ending=minute=$scope.singleEvent.timeOfEvent.split(":")[1].slice(2,4);
        var ending=ending.toLowerCase();
        if(ending=="pm"&&hour!=12){
          hour=hour+=12;
          if(hour!=24){
           endHour=hour+1;
          }
          else{
           endHour=24;
          }
        }
        else{
           endHour=hour+1;
        }
        minute=$scope.singleEvent.timeOfEvent.split(":")[1].slice(0,2);
        var startDate = new Date(year,month,day,hour,minute);
        var endDate = new Date(year,month,day,endHour,minute);
        var title = $scope.singleEvent.name;
        var location = $scope.singleEvent.location;
        var notes = null;

        var success = function(message) {
         $scope.showAlert("Event Added to Your Calendar.");
        };

        // var success2 = function(message) { alert('hi'); };
        var error = function(message) { console.log("Calendar Error: " + message); };

        window.plugins.calendar.createEvent(title,location,notes,startDate,endDate,success,error);
    }

    $scope.showEvent = false;

    $scope.expandEvent= function(theDiv) {
     $scope.showEvent = !$scope.showEvent;
    };
    //allows sharing functionaility
    $scope.shareBtn = function(a,b,c,d){
      analytics.trackEvent('button', 'click', 'share button', 1);
      // ga('send', 'event', 'button', 'click', 'share button', 1);
     window.plugins.socialsharing.share(a,b,c,d);
    };
  })

  //controller for event feed, starts analytics when people enter
  .controller('FeedCtrl', function ($scope,$state,$http, $ionicScrollDelegate,$ionicPopup, $ionicPopover,$stateParams, OpenFB, PetService, $location, $ionicLoading) {
    // $scope.main = {};
    $scope.main.dragContent = true;
    //  alert($scope.main.dragContent);
    analytics.startTrackerWithId('UA-53156722-1');
    analytics.trackView('Event Feed Accessed');

     $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });

  $scope.userProfId = PetService.getUserId();
  // userProfId = PetService.getUserId();

$scope.unFriends = PetService.getUNFriends();

  $scope.findFriends = function(){
    userProfId = PetService.getUserId();
     // alert("error");
     OpenFB.get("/"+userProfId+"?fields=friends",{limit:1300}).success(function(res){
      fbFriends = res.friends.data;//this is an array with friend objects
         $http.post('http://stark-eyrie-6720.herokuapp.com/findFriends', {userProfId:userProfId, fbFriends:fbFriends}).error(function(){
          alert("error");
        }).success(function(res){
          // alert("success");
          // alert(userProfId);
          // alert(res);
          // alert(res.userIds);
          // alert(res.userIds[0].userName);
          // alert(res.userIds[1].userName);
          PetService.setUNFriends(res.userIds);
           $state.go("app.friends");
          // .success(function(res){

          // });
           // $scope.unFriends = res.userIds;
          // $state.go("app.friends");
          // alert(res.userIds[2].userName);
           // res.json({Item: user});
        });
     })

    //send an array of all fb friends in a request that returns an array of user objects that match existing people

    //set the list in services and display that list
  };

    $scope.showAlert = function(message,title) {
      if(title==undefined){
      title=null;
      }
      $ionicPopup.alert({
      title: title,
      content: message
      }).then(function(res) {
      console.log('Alert Shown.');
      });
    };

    $scope.newEventSend = function(name,email,date,time,address,info){
      if(name==undefined||date==undefined||time==undefined||address==undefined){
       $scope.showAlert("Please make sure you haven't left any fields empty.","Missing Fields.");
      }
      else if(email==undefined||email.indexOf('@')<0&&email.indexOf('.')<0){
       $scope.showAlert("Please make sure you have entered a valid email.","Invalid Email");
      }
      else{
        $http.post('http://stark-eyrie-6720.herokuapp.com/userEventSubmit',
        {userName: userName,
        userEmail: userEmail,
        userSchool: schoolItem.schoolName,
        eventName: name,
        eventEmail: email,
        eventDate: date,
        eventTime: time,
        eventInfo: info,
        eventAddress: address
        }).success(function(){
          $scope.showAlert("Your event was submitted, we'll be in touch shortly via email.","Success!");
          $location.path('/app/person/me/feed');
        }).error(function(){
         $scope.showAlert("Connection to the server could not be acheived at this time, make sure you have internet connection.","Failed.");
        })
      }
    };

    //expands single event
    $scope.go_here = function (eventName) {
      PetService.setSingle(eventName);
      //changes page and controller
      $state.go("app.event-detail");
    };
// $scope.followed1 = friendFollowed(friend)

//     $scope.friendFollowed = function (friend) {

//          if(friend.followers.indexOf(userProfId)>-1){//if u follow them
//           for(q=0;q<$scope.unFriends.length;q++){
//             if($scope.unFriends[q].userProfId == friend.userProfId){
//                return true;
//             }

//         //display as followed

//         //
//       }
//     }
//     else{
//                 return false;
//           }
// };


  // var followingId = friend.userProfId;
      // var count=0;


$scope.countFollowers = function(){
  $scope.followCount = 'n/a';
  $http.post('http://stark-eyrie-6720.herokuapp.com/followCount',
        {userProfId:userProfId}).error(function(){
          $scope.showAlert("Connection to the server could not be acheived at this time. Increase your WiFi/service or try again later.","Failed.");
        }).success(function(res){
          // return res.count;
          // count = res.count;
          // alert(res.count);
          $scope.followCount = res.count;
          // $state.go("app.friends");
          // alert("worked!");
          // alert();
        });

  // for(q=0;q<$scope.unFriends.length;q++){
  //       // if($scope.unFriends[q].userProfId==followingId){
  //         if($scope.unFriends[q].followers.indexOf(userProfId)>-1){
  //           alert('count');
  //           count++;
  //         }
  //     }

};


$scope.countFollowers();


    // $scope.followed1 = friendFollowed(friend);
      // alert();
      //check if friend is followed,
      //add to both arrays, then change
      //   $http.post('http://stark-eyrie-6720.herokuapp.com/getSchool', {schoolName:schoolName}).error(function(){
      //     $scope.$broadcast('scroll.refreshComplete');
      //   }).success(function(res){})

      // PetService.setSingle(eventName);
      // //changes page and controller
      // $state.go("app.event-detail");
    $scope.followAction = function (friend) {
      // unFriends = PetService.getUNFriends();
      // alert(unFriends[0].userName);
      // alert(JSON.stringify(unFriends[0]));
      // alert(unFriends[key]);
      // alert(unFriends[friend.userName].userName);


    //   // var unFriends = PetService.getUNFriends();
    //   alert(friend.userName);
    //   alert(friend.followers.indexOf(userProfId)>-1);
    //   if(friend.followers.indexOf(userProfId)>-1){//if you follow them
    //     alert(friend.userName);
    //    // add to array locally,
    //    for(i=0;i<$scope.unFriends.length;i++){//for all un friends
    //       if($scope.unFriends[i].followers.indexOf(userProfId)>-1){//if
    //          // alert(friend.followers.indexOf(userProfId)>-1);

    //      $scope.unFriends[i].followers.pop(userProfId);
    //      PetService.setUNFriends($scope.unFriends);
    //      alert($scope.unFriends[i].userName);
    //      alert($scope.unFriends[i].followers);
    //      // PetService.setUNFriends(unFriends);

    //        // $scope.unFriends = unFriends;
    //     //
    //   }
    //  }
    // }
    var followingId = friend.userProfId;

      for(q=0;q<$scope.unFriends.length;q++){
        if($scope.unFriends[q].userProfId==followingId){
          if($scope.unFriends[q].followers.indexOf(userProfId)>-1){
            $scope.unFriends[q].followers.pop(userProfId);
            $http.post('http://stark-eyrie-6720.herokuapp.com/unfollow',
        {userProfId:userProfId,
          followingId:followingId}).error(function(){
          $scope.showAlert("Connection to the server could not be acheived at this time. Increase your WiFi/service or try again later.","Failed.");
        }).success(function(res){
          // $state.go("app.friends");
          // alert("worked!");
          // alert();
        });
       }
            else{
         $scope.unFriends[q].followers.push(userProfId);
            $http.post('http://stark-eyrie-6720.herokuapp.com/follow',
        {userProfId:userProfId,
          followingId:followingId}).error(function(){
          $scope.showAlert("Connection to the server could not be acheived at this time. Increase your WiFi/service or try again later.","Failed.");
        }).success(function(res){
           // add notification that you added a follower

          // $state.go("app.friends");
          // alert("worked!");
          // alert();
        });

      }
     }
    }

   };

    $scope.predicate=event.timeOfEvent;

     $scope.alert3 = function(){


        schoolName = PetService.getSchool();
        // alert(schoolName);
         $http.post('http://stark-eyrie-6720.herokuapp.com/getSchool', {schoolName:schoolName}).error(function(){
          $scope.$broadcast('scroll.refreshComplete');
        }).success(function(res){

          currentList = {};
          var today = new Date();
          var currentDay = today.getDate();
          var currentMonth = today.getMonth()+1; //January is 0
          var currentYear = today.getFullYear();
          schoolItem = res.Item;
          // alert(schoolItem.schoolName);
          //start the fb login
          // fbLoginFlow();
        for(var key in schoolItem.schoolEvents){
          // alert(schoolItem.schoolName);



            var startDay = schoolItem.schoolEvents[key].start_time.split('/')[1];
            var startYear = schoolItem.schoolEvents[key].start_time.split('/')[2];
            var startMonth = schoolItem.schoolEvents[key].start_time.split('/')[0];
            schoolItem.schoolEvents[key].startYear = startYear;

        if(schoolItem.schoolEvents[key].timeOfEvent!=undefined){
           // alert(schoolItem.schoolName);
           if(schoolItem.schoolEvents[key].timeOfEvent.length<7){
                schoolItem.schoolEvents[key].timeString = '0'+schoolItem.schoolEvents[key].timeOfEvent;
                // alert('hi');
              }
              else{
                schoolItem.schoolEvents[key].timeString = schoolItem.schoolEvents[key].timeOfEvent;
                // alert('hi22');
              }
        }
         else{
          // alert("null");
             schoolItem.schoolEvents[key].timeString = null;
          }

            if (Math.floor(startYear)>Math.floor(currentYear)){
               // alert('here12');
              currentList[key] = schoolItem.schoolEvents[key];
            }
            else if(Math.floor(startYear)==Math.floor(currentYear)){
              // alert(startYear);
              if(Math.floor(startMonth)>Math.floor(currentMonth)){
                 // alert('here122');
                currentList[key] = schoolItem.schoolEvents[key];
              }
              else if(Math.floor(startMonth)==Math.floor(currentMonth)){
                if(Math.floor(startDay)>=Math.floor(currentDay)){
                  // alert('here1');
                 currentList[key] = schoolItem.schoolEvents[key];
                }
              }
            }

        }
        PetService.refreshEvents(currentList);
        }).success(function(){
          // alert(currentList);

           $scope.events = PetService.getEvents();
          // loadFeed();
          $scope.$broadcast('scroll.refreshComplete');
        })
      }
    $scope.go_event = function () {
      $state.go("app.newEventForm");
    };

    $scope.goAdd = function () {
     $state.go("app.addAnEvent");
    };

    var loadFeed = function() {
      $scope.events = PetService.getEvents();
    };

    // $scope.countFollowers();
    loadFeed();
  });
