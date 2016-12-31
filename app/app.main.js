/* global Firebase, _, $ */
/* jshint strict: true */
/* jshint -W014 */

(function() {

  'use strict';

  angular
    .module( 'witch' )
    .run( runSettings )
    .factory( 'globalApp', globalApp )
    .factory( 'local', localStorageHandler )
    .factory( 'socket', socket )
    .directive('bd', bodyDecorator);

    localStorageHandler.$inject = ['$localStorage', 'DEVICE'];
    function localStorageHandler(
      $localStorage,
      DEVICE
    ){
      console.log('localStorageHandler');
      var service = {
        getAllData: getAllData,
        init: init
      };

      return service;

      /// service methods
      function getAllData(){
        return $localStorage[DEVICE];
      }

      function init(){
        if ( ! $localStorage[DEVICE] ) {
          $localStorage[DEVICE] = {};
        }
      }

    }

    globalApp.$inject = [];
    function globalApp(

    ){
      console.log('globalApp');
      var service = {
        state: null,
        window: {
          width: null,
          height: null
        }
      };

      return service;

    }

    socket.$inject = [ '$rootScope', 'socketFactory' ];
    function socket( $rootScope, socketFactory ) {
      return socketFactory({
        ioSocket: io.connect('0.0.0.0:9999')
      });
    }

    runSettings.$inject = [ '$rootScope', '$state', '$uiRouter', '$trace' ];
    function runSettings( $rootScope, $state, $uiRouter, $trace ) {

      // var vis = window['ui-router-visualizer'];
      // vis.visualizer($uiRouter);

      //$trace.enable('TRANSITION');

    }

    bodyDecorator.$inject = [
      '$rootScope',
      '$state',
      'globalApp',
      '$transitions',
      '$window'
    ];

    function bodyDecorator(
      $rootScope,
      $state,
      globalApp,
      $transitions,
      $window
    ) {

      var directive = {
        link: linkFunc,
        restrict: 'A'
      };

      return directive;

      /// service methods
      function linkFunc(scope,el,attrs){

        $transitions.onStart( {}, function($transition$) {
          el.addClass('loading');
        });

        $transitions.onSuccess( {}, function($transition$) {
          el.removeClass('loading');

          var newState = $transition$.$to();
          el.attr('bd', newState || 'unknown');
          globalApp.state = newState;

        });

        var w = angular.element($window);

        var sizeGuard = function(){

          var width = w.width();
          var height = w.height();

          globalApp.window.width = width;
          globalApp.window.height = height;

          var css = "width: " + width + "px ; height: " + height + "px";
          attrs.$set('style', css);
        };

        w.bind('resize', sizeGuard);
        sizeGuard();


      }

    }

})();
