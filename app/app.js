/* global angular, _, $ */
/* jshint strict: true */

(function(){
'use strict';

  require("nw.gui").Window.get().showDevTools();

  var modules = [
    'ngAnimate',
    'ui.router',
    'hue',
    'ngStorage',
    'btford.socket-io',
    'timer',
    'angular-draggable'
  ];

  angular.module('witch', modules);

})();
