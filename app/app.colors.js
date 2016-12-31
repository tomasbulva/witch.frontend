/* global Firebase, _, $ */
/* jshint strict: true */
/* jshint -W014 */

(function() {

  'use strict';

  angular
    .module( 'witch' )
    .factory( 'colors', colorHelper );


    function colorHelper(){

      var service = {
        RGBtoHueAngSatBri: HelperRGBtoHueAngSatBri,
        HuetoHueAng: HelperHuetoHueAng,
        HueAngSatBritoRGB: HelperHueAngSatBritoRGB,
        RGBtoXY: HelperRGBtoXY,
        GamutXYforModel: HelperGamutXYforModel,
        XYtoRGB: HelperXYtoRGB,
        XYtoRGBforModel: HelperXYtoRGBforModel,
        ColortemperaturetoRGB: HelperColortemperaturetoRGB,
        ToStringArray: HelperToStringArray,
        TwoFiftyFifeRange: HelperTwoFiftyFifeRange,
        RgbToHex: HelperRgbToHex,
      };

      return service;

      /**
       * @param {float} Red - Range [0..1]
       * @param {float} Green - Range [0..1]
       * @param {float} Blue - Range [0..1]
       * @returns {object} [Ang, Sat, Bri] - Ranges [0..360] [0..1] [0..1]
       */
      function HelperRGBtoHueAngSatBri(Red, Green, Blue) {
        var Ang, Sat, Bri;
        var Min = Math.min(Red, Green, Blue);
        var Max = Math.max(Red, Green, Blue);
        if (Min !== Max) {
          if (Red === Max) {
            Ang = (0 + ((Green - Blue) / (Max - Min))) * 60;
          } else if (Green === Max) {
            Ang = (2 + ((Blue - Red) / (Max - Min))) * 60;
          } else {
            Ang = (4 + ((Red - Green) / (Max - Min))) * 60;
          }
          Sat = (Max - Min) / Max;
          Bri = Max;
        } else { // Max == Min
          Ang = 0;
          Sat = 0;
          Bri = Max;
        }
        return {Ang: Ang, Sat: Sat, Bri: Bri};
      }

      /**
       * Convert skewed Yellow/Green Hue to Correct HueAng
       * @param {float} Hue - Range [0..65535]
       * @returns {float} - Range [0..360]
       *
       */
      function HelperHuetoHueAng(Hue) { // Converted along the skewed yellow green
        var Ang = 360 * Hue / 65535;

        if (Ang>0) {
          if (Ang<90)
            Ang = Ang - Ang * 0.17 * (Ang/90); // Longer Red, shorter Green
          else if (Ang<180)
            Ang = Ang - (180-Ang) *  0.17 * ((180-Ang)/90); // Longer Red, shorter Green
        }
        return Ang;
      }

      /**
       * @param {float} Ang - Range [0..360]
       * @param {float} Sat - Range [0..1]
       * @param {float} Bri - Range [0..1]
       * @returns {object} [Red, Green, Blue] - Ranges [0..1] [0..1] [0..1]
       */
      function HelperHueAngSatBritoRGB(Ang, Sat, Bri) { // Range 360, 1, 1, return .Red, .Green, .Blue
        var Red, Green, Blue;
        if (Sat === 0) {
          Red = Bri;
          Green = Bri;
          Blue = Bri;
        }
        else {
          var Sector = Math.floor(Ang / 60) % 6;
          var Fraction = (Ang / 60) - Sector;
          var p = Bri * (1 - Sat);
          var q = Bri * (1 - Sat * Fraction);
          var t = Bri * (1 - Sat * (1 - Fraction));
          switch (Sector) {
            case 0:
              Red = Bri;
              Green = t;
              Blue = p;
              break;
            case 1:
              Red = q;
              Green = Bri;
              Blue = p;
              break;
            case 2:
              Red = p;
              Green = Bri;
              Blue = t;
              break;
            case 3:
              Red = p;
              Green = q;
              Blue = Bri;
              break;
            case 4:
              Red = t;
              Green = p;
              Blue = Bri;
              break;
            default: // case 5:
              Red = Bri;
              Green = p;
              Blue = q;
              break;
          }
        }
        return {Red: Red, Green: Green, Blue: Blue};
      }

      /**
       * @param {float} Red - Range [0..1]
       * @param {float} Green - Range [0..1]
       * @param {float} Blue - Range [0..1]
       * @returns {object} [x, y] - Ranges [0..1] [0..1]
       */
      function HelperRGBtoXY(Red, Green, Blue) {
        // Source: https://github.com/PhilipsHue/PhilipsHueSDK-iOS-OSX/blob/master/ApplicationDesignNotes/RGB%20to%20xy%20Color%20conversion.md
        // Apply gamma correction
        if (Red > 0.04045)
          Red = Math.pow((Red + 0.055) / (1.055), 2.4);
        else
          Red = Red / 12.92;
        if (Green > 0.04045)
          Green = Math.pow((Green + 0.055) / (1.055), 2.4);
        else
          Green = Green / 12.92;
        if (Blue > 0.04045)
          Blue = Math.pow((Blue + 0.055) / (1.055), 2.4);
        else
          Blue = Blue / 12.92;
        // RGB to XYZ [M] for Wide RGB D65,
        // http://www.developers.meethue.com/documentation/color-conversions-rgb-xy
        var X = Red * 0.664511 + Green * 0.154324 + Blue * 0.162028;
        var Y = Red * 0.283881 + Green * 0.668433 + Blue * 0.047685;
        var Z = Red * 0.000088 + Green * 0.072310 + Blue * 0.986039;
        // But we don't want Capital X,Y,Z you want lowercase [x,y] (called the color point) as per:
        if ((X + Y + Z) === 0)
          return {x: 0, y: 0};
        return {x: X / (X + Y + Z), y: Y / (X + Y + Z)};
      }

      /**
       * Tests if the Px,Py resides within the Gamut for the model.
       * Otherwise it will calculated the closesed point on the Gamut.
       * @param {float} Px - Range [0..1]
       * @param {float} Py - Range [0..1]
       * @param {string} Model - Modelname of the Light to Gamutcorrect Px, Py for
       * @returns {object} [x, y] - Ranges [0..1] [0..1]
       */
      function HelperGamutXYforModel(Px, Py, Model) {
        Model = Model || "LCT001"; // default hue Bulb 2012
        var ModelType = Model.slice(0,3);
        var PRed, PGreen, PBlue;
        var NormDot;

        if (ModelType === 'LCT') { // For the hue bulb the corners of the triangle are:
          PRed = {x: 0.674, y: 0.322};
          PGreen = {x: 0.408, y: 0.517};
          PBlue = {x: 0.168, y: 0.041};
        } else if ((ModelType === 'LLC') || (ModelType === 'LST')) { // For LivingColors Bloom, Aura and Iris the triangle corners are:
          PRed = {x: 0.703, y: 0.296};
          PGreen = {x: 0.214, y: 0.709};
          PBlue = {x: 0.139, y: 0.081};
        } else { // Default all values
          PRed = {x: 1.0, y: 0.0};
          PGreen = {x: 0.0, y: 1.0};
          PBlue = {x: 0.0, y: 0.0};
        }

        var VBR = {x: PRed.x - PBlue.x, y: PRed.y - PBlue.y}; // Blue to Red
        var VRG = {x: PGreen.x - PRed.x, y: PGreen.y - PRed.y}; // Red to Green
        var VGB = {x: PBlue.x - PGreen.x, y: PBlue.y - PGreen.y}; // Green to Blue

        var GBR = (PGreen.x - PBlue.x) * VBR.y - (PGreen.y - PBlue.y) * VBR.x; // Sign Green on Blue to Red
        var BRG = (PBlue.x - PRed.x) * VRG.y - (PBlue.y - PRed.y) * VRG.x; // Sign Blue on Red to Green
        var RGB = (PRed.x - PGreen.x) * VGB.y - (PRed.y - PGreen.y) * VGB.x; // Sign Red on Green to Blue

        var VBP = {x: Px - PBlue.x, y: Py - PBlue.y}; // Blue to Point
        var VRP = {x: Px - PRed.x, y: Py - PRed.y}; // Red to Point
        var VGP = {x: Px - PGreen.x, y: Py - PGreen.y}; // Green to Point

        var PBR = VBP.x * VBR.y - VBP.y * VBR.x; // Sign Point on Blue to Red
        var PRG = VRP.x * VRG.y - VRP.y * VRG.x; // Sign Point on Red to Green
        var PGB = VGP.x * VGB.y - VGP.y * VGB.x; // Sign Point on Green to Blue

        if ((GBR * PBR >= 0) && (BRG * PRG >= 0) && (RGB * PGB >= 0)) // All Signs Match so Px,Py must be in triangle
          return {x: Px, y: Py};

        //  Outside Triangle, Find Closesed point on Edge or Pick Vertice...
        else if (GBR * PBR <= 0) { // Outside Blue to Red
          NormDot = (VBP.x * VBR.x + VBP.y * VBR.y) / (VBR.x * VBR.x + VBR.y * VBR.y);
          if ((NormDot >= 0.0) && (NormDot <= 1.0)) // Within Edge
            return {x: PBlue.x + NormDot * VBR.x, y: PBlue.y + NormDot * VBR.y};
          else if (NormDot < 0.0) // Outside Edge, Pick Vertice
            return {x: PBlue.x, y: PBlue.y}; // Start
          else
            return {x: PRed.x, y: PRed.y}; // End
        }
        else if (BRG * PRG <= 0) { // Outside Red to Green
          NormDot = (VRP.x * VRG.x + VRP.y * VRG.y) / (VRG.x * VRG.x + VRG.y * VRG.y);
          if ((NormDot >= 0.0) && (NormDot <= 1.0)) // Within Edge
            return {x: PRed.x + NormDot * VRG.x, y: PRed.y + NormDot * VRG.y};
          else if (NormDot < 0.0) // Outside Edge, Pick Vertice
            return {x: PRed.x, y: PRed.y}; // Start
          else
            return {x: PGreen.x, y: PGreen.y}; // End
        }
        else if (RGB * PGB <= 0) { // Outside Green to Blue
          NormDot = (VGP.x * VGB.x + VGP.y * VGB.y) / (VGB.x * VGB.x + VGB.y * VGB.y);
          if ((NormDot >= 0.0) && (NormDot <= 1.0)) // Within Edge
            return {x: PGreen.x + NormDot * VGB.x, y: PGreen.y + NormDot * VGB.y};
          else if (NormDot < 0.0) // Outside Edge, Pick Vertice
            return {x: PGreen.x, y: PGreen.y}; // Start
          else
            return {x: PBlue.x, y: PBlue.y}; // End
        }
      }

      /**
       * @param {float} x
       * @param {float} y
       * @param {float} Brightness Optional
       * @returns {object} [Red, Green, Blue] - Ranges [0..1] [0..1] [0..1]
       */
      function HelperXYtoRGB(x, y, Brightness) {
        // Source: https://github.com/PhilipsHue/PhilipsHueSDK-iOS-OSX/blob/master/ApplicationDesignNotes/RGB%20to%20xy%20Color%20conversion.md
        Brightness = Brightness || 1.0; // Default full brightness
        var z = 1.0 - x - y;
        var Y = Brightness;
        var X = (Y / y) * x;
        var Z = (Y / y) * z;
        // XYZ to RGB [M]-1 for Wide RGB D65, http://www.developers.meethue.com/documentation/color-conversions-rgb-xy
        var Red   =  X * 1.656492 - Y * 0.354851 - Z * 0.255038;
        var Green = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
        var Blue  =  X * 0.051713 - Y * 0.121364 + Z * 1.011530;
        // Limit RGB on [0..1]
        if (Red > Blue && Red > Green && Red > 1.0) { // Red is too big
          Green = Green / Red;
          Blue = Blue / Red;
          Red = 1.0;
        }
        if (Red < 0)
          Red = 0;
        if (Green > Blue && Green > Red && Green > 1.0) { // Green is too big
          Red = Red / Green;
          Blue = Blue / Green;
          Green = 1.0;
        }
        if (Green < 0)
          Green = 0;
        if (Blue > Red && Blue > Green && Blue > 1.0) { // Blue is too big
          Red = Red / Blue;
          Green = Green / Blue;
          Blue = 1.0;
        }
        if (Blue < 0)
          Blue = 0;
        // Apply reverse gamma correction
        if (Red <= 0.0031308) {
          Red = Red * 12.92;
        } else {
          Red = 1.055 * Math.pow(Red, (1.0 / 2.4)) - 0.055;
        }
        if (Green <= 0.0031308) {
          Green = Green * 12.92;
        } else {
          Green = 1.055 * Math.pow(Green, (1.0 / 2.4)) - 0.055;
        }
        if (Blue <= 0.0031308) {
          Blue = Blue * 12.92;
        } else {
          Blue = 1.055 * Math.pow(Blue, (1.0 / 2.4)) - 0.055;
        }
        // Limit RGB on [0..1]
        if (Red > Blue && Red > Green && Red > 1.0) { // Red is too big
          Green = Green / Red;
          Blue = Blue / Red;
          Red = 1.0;
        }
        if (Red < 0)
          Red = 0;
        if (Green > Blue && Green > Red && Green > 1.0) { // Green is too big
          Red = Red / Green;
          Blue = Blue / Green;
          Green = 1.0;
        }
        if (Green < 0)
          Green = 0;
        if (Blue > Red && Blue > Green && Blue > 1.0) { // Blue is too big
          Red = Red / Blue;
          Green = Green / Blue;
          Blue = 1.0;
        }
        if (Blue < 0)
          Blue = 0;
        return {Red: Red, Green: Green, Blue: Blue};
      }

      /**
       * @param {float} x
       * @param {float} y
       * @param {float} Brightness Optional
       * @param {string} Model - Modelname of the Light
       * @returns {object} [Red, Green, Blue] - Ranges [0..1] [0..1] [0..1]
       */
      function HelperXYtoRGBforModel(x, y, Brightness, Model) {
        var GamutCorrected = huepi.HelperGamutXYforModel(x, y, Model);
        return huepi.HelperXYtoRGB(GamutCorrected.x, GamutCorrected.y, Brightness);
      }

      /**
       * @param {number} Temperature ranges [1000..66000]
       * @returns {object} [Red, Green, Blue] ranges [0..1] [0..1] [0..1]
       */
      function HelperColortemperaturetoRGB(Temperature) { // http://www.tannerhelland.com/4435/convert-temperature-rgb-algorithm-code/
        // Update Available: https://github.com/neilbartlett/color-temperature/blob/master/index.js
        var Red, Green, Blue;

        Temperature = Temperature / 100;
        if (Temperature <= 66)
          Red = /*255;*/ 165+90*((Temperature)/(66));
        else {
          Red = Temperature - 60;
          Red = 329.698727466 * Math.pow(Red, -0.1332047592);
          if (Red < 0)
            Red = 0;
          if (Red > 255)
            Red = 255;
        }
        if (Temperature <= 66) {
          Green = Temperature;
          Green = 99.4708025861 * Math.log(Green) - 161.1195681661;
          if (Green < 0)
            Green = 0;
          if (Green > 255)
            Green = 255;
        } else {
          Green = Temperature - 60;
          Green = 288.1221695283 * Math.pow(Green, -0.0755148492);
          if (Green < 0)
            Green = 0;
          if (Green > 255)
            Green = 255;
        }
        if (Temperature >= 66)
          Blue = 255;
        else {
          if (Temperature <= 19)
            Blue = 0;
          else {
            Blue = Temperature - 10;
            Blue = 138.5177312231 * Math.log(Blue) - 305.0447927307;
            if (Blue < 0)
              Blue = 0;
            if (Blue > 255)
              Blue = 255;
          }
        }
        return {Red: Red/255, Green: Green/255, Blue: Blue/255};
      }

      /**
       * @param {multiple} Items - Items to convert to StringArray
       * @returns {string} String array containing Items
       */
      function HelperToStringArray(Items) {
        if (typeof Items === 'number') {
          return '"' + Items.toString() + '"';
        } else if (Object.prototype.toString.call(Items) === '[object Array]') {
          var Result = '[';
          for (var ItemNr = 0; ItemNr < Items.length; ItemNr++) {
            Result += huepi.HelperToStringArray(Items[ItemNr]);
            if (ItemNr < Items.length - 1)
              Result += ',';
          }
          Result = Result + ']';
          return Result;
        } else if (typeof Items === 'string') {
          return '"' + Items + '"';
        }
      }

      function HelperTwoFiftyFifeRange(value) {
        if( typeof value === 'object' ) {

          var result = {};

          switch(true) {

            case (
              value.red !== undefined
              && value.green !== undefined
              && value.blue !== undefined
            ):
              result.red = Math.round(value.red * 255);
              result.green = Math.round(value.green * 255);
              result.blue = Math.round(value.blue * 255);
            break;

            case (
              value.Red !== undefined
              && value.Green !== undefined
              && value.Blue !== undefined
            ):
              result.Red = Math.round(value.Red * 255);
              result.Green = Math.round(value.Green * 255);
              result.Blue = Math.round(value.Blue * 255);
            break;

            case (
              value.r !== undefined
              && value.g !== undefined
              && value.b !== undefined
            ):
              result.r = Math.round(value.r * 255);
              result.g = Math.round(value.g * 255);
              result.b = Math.round(value.b * 255);
            break;

          }
          //console.log('result',result);
          return result;
        }
        else if( typeof value === 'string' ) {
          // value = '0,0,0'
          var resultArr = [];
          var valueArr = value.split(',');
          var i = valueArr.length;

          while (i--) {
            resultArr[i] = Math.round(parseInt( valueArr[i] ) * 255);
          }

          return resultArr.join(',');
        }
        else {
          // if no string or suidable object just pass through.
          return value;
        }

      }

      function HelperRgbToHex(value) {
        if( typeof value === 'object' ) {

          var result = {};

          switch(true) {

            case (
              value.red !== undefined
              && value.green !== undefined
              && value.blue !== undefined
            ):
              result.red = parseInt(value.red, 10).toString(16);
              result.green = parseInt(value.green, 10).toString(16);
              result.blue = parseInt(value.blue, 10).toString(16);
            break;

            case (
              value.Red !== undefined
              && value.Green !== undefined
              && value.Blue !== undefined
            ):
              result.Red = parseInt(value.Red, 10).toString(16);
              result.Green = parseInt(value.Green, 10).toString(16);
              result.Blue = parseInt(value.Blue, 10).toString(16);
            break;

            case (
              value.r !== undefined
              && value.g !== undefined
              && value.b !== undefined
            ):
              result.r = parseInt(value.r, 10).toString(16);
              result.g = parseInt(value.g, 10).toString(16);
              result.b = parseInt(value.b, 10).toString(16);
            break;

          }

          //console.log('result',result);
          var resultStr = '#';

          for ( var c in result ) {
            //console.log('result',result[c]);
            resultStr += result[c];
          }

          return resultStr;
        }
        else if( typeof value === 'string' ) {
          // value = '0,0,0'
          var resultArr = [];
          var valueArr = value.split(',');
          var i = valueArr.length;

          while (i--) {
            resultArr[i] = parseInt(valueArr[i], 10).toString(16);
          }

          return '#' + resultArr.join('');
        }
      }
    }

})();
