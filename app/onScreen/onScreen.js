/* global angular, _, $ */
/* jshint strict: true */

(function(){
  'use strict';

  angular
    .module('witch')
    .directive('lightColor', colorSetter)
    .controller('onScreen', onScreen);

  onScreen.$inject = [
    '$scope',
    '$state',
    'local',
    'hue',
    'colors'
  ];

  function onScreen(
    $scope,
    $state,
    local,
    hue,
    colors
  ) {
    //console.log('HERE ON');

    var vm = this;

    vm.localData = local.getAllData();

    if (
      ! vm.localData.target
      || ! vm.localData.target.state
      || ! vm.localData.target.state.bri
    ){
      vm.brightness = vm.localData.target.state.bri = 45.0;
    }
    else if (
      vm.localData.target.state.bri <= 0
      || vm.localData.target.state.bri > 254
    ) {
      vm.brightness = 45.0;
    }
    else {
      vm.brightness = vm.localData.target.state.bri
    }

    vm.topPos = 0;
    vm.switchLightOff = switchLightOff;

    activate();

    briChangeWatch( vm.brightness, null );

    function activate() {
      //var localData = local.getAllData();
      //var x = localData.target.action.xy[0];
      //var y = localData.target.action.xy[1];

      if ( vm.brightness !== vm.localData.target.state.bri ) {
        vm.localData.target.state.bri = vm.brightness;
      }

      console.log('vm.brightness',vm.brightness);

      vm.topPos = colors.BriToScreenPos( vm.brightness, vm.localData.window.height );

      console.log('vm.topPos',vm.topPos);

      if ( vm.localData.target.style !== 'light' ) { // style group is default
        hue.setGroupState(vm.localData.target.id, { "on": true });
      }
      else {
        hue.setLightState(vm.localData.target.id, { "on": true });
      }

      $scope.$watch('vm.brightness', _.throttle(briChangeWatch,500));
    }

    function briChangeWatch(newBri, oldBri){
      if ( newBri !== oldBri ) {
        console.log('newBri',newBri);

        var bri = colors.NormalizeBri( newBri, true );

        vm.localData.target.state.bri = bri;

        console.log( 'briChangeWatch', local.getAllData().target.state.bri );

        if ( bri === 0 ) {
          $state.go('off');
        }

        if ( vm.localData.target.style !== 'light' ) { // style group is default
          hue.setGroupState(vm.localData.target.id, { "bri": bri });
        }
        else {
          hue.setLightState(vm.localData.target.id, { "bri": bri });
        }
      }
    }

    function switchLightOff(){
      console.log('switch off');
      $state.go('off');
    }
  }

  colorSetter.$inject = [
    'local',
    'colors'
  ];

  function colorSetter(
    local,
    colors
  ){
    var directive = {
      link: linkFunc,
      restrict: 'A'
    };

    return directive;

    function linkFunc(scope, el, attrs){

      var localData = local.getAllData();

      scope.$watch( function(){
        return localData.target.action.xy[0];
      }, changeColors);

      scope.$watch( function(){
        return localData.target.action.xy[1];
      }, changeColors);

      scope.$watch( function(){
        return localData.target.action.bri;
      }, changeColors);

      function changeColors() {

        var x = localData.target.action.xy[0];
        var y = localData.target.action.xy[1];
        var bri = localData.target.action.bri;

        var col = colors.XYtoRGB(x,y,colors.HexToZeroToOne(bri));

        console.log('changeColors x,y,bri',x,y,colors.HexToZeroToOne(bri));

        var RGBColors = colors.TwoFiftyFifeRange( col );
        var HEXColors = colors.RgbToHex( RGBColors );

        //console.log( 'colors', col, RGBColors, HEXColors ); // x, y, Brightness

        console.log('changeColors HEXColors',col);

        var css = "background-color: " + HEXColors;
        attrs.$set('style', css);

      }

    }
  }

})();
