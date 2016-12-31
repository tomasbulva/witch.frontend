/* global angular, _, $ */
/* jshint strict: true */

(function(){
  'use strict';

  angular
    .module('witch')
    .controller('offScreen', offScreen);

  offScreen.$inject = [
    '$scope',
    '$state',
    'local',
    'hue'
  ];

  function offScreen(
    $scope,
    $state,
    local,
    hue
  ) {
    console.log('HERE OFF');

    var vm = this;
    var localData = local.getAllData();

    if ( localData.target.type === 'group' ) {
      hue.setGroupState(localData.target.id, { "on": false });
    }
    else {
      hue.setLightState(localData.target.id, { "on": false });
    }


    vm.switchLightOn = function(){
      $state.go('on');
    }
  }

})();
