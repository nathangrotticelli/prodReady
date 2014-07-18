angular.module('sociogram.controllers', ['ionic'])

  //for side menu
 .controller('AppCtrl', function ($scope, $state, OpenFB) {
  //logout functionality
  $scope.logout = function () {
    OpenFB.logout();
    $state.go('app.login');
  };

  $scope.refresh = function () {
    $state.go('app.loading');
    // $scope.noPop='true';
    // $scope.facebookLogin('schoolItem.schoolName');
  };


 })


 .controller('LoginCtrl', function ($scope, $ionicPopup, $http, $location,$ionicModal, $ionicLoading,OpenFB, $state, $stateParams, PetService) {

    $scope.noPop='false';


   $ionicModal.fromTemplateUrl('company.html', function(modal) {
    $scope.companyModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  // Open our new task modal
  $scope.openComp = function() {
    $scope.companyModal.show();
  };
  $scope.goLogin = function(){
    $state.go('app.login');
  };
    // title: 'Hey '+userName.split(' ')[0]+',',

  //used to throw better looking popup messages to user
  $scope.showAlert = function(message,title) {
    // alert(title);
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

  //used for login2, or manual email login
  $scope.submitForm = function(emailEntry) {

    loginTryEmail = emailEntry.toLowerCase();
    if (schoolItem.schoolName.indexOf('Binghamton')<0){
      // alert(loginTryEmail);
      if((loginTryEmail==='ngrotti1@binghamton.edu'||loginTryEmail.indexOf(schoolItem.emailEnding)>-1&&loginTryEmail.length>schoolItem.emailLength)){

        // alert(schoolItem.schoolName);
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
           setTimeout(function() { $scope.showAlert('Tap an event photo to bring up an expanded view, navigate the app through the menu icon in the top right hand corner, and if you think we can improve your experience in any way, have an idea or just want to talk, we encourage you to contact us. Enjoy.','Welcome to the U Nightlife app.') },2500);

        })
      }
      else{
        $scope.showAlert("We couldn't verify that as a valid university email. Make sure you are on the right portal for your respective university, and that you have entered your OWN valid email. If you are in fact a student at this school, and continue to experience trouble, shoot us an email at UNRepTeam@gmail.com.");
      }
    }
    else {
      // alert(loginTryEmail+'fff');
      if(loginTryEmail==='ngrotti1@binghamton.edu'||loginTryEmail.indexOf(schoolItem.emailEnding)>-1&&loginTryEmail.indexOf(' ')<0&&loginTryEmail[0].indexOf(firstNameLetter)>-1&&loginTryEmail.length>=schoolItem.emailLength&&regExNums.test(loginTryEmail)){
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
           setTimeout(function() { $scope.showAlert('Tap an event photo to bring up an expanded view, navigate the app through the menu icon in the top right hand corner, and if you think we can improve your experience in any way, have an idea or just want to talk, we encourage you to contact us. Enjoy.','Welcome to the U Nightlife app.') },2500);

        })
      }
      else{
        $scope.showAlert("We couldn't verify that as a valid university email. Make sure you are on the right portal for your respective university, and that you entered your OWN valid email. If you are in fact a student at this school, and continue to experience trouble, shoot us an email at UNRepTeam@gmail.com.");
      }
    }
  };
 $scope.alert2 = function(schoolName){
  alert(schoolName);
 }
  //called at school tap
  $scope.facebookLogin = function (schoolName) {

    $location.path('/app/loading');

    schoolName=schoolName;
    //pulls existing users private events
    var currentUserCheck = function(){
      // alert('here')
      for(var key in privateEvents){
         // alert(userItem.privateEvents[key].name);
        var startDay = privateEvents[key].start_time.split('/')[1];
        var startYear = privateEvents[key].start_time.split('/')[2];
        var startMonth = privateEvents[key].start_time.split('/')[0];
         // alert('here2')

        if(Math.floor(startYear)>Math.floor(currentYear)){
               // alert('event added from user private events');
             yourEvents[key] = privateEvents[key];
        }
        else if(Math.floor(startYear)==Math.floor(currentYear)){
                if(Math.floor(startMonth)>Math.floor(currentMonth)){
               // alert('event added from user private events');
             yourEvents[key] = privateEvents[key];
                 }
                 else if(Math.floor(startMonth)==Math.floor(currentMonth)){
                  if(Math.floor(startDay)>=Math.floor(currentDay)){
                    // alert('event added from user private events');
             yourEvents[key] = privateEvents[key];
                  }
                }
         }
         else{
          delete privateEvents[key];
         }
      }
    }

    //counts number of current events a school has
    var currentSchoolCheck = function(){
      for(var key in schoolItem.schoolEvents){



if(schoolItem.schoolEvents[key].banned!=="banned"){
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
      // alert(schoolFriendCount);
       // alert(schoolItem.schoolFriendMin);
      // schoolFriendCount=30;

      return schoolFriendCount;
    }

    //pulls in user friends from fb and passes it to counter
    var eduSearch = function(){
      //get education of friends
      OpenFB.get("/me?fields=friends.fields(education)",{limit:600})
      //if succesful, count the number of friends who go to a school
      .success(function(eduResult){
        friendChecker(eduResult)
      }).success(function(){
              checkAllowed();
      }).error(function(){ //if failed, show an alert
        $scope.showAlert('Facebook connection failed.');
        $location.path('app.login');
      });
    }

    //allow or deny access based on fb email and number of fb friends at a school
    var checkAllowed = function(){
      // alert(schoolFriendCount);
      // userEmail = "fake@fake"; test email
      // schoolFriendCount = 0; test school friend counts here
      // schoolFriendCount = 1000;
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
           setTimeout(function() { $scope.showAlert('Tap an event photo to bring up an expanded view, navigate the app through the menu icon in the top right hand corner, and if you think we can improve your experience in any way, have an idea or just want to talk, we encourage you to contact us. Enjoy.','Welcome to the U Nightlife app.') },2000);

        })
      }
      else{//cant auto verify as a student, take to manual email login
       $state.go("app.login2");
      }
    }

    //populates event lists for successful fb queries
    var eventPopulater = function(listOfAllEvents){
      // alert('1');
      //start of pull from school events into a users display
      // if (!schoolItem.schoolEvents){
      //   schoolItem.schoolEvents = {};
      // }
      // else{
      //   var schoolEventsInAnArray = Object.keys(schoolItem.schoolEvents);
      //   for (i=0;i<schoolEventsInAnArray.length;i++){
      //    if(schoolItem.schoolEvents[schoolEventsInAnArray[i]].banned!=="banned"){
      //     if(schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time){
      //        //To correct formatting of event start dates
      //       if(schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.indexOf('-')>-1){
      //         var startMonth = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[1];;
      //         var startDay = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[2].split('T')[0];
      //         var startYear = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('-')[0];
      //         schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time=startMonth+"/"+startDay+"/"+startYear;
      //       }


      //       var startDay = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('/')[1];
      //       var startYear = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('/')[2];
      //       var startMonth = schoolItem.schoolEvents[schoolEventsInAnArray[i]].start_time.split('/')[0];

      //         //if it is a current event, add it to the user display
      //           if (Math.floor(startYear)>Math.floor(currentYear)){
      //          yourEvents[schoolEventsInAnArray[i]] = schoolItem.schoolEvents[schoolEventsInAnArray[i]];
      //          // alert('event added from school events');
      //          // alert(yourEvents[key].name);
      //           }
      //           else if(Math.floor(startYear)==Math.floor(currentYear)){
      //             if(Math.floor(startMonth)>Math.floor(currentMonth)){
      //              yourEvents[schoolEventsInAnArray[i]] = schoolItem.schoolEvents[schoolEventsInAnArray[i]];
      //              // alert('event added from school events');
      //              // alert(yourEvents[key].name);
      //             }
      //             else if(Math.floor(startMonth)==Math.floor(currentMonth)){
      //              if(Math.floor(startDay)>=Math.floor(currentDay)){
      //                yourEvents[schoolEventsInAnArray[i]] = schoolItem.schoolEvents[schoolEventsInAnArray[i]];
      //                // alert('event added from school events');
      //                // alert(yourEvents[key].name);
      //              }
      //             }
      //           }
      //       //if it is a current event, add it to the user display

      //     }
      //    }
      //   }
      // }//end of else

 // alert('2');
      //start of pull from fb result
      var allEventsInAnArray = Object.keys(listOfAllEvents);
      for (i=0;i<allEventsInAnArray.length;i++){

 // if (listOfAllEvents[allEventsInAnArray[i]].name=='Downtown Binghamton Martini Walk 2014'){
 //            alert(listOfAllEvents[allEventsInAnArray[i]].longitude);

 //          }

        if (listOfAllEvents[allEventsInAnArray[i]].longitude&&listOfAllEvents[allEventsInAnArray[i]].longitude!='Longitude: undefined'){

          //defining long and lat values of current event
          longValue = listOfAllEvents[allEventsInAnArray[i]].longitude.split(' ')[1];
          latValue = listOfAllEvents[allEventsInAnArray[i]].latitude.split(' ')[1];

          //if in the schools area, add it to the user, and if not private add to school event list
          if (longValue<=schoolItem.schoolLongMax&&longValue>=schoolItem.schoolLongMin&&latValue<=schoolItem.schoolLatMax&&latValue>=schoolItem.schoolLatMin){
             alert('here');
            if(schoolItem.schoolEvents[allEventsInAnArray[i]]==undefined||schoolItem.schoolEvents[allEventsInAnArray[i]].start_time!==listOfAllEvents[allEventsInAnArray[i]].start_time){
 alert('3');
            yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
            //if event is not private
            if(listOfAllEvents[allEventsInAnArray[i]].privacy!='SECRET'){
              OpenFB.get("/529056407221814/invited",{limit:150}).success(function(res){
              alert(res.data.length);
            })
                 // alert('here3');
              // alert(schoolItem.schoolEvents[allEventsInAnArray[i]].name);
              // alert(schoolItem.schoolEvents[allEventsInAnArray[i]].banned);

              schoolItem.schoolEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];

              // alert(schoolItem.schoolEvents[allEventsInAnArray[i]].name);
              $http.post('http://stark-eyrie-6720.herokuapp.com/schoolPost',
                {
                schoolName: schoolItem.schoolName,
                schoolEvents: schoolItem.schoolEvents
                }.success(function(){
                     // alert('here4');
                 //when event added, do whatever. alert('school event added')
                })
              )
             }
            }
          }
         }// end of if longitude
          //if event has a location

          if (listOfAllEvents[allEventsInAnArray[i]].location){
            //if event location includes the school town, add to user events, and if not private add to school events

            if (listOfAllEvents[allEventsInAnArray[i]].location.indexOf(schoolItem.schoolTown)>-1){
               // alert('4');

              // alert(schoolItem.schoolEvents[allEventsInAnArray[i]]==undefined);

             // alert('here2');//if close to school

             if(schoolItem.schoolEvents[allEventsInAnArray[i]]==undefined||schoolItem.schoolEvents[allEventsInAnArray[i]].start_time!==listOfAllEvents[allEventsInAnArray[i]].start_time){
               // alert('here2');
               // alert('here1');
              yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];

              if(listOfAllEvents[allEventsInAnArray[i]].privacy!='SECRET'){
                 OpenFB.get("/"+listOfAllEvents[allEventsInAnArray[i]].id+"/invited",{limit:150}).success(function(res){
              if(res.data.length>5){


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
              else{
                alert('nope');
              }
            })
                 // alert('here3');
                // alert(schoolItem.schoolEvents[allEventsInAnArray[i]].name);
                // alert(schoolItem.schoolEvents[allEventsInAnArray[i]].banned);


              }
             }
            }
          }

        // alert('here2');
        if(schoolItem.schoolEvents[allEventsInAnArray[i]]==undefined){
        //start of if attending of maybe
        // alert('here3');
        if (listOfAllEvents[allEventsInAnArray[i]].attending||listOfAllEvents[allEventsInAnArray[i]].maybe){
              // alert('here');
              if(!privateEvents[allEventsInAnArray[i]]){
                // fre2');
                  // alert(privateEvents[allEventsInAnArray[i]].name);

                // if(privateEvents[allEventsInAnArray[i]].name!==listOfAllEvents[allEventsInAnArray[i]].name){
                  // alert('here3');
                    yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
                    privateEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
                    // alert(privateEvents[allEventsInAnArray[i]].name);
                    // alert('privateEve');
                    // alert('here4');
                    $http.post('http://stark-eyrie-6720.herokuapp.com/privateUserEventAdd',
                    {
                      userEmail: userItem.userEmail,
                      userName: userItem.userName,
                      privateEvents: privateEvents
                    })

              }


        }//end of if attending or maybe
       }//end of if to prevent events that are already school events and/or banned to become private
      }//end of all events in array . length
    }//end of eventpopulator


 var getFormattedTime = function (fourDigitTime) {
    var hours24 = parseInt(fourDigitTime.substring(0, 2),10);
    var hours = ((hours24 + 11) % 12) + 1;
    var amPm = hours24 > 11 ? 'pm' : 'am';
    var minutes = fourDigitTime.substring(2);

    return hours + ':' + minutes + amPm;
};


    //main event query for fb
    var fbQuery = function(){
      OpenFB.get("/me?fields=friends.fields(events.fields(description,cover,privacy,start_time,location,attending,name,maybe.user("+userProfId+"), attending.user(" +userProfId+")))",{limit: 600})
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
            // alert('here');

            // alert(singleEvent.id);
            startMonth = singleEvent.start_time.split('-')[1];
            startDay = singleEvent.start_time.split('-')[2].split('T')[0];
            // startTime = singleEvent.start_time.split('-')[2].split('T')[1];
            startYear = singleEvent.start_time.split('-')[0];

            // alert(singleEvent.start_time);
            if(singleEvent.start_time.indexOf(':')>-1){
               startTime = singleEvent.start_time.split('-')[2].split('T')[1].replace(":", "").substring(0, 4);
               singleEvent.timeOfEvent = getFormattedTime(startTime);
            }
            else{
              // startTime=null;
              singleEvent.timeOfEvent = null;
            }


            // alert(singleEvent.timeOfEvent);

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
        // alert('made it to ep');
        //make new event lists in the event populater
        eventPopulater(listOfAllEvents);
        PetService.setEvents(yourEvents);
        // alert('made it past ep');
        //allow access to feed
       $location.path('/app/person/me/feed');
      });

    }

    //gets and sets personal fb info, takes user to loading screen, and then runs user logic
    var fbInnerFlow = function(){
      // loginWindow.close();


      // $scope.hide();
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
          // userSchool = result.email.toLowerCase();
        }
        else{
          userEmail = 'none';

        }
        firstNameLetter = result.name[0].toLowerCase();
        //take to loading screen
        // userEmailchange = "ngtestnew6@gmail.com";
        //can experiment with user emails here
        //check if registered user exists within school user list, responds with DE if they dont
        //have to send user email and user school, backend should look up school user list and check if email exists there
        $http.post('http://stark-eyrie-6720.herokuapp.com/getUser',{userEmail: userEmail, userSchool:userSchool}).success(function(res){
          // alert(res.item);
          // alert(res.Item);
          userItem = res.Item;
          if(userItem.privateEvents==null){
            privateEvents = {};
          }
          else{
            privateEvents = userItem.privateEvents;
          }
          // alert(userItem);

          if(userItem.banned==="banned"){
            $scope.showAlert('Sorry, but you have been banned. Contact us at UNrepteam@gmail.com if you think is a mistake.');
            $state.go('app.login');
          }
          else{
          // alert(userItem);
          //DE is equal to doesnt exist
          if(userEmail=='none'||userEmail==undefined){
           userItem="DE";
          }
          //if user exists
          if(userItem!=="DE"){

            // alert('hi');
             // loginWindow.close();

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
              $location.path('/app/loading');
              currentUserCheck();
              fbQuery();
            }
             if(userItem.userSchool!==schoolItem.schoolName){
                $http.post('http://stark-eyrie-6720.herokuapp.com/userSchoolPost',
                {
                  userEmail: userEmail,
                  userName: userName,
                  userSchool: userSchool
                })
             }
          }
//              var grabEmail = function(description){
//           // alert('1');
//           var ret = "none";
//            // alert('2');
//           var words = description.split(' ');
//            // alert('3');
//             for(i=0;i<=words.length;i++){
//               // alert('4');
//             if(words[i].indexOf("@")>-1&&words[i].indexOf(".com")>-1&&words[i].length<=50){
//               // alert('5');
//               ret = words[i];

//               // listOfAllEvents[allEventsInAnArray[i]].description=ret;
//               // alert(ret);
//               // alert(words[i].length);
//             }
//           }
//           return ret;
//         }
// if(singleEvent.description){
//                  listOfAllEvents[singleEvent.name.replace(/\./g,"")]['description']=grabEmail(singleEvent.description);
//                }

          //registered user does not exist
          else{
            $location.path('/app/loading');
            // alert(userItem.banned);
            //run fb friend/email check
            eduSearch();
            // alert(userItem.banned);
            //make sure edu search completes, then checkAllowed. THIS CAN BE OPTIMized.
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
    }

    //this is the fb login
    var fbLoginFlow = function(){
// $scope.openComp();
      //login prompt for facebook
      OpenFB.login('user_events, email,user_about_me,friends_events,friends_education_history,friends_actions.news,friends_activities',function(res) {
                    // alert(res);
                    alert('Facebook login succeeded');

                },
                function(error) {
                    alert('Facebook login failed: ' + error.error_description);
                })
      .then(
        function () {

          //start inner fbFlow
          fbInnerFlow();
        }
      ).error(function(){//if login fails
        $scope.showAlert('Facebook connection could not be acheived, and is required.');
        $location.path('app.login');
      });
    }
    // $scope.show();

    // setTimeout(function() { $location.path('/app/loading'); },10)
    //logic run when school is tapped, logic of the main/big/overarching facebook function. everything above here is just defining functions
    var today = new Date();
    var currentDay = today.getDate();
    var currentMonth = today.getMonth()+1; //January is 0
    var currentYear = today.getFullYear();
    yourEvents = {};
    listOfAllEvents = {};
    schoolFriendCount = 0;
    currentSchoolCount = 0;
    // alert(schoolName);
    // today.setSeconds(t.getSeconds() + 10);
// alert($scope.noPop);
 if($scope.noPop=='false'){

    //get school info
    $http.post('http://stark-eyrie-6720.herokuapp.com/getSchool', {schoolName:schoolName}).success(function(res){
      // $location.path('/app/loading');
      // $scope.hide();
      // $location.path('/app/loading');
      schoolItem = res.Item;

      //check how many current events exist
      currentSchoolCheck();

      // alert(currentSchoolCount);
      //start the fb login
      fbLoginFlow();
    }).error(function(){
      // $scope.hide();
      $scope.showAlert("Connection could not be acheived at this time. Try again at the school list when service increases.")
      // setTimeout(function() { $location.path('/app/login');},2500);

    })
   }
   else{
    fbInnerFlow();
   }



  }; // end of main/big/overarching fb connect function, run when school is tapped, facebookLogin
 }) // end of login controller

  //controller for an expanded single event
 .controller('PetDetailCtrl', function($scope, $state,$ionicNavBarDelegate,$location,$stateParams,$ionicPopup, PetService) {
  //retrieves single event info
  $scope.singleEvent = PetService.getSingle();

   $scope.scrollTop = function() {
  $state.go('app.feed');
  };
  $scope.goBack = function() {
    $location.path('/app/person/me/feed');
  };

  // maps://?q={{singleEvent.location}}
$scope.link = "maps://?q="+$scope.singleEvent.location;
$scope.mapThis = function(){
  // alert($scope.link);
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

 $scope.newEvent = function() {
   // prep some variables
   var calendarName = "Nightlife Events";
   //replace these with times and then the thing below
   var startDate = new Date("July 27, 2014 13:00:00");
   var endDate = new Date("July 27, 2014 14:30:00");
   // window.plugins.calendar.listCalendars(success,error);
   // alert(new Date($scope.singleEvent.start_time+' 13:00:00'));

   var title = $scope.singleEvent.name;
   var location = $scope.singleEvent.location;
   var notes = null;
   var success = function(message) { console.log("Calendar Event Added!"); };
    var success2 = function(message) { $scope.showAlert("Event Added to Calendar!"); };
   var error = function(message) { console.log("Calendar Error: " + message); };
    // $scope.showAlert('Facebook connection could not be acheived, and is required.');

  // create a calendar (iOS only for now)
  var createCalOptions = window.plugins.calendar.getCreateCalendarOptions();
  createCalOptions.calendarName = "Nightlife Events";
  createCalOptions.calendarColor = "#000000";
  window.plugins.calendar.createCalendar(createCalOptions,success,error);
  window.plugins.calendar.createEventInNamedCalendar(title,location,notes,startDate,endDate,calendarName,success2,error);
   // window.plugins.calendar.listCalendars(success,error);
  // window.plugins.calendar.createCalendar(calendarName,success,error);
}

$scope.showEvent = false;
   $scope.expandEvent= function(theDiv) {
    $scope.showEvent = !$scope.showEvent;
 }
  //allows sharing functionaility
  $scope.shareBtn = function(a,b,c,d){
   window.plugins.socialsharing.share(a,b,c,d);
  }
 })

 //controller for event feed
 .controller('FeedCtrl', function ($scope,$state, $ionicScrollDelegate, $stateParams, OpenFB, PetService, $location, $ionicLoading) {
  //expands single event
  $scope.go_here = function (eventName) {
    PetService.setSingle(eventName);
    //changes page and controller
    $state.go("app.event-detail");
  };
  $scope.predicate=event.timeOfEvent;
$scope.alert2 = function(){
  $scope.events = PetService.getEvents();
  // alert(thing);
  // $state.reload();
setTimeout(function() { $scope.$broadcast('scroll.refreshComplete'); },2000);

}
    $scope.go_event = function () {
    // PetService.setSingle(eventName);
    //changes page and controller
    $state.go("app.newEventForm");
  };


$scope.scrollBottom = function() {
  alert('hree');
    $ionicScrollDelegate.scrollBottom();
  };

 // var newStickies = new stickyTitles(jQuery(".followMeBar"));

 //    newStickies.load();

 //    jQuery(window).on("scroll", function() {

 //        newStickies.scroll();

 //    });
// $scope.function stickyTitles(stickies) {

//     this.load = function() {

//         stickies.each(function(){

//             var thisSticky = jQuery(this).wrap('<div class="followWrap" />');
//             thisSticky.parent().height(thisSticky.outerHeight());

//             jQuery.data(thisSticky[0], 'pos', thisSticky.offset().top);

//         });
//     }

//     this.scroll = function() {

//         stickies.each(function(i){


//             var thisSticky = jQuery(this),
//                 nextSticky = stickies.eq(i+1),
//                 prevSticky = stickies.eq(i-1),
//                 pos = jQuery.data(thisSticky[0], 'pos');

//             if (pos <= jQuery(window).scrollTop()) {

//                 thisSticky.addClass("fixed");

//                 if (nextSticky.length > 0 && thisSticky.offset().top >= jQuery.data(nextSticky[0], 'pos') - thisSticky.outerHeight()) {

//                     thisSticky.addClass("absolute").css("top", jQuery.data(nextSticky[0], 'pos') - thisSticky.outerHeight());

//                 }

//             } else {

//                 thisSticky.removeClass("fixed");

//                 if (prevSticky.length > 0 && jQuery(window).scrollTop() <= jQuery.data(thisSticky[0], 'pos')  - prevSticky.outerHeight()) {

//                     prevSticky.removeClass("absolute").removeAttr("style");

//                 }

//             }
//         });
//     }
// }

// jQuery(document).ready(function(){

//     var newStickies = new stickyTitles(jQuery(".followMeBar"));

//     newStickies.load();

//     jQuery(window).on("scroll", function() {

//         newStickies.scroll();

//     });
// });


  $scope.goForm = function(){
  // alert($scope.link);

  window.location.href = "#eForm"
}
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
