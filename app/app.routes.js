/* global Firebase, _, $ */
/* jshint strict: true */
/* jshint -W014 */

(function() {

  'use strict';

  angular
    .module( 'witch' )
    .config( preRouting )
    .config( routing );


  routing.$inject = [
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    '$urlMatcherFactoryProvider'
  ];

  function routing (
    $stateProvider,
    $urlRouterProvider,
    $locationProvider,
    $urlMatcherFactoryProvider
  ) {

    console.log('routing');

    $stateProvider
      .whenLightsReady( 'off', {
        url: '/off',
        views: {
          'superview': {
            templateUrl: 'app/offScreen/offScreenMainView.html',
            controller: 'offScreen as vm'
          }
        }
      })

      .whenLightsReady( 'on', {
        url: '/on',
        views: {
          'superview': {
            templateUrl: 'app/onScreen/onScreenMainView.html',
            controller: 'onScreen as vm'
          }
        }
      })

      .state( 'settings', {
        url: '/settings',
        redirectTo: 'settings.selectAP',
        views: {
          'superview': {
            templateUrl: 'app/settingsScreen/settingsScreenMainView.html',
            controller: 'settingsScreen as vm'
          }
        }
      })

      .state( 'settings.selectAP', {
        url: '/selectap',
        views: {
          'setupScreen': {
            templateUrl: 'app/settingsScreen/SettingsScreenStep1.html',
            controller: 'settingsScreen as vm'
          }
        }
      })

      .state( 'settings.setWifiPassword', {
        url: '/setWifiPassword',
        views: {
          'setupScreen': {
            templateUrl: 'app/settingsScreen/settingsScreenStep2.html',
            controller: 'settingsScreen as vm'
          }
        }
      })

      .state( 'settings.connectToHueHub', {
        url: '/connectToHueHub',
        views: {
          'setupScreen': {
            templateUrl: 'app/settingsScreen/settingsScreenStep3.html',
            controller: 'settingsScreen as vm'
          }
        }
      })

      .state( 'settings.selectLightGroup', {
        url: '/selectLightGroup',
        views: {
          'setupScreen': {
            templateUrl: 'app/settingsScreen/settingsScreenStep4.html',
            controller: 'settingsScreen as vm'
          }
        }
      });

    $urlRouterProvider.otherwise('/off');

    //$urlMatcherFactoryProvider.strictMode(false);

    if (
      window.history
      && window.history.pushState
    ) {

      $locationProvider.html5Mode(true);
      //.hashPrefix('!');

    }
  }

  preRouting.$inject = [
    '$qProvider',
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider'
  ];

  function preRouting(
    $qProvider,
    $stateProvider,
    $urlRouterProvider,
    $locationProvider
  ){
    //$qProvider.errorOnUnhandledRejections(false);

    $stateProvider.whenLightsReady = whenLightsReady;

    return;

    function whenLightsReady(state, route) {

      route.resolve = route.resolve || {};
      route.resolve.light = lightsReady;

      console.log('whenLightsReady',state,route);

      $stateProvider.state(state, route);
      return $stateProvider;
    }
  }

  lightsReady.$inject = [
    '$rootScope',
    '$state',
    'local',
    'ENV',
    '$q',
    '$timeout',
    'hue'
  ];

  function lightsReady(
    $rootScope,
    $state,
    local,
    ENV,
    $q,
    $timeout,
    hue
  ) {

    var deferred = $q.defer();

    var localData = local.getAllData();

    console.log('localData', localData);
    console.log('$rootScope', $rootScope);
    console.log('$state', $state);

    if (
      localData
      && localData.username
      && localData.target
    ) {

      hue.setup({username: localData.username, bridgeIP: "", debug: ENV === 'dev' });

      hue.getGroups().then(function(_groups){
        var groups = _groups;

        console.log('groups',groups);

        deferred.resolve(groups);
      });
    }
    else {
      console.log('going to settings');
      //deferred.reject('redirecting');
      //$timeout(function(){
        $state.go('settings');
      //});
      //return deferred.reject('redirecting');
      //$state.go('settings.selectAP', {}, {location: 'replace'});
    }
    // else if (
    //   $rootScope.routingTo.name === 'settings'
    //   || $rootScope.routingTo.name === 'settings.selectAP'
    //   || $rootScope.routingTo.name === 'settings.setWifiPassword'
    //   || $rootScope.routingTo.name === 'settings.connectToHueHub'
    //   || $rootScope.routingTo.name === 'settings.selectLightGroup'
    // ) {
    //   console.log('landing on settings page... resolve');
    //   deferred.resolve();
    // }

    return deferred.promise;
  }

})();
