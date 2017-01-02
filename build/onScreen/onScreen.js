/* global angular, _, $ */
/* jshint strict: true */

(function(){
  'use strict';

  angular
    .module('witch')
    .directive('lightColor', colorSetter)
    .directive('brightnessPos', briPos)
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
    console.log('localData.target.action.bri', localData.target.action.bri);

    var bri = vm.brightness = (localData.target.action.bri === 0) ? 45.0 : localData.target.action.bri;

    console.log('vm.brightness', vm.brightness);

    $scope.$watch('vm.brightness', _.throttle(briChangeWatch,500));

    briChangeWatch(bri,null);

    function briChangeWatch(newBri, oldBri){
      if ( newBri !== oldBri ) {
        console.log('newBri',newBri);
        //_.throttle(function(newBri){
          var bri = colors.NormalizeBri( newBri, true );
          localData.target.action.bri = bri;

          if ( bri === 0 ) {
            $state.go('off');
          }

          if ( localData.target.style !== 'light' ) { // style group is default
            hue.setGroupState(localData.target.id, { "bri": bri });
          }
          else {
            hue.setLightState(localData.target.id, { "bri": bri });
          }
        //}, 100);
      }
    }
    //console.log(colors.XYtoRGB(x,y,bri)); // x, y, Brightness


    vm.switchLightOff = function(){
      $state.go('off');
    };
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

  briPos.$inject = [
    'local'
  ];

  function briPos(
    local
  ){
    
  }

})();
