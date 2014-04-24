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
	analytics.trackView('Login Screen');

    	// window.plugins.flurry.logEvent('Login');

//     	var introPopup = function(){
// 	$ionicPopup.alert({
// 							// alert('Hi '+userName);
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

	//age function
	function getAge(dateString) {
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
				 	 			// 	alert('start day:'+startDay+'is bigger then '+currentDay);
				 	 			// 		alert('start year:'+startYear+'is bigger then '+currentYear);
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
					}
					if (listOfAllEvents[allEventsInAnArray[i]].longitude){
						longValue = listOfAllEvents[allEventsInAnArray[i]].longitude.split(' ')[1];
						latValue = listOfAllEvents[allEventsInAnArray[i]].latitude.split(' ')[1];
						//defining long and lat values

						if (longValue<=schoolItem.schoolLongMax&&longValue>=schoolItem.schoolLongMin&&latValue<=schoolItem.schoolLatMax&&latValue>=schoolItem.schoolLatMin){//if close to school

							yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
							if(listOfAllEvents[allEventsInAnArray[i]].privacy!='SECRET'){
								schoolItem.schoolEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
							}
						}
						if (listOfAllEvents[allEventsInAnArray[i]].location){
							if (listOfAllEvents[allEventsInAnArray[i]].location.indexOf(schoolItem.schoolTown)>-1){//if close to school
								yourEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
								if(listOfAllEvents[allEventsInAnArray[i]].privacy!='SECRET'){
									schoolItem.schoolEvents[allEventsInAnArray[i]] = listOfAllEvents[allEventsInAnArray[i]];
								 }
							}
						}
					}
				}

		}//end of eventpopulator



        	var today = new Date();
					var currentDay = today.getDate();
					var currentMonth = today.getMonth()+1; //January is 0
					var currentYear = today.getFullYear();
					yourEvents = {};
					listOfAllEvents = {};
					denied='no';
					// introPopup();

					// PetService.setSchool(schoolName);
					// alert(schoolName);
					$http.post('http://stark-eyrie-6720.herokuapp.com/getSchool',{schoolName:schoolName}).success(function(res){

						// alert(res.Item.schoolLongMax);
						schoolItem = res.Item;

					});

					//http get to the server to get the school back and then set schoolItem as that

					// var schoolItem =
      //   	var schoolItem = {
				  // schoolLongMax: '-75.4',
				  // schoolLongMin: '-76.1',
				  // schoolLatMax: '42.4',
				  // schoolLatMin: '41.7',
				  // schoolFriendMin: 30,
				  // schoolName: 'Binghamton',
				  // schoolTown: 'Binghamton',
				  // emailEnding: '@binghamton.edu',
				  // emailLength: 18,
				  // schoolEvents: {} };

            OpenFB.login('user_events, email,user_about_me,friends_events,friends_education_history,friends_actions.news,friends_activities').then(

                function () {
                	// alert('schoolitem = '+schoolItem);
                	// alert($stateParams.personId);
                	OpenFB.get('/me', {limit: 30})
			            .success(function (result) {
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
									schoolFriendCount = 0;
									firstNameLetter = result.name[0].toLowerCase();
									$scope.showAlert('Welcome to the U Nightlife app. We use your social graph to make sure your a student, customize your event display to include your private events, and share all the public events you know about with the rest of your school. This process may take a few seconds (15+ possibly) but it\'s worth it. You should know all the options for your nightlife.');
									$location.path('/app/loading');
									analytics.trackView('Loading');

			            // alert('Hi '+userName);

			            OpenFB.get("/me?fields=friends.fields(events.fields(description,cover,privacy,start_time,location,name,venue,maybe.user("+userProfId+"), attending.user(" +userProfId+")))",{limit: 390}).success(function (result2){
			            	// alert('made it past first query');
			            	//want to look up if user exists here and then run edu check
			            	OpenFB.get("/me?fields=friends.fields(education)",{limit:390}).success(function(eduResult){
			            		friendChecker(eduResult)}).success(function(){
			            			// schoolFriendCount=10;
			            		if(schoolFriendCount<schoolItem.schoolFriendMin&&userEmail.indexOf(schoolItem.emailEnding)<0){
			            			// alert('got to school deny: '+schoolFriendCount);
			            			denied = 'yes';
			            			// $location.path('/app/login2');
			            		}
			            	}).success(function(){
			            	// alert('made it past edu check');
			            	//proceed to put all events into an object with event names being the keys
									 var friends = result2.friends.data.filter(function(friend){
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
						 	 			// 	alert('startDay equal to: '+startDay);
						 	 			// 	alert('startyear equal to: '+startYear);

						 	 		if (startMonth>=currentMonth&&startDay>=currentDay&&startYear>=currentYear){
						 	 			singleEvent.start_time=startMonth+"/"+startDay+"/"+startYear;
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
						}).success(function(){
							// alert('made it to ep');
	eventPopulater(listOfAllEvents);
						}).success(function(){


 // alert(response);
    // $scope.loading = false;
    if(denied==='yes'){
	// alert('made it past ep');
    	// OpenFB.logout();
    	$location.path('/app/login2');
    	analytics.trackView('Login2 Screen');
    }
    else{
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
    			// alert(yourEvents);
					  PetService.setEvents(yourEvents);
					  $location.path('/app/person/me/feed');




    	// events = PetService.getEvents();
    	// alert('events: '+events);

    }


					  });//sucess;

	// setTimeout(function() { $location.path('/app/person/me/feed'); },2400);

			            	// alert(result2);
			            }).error(function(data) {
			                $scope.showAlert("Oops! There was an error! Contact us at UNRepTeam@gmail.com if this keeps happening. "+data.error.message);
			            });
			            })
			            .error(function(data) {
			                $scope.showAlert("Oops! There was an error! Contact us at UNRepTeam@gmail.com if this keeps happening. "+data.error.message);
			            });
                  // $location.path('/app/person/me/feed');
                },
                function () {
                    $scope.showAlert("Oops! Login Failed! (Facebook connection is required.) Contact us at UNRepTeam@gmail.com if this keeps happening and it shouldn't be.");
                });
        };

    })

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
		  analytics.trackView('Ind. Event: '+$scope.singleEvent.name);


		  // window.plugins.flurry.logEvent('Event Detail'+$scope.singleEvent);

			$scope.shareBtn = function(a,b,c,d){
				window.plugins.socialsharing.share(a,b,c,d);
				}


		})

    .controller('FeedCtrl', function ($scope,$state, $stateParams, OpenFB, PetService, $location, $ionicLoading) {
    	 analytics.trackView('Event Feed');
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
        $scope.fbreq = function(){
        	// alert('hi');

        };

        function loadFeed() {
        	// $scope.show();
        	$scope.events = PetService.getEvents();
						//
        		// $http({method: 'GET', url: 'http://stark-eyrie-6720.herokuapp.com/userGet'}).success(function(result){
        		// 	// $scope.hide();
        		// 	alert('got events from server');
        		// 	$scope.events = result;
        		// })
            // $scope.show();
            // OpenFb.get('/'+$stateParams.personId+'/?fields=events').success(function(res){
            // 	alert(res.data);
            // 	$scope.events=result.data;
            // 	// $scope.$broadcast('scroll.refreshComplete');
            // }).error(function(e){
            // 	$scope.hide();
            // 	alert(e.error.message);
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
        // 	alert('hi');
        // };

        loadFeed();

    });