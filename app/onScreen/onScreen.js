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
    var localData = local.getAllData();

    if ( localData.target.style !== 'light' ) { // style group is default
      hue.setGroupState(localData.target.id, { "on": true });
    }
    else {
      hue.setLightState(localData.target.id, { "on": true });
    }

    var x = localData.target.action.xy[0];
    var y = localData.target.action.xy[1];
    var bri = vm.brightness = localData.target.action.bri;

    $scope.$watch('vm.brightness',function(newBri, oldBri){
      if ( newBri !== oldBri ) {
        var bri = normalizeBri(newBri);
        if ( localData.target.style !== 'light' ) { // style group is default
          hue.setGroupState(localData.target.id, { "bri": bri });
        }
        else {
          hue.setLightState(localData.target.id, { "bri": bri });
        }
      }
    })

    //console.log(colors.XYtoRGB(x,y,bri)); // x, y, Brightness


    vm.switchLightOff = function(){
      $state.go('off');
    };

    function normalizeBri(_bri){
      var flipBri = 100 - _bri;
      var maxBri = 254;
      var maxBriPrc = maxBri / 100;

      return Math.round( flipBri * maxBriPrc );
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

        var col = colors.XYtoRGB(x,y,bri);
        var RGBColors = colors.TwoFiftyFifeRange( col );
        var HEXColors = colors.RgbToHex( RGBColors );

        //console.log( 'colors', col, RGBColors, HEXColors ); // x, y, Brightness

        var css = "background-color: " + HEXColors;
        attrs.$set('style', css);

      }

    }
  }

})();
