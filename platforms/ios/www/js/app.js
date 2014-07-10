angular.module('sociogram', ['ionic', 'openfb', 'sociogram.controllers','sociogram.services'])

    .run(function ($rootScope, $state, $ionicPlatform, $window, OpenFB) {

        OpenFB.init('1474435556106076');


        // $ionicPlatform.ready(function () {
        //     if (window.StatusBar) {
        //         StatusBar.styleDefault();
        //     }
        // });

        $rootScope.$on('$stateChangeStart', function(event, toState) {

            if (toState.name !== "app.login" && toState.name !== "app.logout" && !$window.sessionStorage['fbtoken']) {
                $state.go('app.login');
                event.preventDefault();
// // Register for any urban airship events
// document.addEventListener("urbanairship.registration", function (event) {
//     if (event.error) {
//         alert('there was an error registering for push notifications');
//     } else {
//         alert("Registered with ID: " + event.pushID);
//     }
// }, false)

// document.addEventListener("urbanairship.push", function (event) {
//     alert("Incoming push: " + event.message)
// }, false)

// // Set tags on a device, that you can push to
// // https://docs.urbanairship.com/display/DOCS/Server%3A+Tag+API
// PushNotification.setTags(["loves_cats", "shops_for_games"], function () {
//     PushNotification.getTags(function (obj) {
//         obj.tags.forEach(function (tag) {
//             alert("Tag: " + tag);
//         });
//     });
// });

// // Set an alias, this lets you tie a device to a user in your system
// // https://docs.urbanairship.com/display/DOCS/Server%3A+iOS+Push+API#ServeriOSPushAPI-Alias
// PushNotification.setAlias("awesomeuser22", function () {
//     PushNotification.getAlias(function (alias) {
//         alert("The user formerly known as " + alias)
//     });
// });

// // Check if push is enabled
// PushNotification.isPushEnabled(function (enabled) {
//     if (enabled) {
//         alert("Push is enabled! Fire away!");
//     }
// })

            }
        });

        $rootScope.$on('OAuthException', function() {
            $state.go('app.login');
        });

    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider



            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: "AppCtrl"
            })

            .state('app.login', {
                        url: "/login",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/login.html",
                                controller: "LoginCtrl"
                            }
                        }
                 })

             .state('app.event-detail', {
				      url: "/event-detail",
				      views: {
				        'menuContent': {
				          templateUrl: 'templates/event-detail.html',
				          controller: "PetDetailCtrl"
				        }
				      }
  				  })

            .state('app.logout', {
                url: "/logout",
                views: {
                    'menuContent': {
                        templateUrl: "templates/logout.html",
                        controller: "LogoutCtrl"
                    }
                }
            })

            .state('app.profile', {
                url: "/profile",
                views: {
                    'menuContent': {
                        templateUrl: "templates/profile.html",
                        controller: "ProfileCtrl"
                    }
                }
            })

            // .state('app.share', {
            //     url: "/share",
            //     views: {
            //         'menuContent': {
            //             templateUrl: "templates/share.html",
            //             controller: "ShareCtrl"
            //         }
            //     }
            // })

            // .state('app.friends', {
            //     url: "/person/:personId/friends",
            //     views: {
            //         'menuContent': {
            //             templateUrl: "templates/friend-list.html",
            //             controller: "FriendsCtrl"
            //         }
            //     }
            // })
            .state('app.about', {
				      url: '/about',
				      views: {
				        'menuContent': {
				          templateUrl: 'templates/about.html',
				          controller: 'FeedCtrl'
				        }
				      }
				    })
				    .state('app.login2', {
				      url: '/login2',
				      views: {
				        'menuContent': {
				          templateUrl: 'templates/login2.html',
				          controller: 'LoginCtrl'
				        }
				      }
				    })
				     .state('app.loading', {
				      url: '/loading',
				      views: {
				        'menuContent': {
				          templateUrl: 'templates/loading.html',
				          controller: 'LoginCtrl'
				        }
				      }
				    })
				    .state('app.help', {
				      url: '/help',
				      views: {
				        'menuContent': {
				          templateUrl: 'templates/help.html',
				          controller: 'FeedCtrl'
				        }
				      }
				    })
				    	.state('app.addAnEvent', {
				      url: '/addAnEvent',
				      views: {
				        'menuContent': {
				          templateUrl: 'templates/addAnEvent.html',
				          controller: 'FeedCtrl'
				        }
				      }
				    })

            .state('app.person', {
                url: "/person/:personId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/person.html",
                        controller: "PersonCtrl"
                    }
                }
            })
            .state('app.feed', {
                url: "/person/:personId/feed",
                views: {
                    'menuContent': {
                        templateUrl: "templates/feed.html",
                        controller: "FeedCtrl"
                    }
                }
            });

        // fallback route
        $urlRouterProvider.otherwise('/app/person/me/feed');

    });

