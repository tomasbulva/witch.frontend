/* global angular, _, $ */
/* jshint strict: true */

(function(){
  'use strict';

  angular
    .module('witch')
    .constant('ENV','dev') // prod, dev
    .constant('DEVICE','witch#1234567890')
    .constant('TEST_URL','www.google.com'); //will be device serial number

})();
