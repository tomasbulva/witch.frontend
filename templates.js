angular.module('witch').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/offScreen/offScreenMainView.html',
    "<lightStateBackground>\n" +
    "<screenButton\n" +
    "  ng-click=\"vm.switchLightOn()\"\n" +
    ">\n" +
    "\n" +
    "  <svg class=\"icons logo\">\n" +
    "    <use xlink:href=\"#logo\"/>\n" +
    "  </svg>\n" +
    "\n" +
    "</screenButton>\n" +
    "</lightStateBackground>\n"
  );


  $templateCache.put('app/onScreen/onScreenMainView.html',
    "<lightStateBackground\n" +
    "  light-color\n" +
    ">\n" +
    "\n" +
    "  <brightnessToggle\n" +
    "    ng-draggable\n" +
    "    top=\"vm.topPos\"\n" +
    "    data-bla=\"{{vm.topPos}}\"\n" +
    "    lockx=\"true\"\n" +
    "    slider-control-x=\"vm.brightness\"\n" +
    "    lock-to-screen-size=\"true\"\n" +
    "    on-double-click=\"vm.switchLightOff()\"\n" +
    "  >\n" +
    "    <handle></handle>\n" +
    "  </brightnessToggle>\n" +
    "\n" +
    "  <drawer>\n" +
    "   A\n" +
    "  </drawer>\n" +
    "\n" +
    "</lightStateBackground>\n"
  );


  $templateCache.put('app/settingsScreen/SettingsScreenStep1.html',
    "<section id=\"wifi-setup-step-1\">\n" +
    "  <ul>\n" +
    "    <li ng-repeat=\"ap in vm.aps\" ng-click=\"vm.selectWifi(ap)\">{{ ap.apName }}</li>\n" +
    "  </ul>\n" +
    "</section>\n"
  );


  $templateCache.put('app/settingsScreen/settingsScreenMainView.html',
    "<header>\n" +
    "</header>\n" +
    "\n" +
    "<main ui-view=\"setupScreen\">\n" +
    "</main>\n" +
    "\n" +
    "<footer>\n" +
    "</footer>\n"
  );


  $templateCache.put('app/settingsScreen/settingsScreenStep2.html',
    "<section id=\"wifi-setup-step-2\" class=\"\">\n" +
    "\n" +
    "  <form name=\"wifiPasswordForm\">\n" +
    "\n" +
    "    <input name=\" password \"\n" +
    "      ng-class=\"\"\n" +
    "      type=\"{{ vm.seePass }}\"\n" +
    "      ng-model=\" vm.wifi.password \"\n" +
    "      ng-blur=\" vm.submitPass() \"\n" +
    "      ng-enter-key=\" vm.submitPass() \"\n" +
    "      required=\" true \"\n" +
    "      autocomplete=\" off \"\n" +
    "    >\n" +
    "    <input\n" +
    "      type=\"checkbox\"\n" +
    "      id=\"checkbox\"\n" +
    "      ng-click=\"vm.hideShowPassword()\"\n" +
    "    >\n" +
    "\n" +
    "    <button name=\" signInAp \"\n" +
    "      ng-click=\" vm.submitPass() \"\n" +
    "    >\n" +
    "    submit\n" +
    "    </button>\n" +
    "\n" +
    "  </form>\n" +
    "</section>\n"
  );


  $templateCache.put('app/settingsScreen/settingsScreenStep3.html',
    "<section id=\"group-setup\">\n" +
    "  <p>please push the hub button to connect with the witch.</p>\n" +
    "  <timer countdown=\"30\" interval=\"1000\"><div class=\"progress active {{displayProgressActive}}\"style=\"height: 3px;\"><div class=\"bar\" style=\"min-width: 2em;width: {{progressBar}}%;\"></div> </div></timer>\n" +
    "</section>\n"
  );


  $templateCache.put('app/settingsScreen/settingsScreenStep4.html',
    "<section id=\"lights-setup-step-4\">\n" +
    "  <section id=\"switch-style\">\n" +
    "    <label for=\"useGroups\">\n" +
    "      <input id=\"useGroups\" type='radio' name=\"useGroups\" ng-model=\"vm.useGroups\" value=\"true\">\n" +
    "      Use groups.\n" +
    "    </label>\n" +
    "    <label for=\"useLight\">\n" +
    "      <input id=\"useLights\" type='radio' name=\"useGroups\" ng-model=\"vm.useGroups\" value=\"false\">\n" +
    "      Use individual lights.\n" +
    "    </label>\n" +
    "  </section>\n" +
    "\n" +
    "  <section id=\"group-setup\"\n" +
    "    ng-class=\"{\n" +
    "      'active': vm.useGroups === 'true'\n" +
    "    }\"\n" +
    "  >\n" +
    "    <ul>\n" +
    "      <li ng-repeat=\"(id, group) in vm.groups\" ng-click=\"vm.pickGroup(id, group)\">{{ group.name }}</li>\n" +
    "    </ul>\n" +
    "  </section>\n" +
    "\n" +
    "  <section id=\"light-setup\"\n" +
    "    ng-class=\"{\n" +
    "      'active': vm.useGroups === 'false'\n" +
    "    }\"\n" +
    "  >\n" +
    "    <ul>\n" +
    "      <li ng-repeat=\"(id, light) in vm.lights\" ng-click=\"vm.pickLight(id, light)\">{{ light.name }}</li>\n" +
    "    </ul>\n" +
    "  </section>\n" +
    "</section>\n"
  );


  $templateCache.put('app/svg.html',
    "<svg version=\"1.1\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:cc=\"http://creativecommons.org/ns#\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\"><symbol viewBox=\"0 0 98 98\" id=\"logo\"><title>Triangle</title><desc>Created with Sketch.</desc> <!-- Generator: Sketch 40.3 (33839) - http://www.bohemiancoding.com/sketch -->    <g id=\"logo-Page-v2\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"logo-screen---switch-off\" transform=\"translate(-71.000000, -101.000000)\" stroke-width=\"6\" stroke=\"#292929\"> <polygon id=\"logo-Triangle\" points=\"120 108 164 196 76 196\"/> </g> </g> </symbol></svg>"
  );

}]);
