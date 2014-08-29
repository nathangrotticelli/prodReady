angular.module('sociogram', ['ionic', 'openfb','objectFilters','sociogram.controllers','sociogram.services'])

    .run(function ($rootScope, $state, $ionicPlatform, $window, OpenFB) {

        OpenFB.init('1474435556106076');



        // $ionicPlatform.ready(function () {
        //     if (window.StatusBar) {
        //         StatusBar.styleDefault();
        //     }
// && toState.name !== "app.logout"
        // });

        $rootScope.$on('$stateChangeStart', function(event, toState) {

            if (toState.name !== "app.login" && toState.name !== "app.loading" && !$window.sessionStorage['fbtoken']) {
                $state.go('app.login');

                event.preventDefault();
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
                     .state('app.privacy', {
                      url: '/privacy',
                      views: {
                        'menuContent': {
                          templateUrl: 'templates/privacy.html',
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
                        .state('app.newEventForm', {
                      url: '/newEventForm',
                      views: {
                        'menuContent': {
                          templateUrl: 'templates/newEventForm.html',
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
        $urlRouterProvider.otherwise('/app/login');

    });

