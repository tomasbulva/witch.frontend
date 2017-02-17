/* global angular, _, $ */
/* jshint strict: true */

(function(){
  'use strict';

  angular
    .module('witch')
    .controller('settingsScreen', settingsScreen);

  settingsScreen.$inject = [
    '$state',
    '$scope',
    'local',
    'DEVICE',
    'TEST_URL',
    'ENV',
    'hue',
    '$http',
    'socket',
    '$interval'
  ];

  function settingsScreen(
    $state,
    $scope,
    local,
    DEVICE,
    TEST_URL,
    ENV,
    hue,
    $http,
    socket,
    $interval
  ) {
    console.log('HERE SETTINGS',$state.current.name);

    var vm = this;

    switch($state.current.name){
      // case 'settings':
      //   $state.go('settings.selectAP');
      // break;

      case 'settings.selectAP':
        selctAP();
      break;

      case 'settings.setWifiPassword':
        setWifiPassword();
      break;

      case 'settings.connectToHueHub':
        connectToHueHub();
      break;

      case 'settings.selectLightGroup':
        selectLightGroup();
      break;

    }

    console.log('settingsScreen');

    function selctAP(){

      $http.get(TEST_URL)
        .then(function(result){

          console.log('result', result);

          if ( result.status === 200 ) {
            // we have an internet
            // no need to setup wifi
            $state.go('settings.connectToHueHub');
          }
          else {

            if ( ! vm.aps ) {

              console.log('get aps');

              socket.emit('aps', {});
              socket.on('aps', function(data){

                vm.aps = data;

                console.log('get aps',vm.aps);
              });
            }


          }
        });

      vm.selectWifi = function(ap){
        $state.go('settings.setWifiPassword');
      };

    }

    function setWifiPassword(){

      vm.submitPass = function(){

        $state.go('settings.setWifiPassword');
      };

      vm.hideShowPassword = function(){

        if ( vm.seePass === 'password' ) {
          console.log('text');
          vm.seePass = 'text';
        }
        else {
          console.log('password');
          vm.seePass = 'password';
        }
      };

      vm.submitPass = function(){
        $state.go('settings.connectToHueHub');
      };
    }

    function connectToHueHub(){

      var int = null;

      hue.setup({username: "newUser", bridgeIP: "", debug: ENV === 'dev' });

      int = $interval(
        function(){
          hue.createUser(DEVICE)
            .then(function(result){

              console.log(result[0].success);

              if ( result[0].success ) {
                $interval.cancel(int);

                local.init();

                var localData = local.getAllData();
                localData.username = result[0].success.username;

                $state.go('settings.selectLightGroup');
              }
            })
            .catch(function(error){
              console.error('catch',error);
            });
        },
        500,
        60
      );



      // hue.getGroups().then(function(_groups){
      //   var groups = _groups;
      //
      //   console.log('groups',groups);
      //
      //   deferred.resolve(groups);
      // });
    }

    function selectLightGroup(){

      vm.getData = getData;
      vm.groups = null;
      vm.lights = null;
      vm.useGroups = 'true';

      var localData = local.getAllData();

      hue.setup({username: localData.username, debug: ENV === 'dev' });

      getData();

      $scope.$watch('vm.useGroups',function(newData, oldData){
        if ( newData !== oldData ) {
          console.log('$watch lights',newData);
          getData();
        }
      });

      vm.pickGroup = function(id, group){
        var isOn = group.state.all_on;
        localData.target = group;
        localData.target.id = id;
        localData.target.style = 'group';

        if ( isOn ) {
          $state.go('on');
        }
        else {
          $state.go('off');
        }
      };

      vm.pickLight = function(id, group){
        var isOn = group.state.on;
        localData.target = group;
        localData.target.id = id;
        localData.target.style = 'light';

        if ( isOn ) {
          $state.go('on');
        }
        else {
          $state.go('off');
        }
      };

      function getData(){

        if ( vm.useGroups === 'true' ) {
          console.log('getting groups');
          hue.getGroups().then(function(_groups){

            vm.groups = _groups;

            if ( ENV === 'dev' ) {
              console.log('groups', vm.groups);
            }

          });
        }
        else {
          console.log('getting lights');
          hue.getLights().then(function(_lights){

            vm.lights = _lights;

            if ( ENV === 'dev' ) {
              console.log('lights', vm.lights);
            }

          });
        }
      };

    }

    function makeid(len) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < len; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }


  }

})();
