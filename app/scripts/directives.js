'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])

.directive('browserVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
            var agentStr = navigator.userAgent;
            this.IsIE = false;
            this.IsOn = undefined;  //defined only if IE
            this.Version = undefined;

        if (agentStr.indexOf("MSIE 7.0") > -1) {
          this.IsIE = true;
          this.IsOn = true;
          if (agentStr.indexOf("Trident/6.0") > -1) {
            this.Version = 'IE10';
          } else if (agentStr.indexOf("Trident/5.0") > -1) {
            this.Version = 'IE9';
          } else if (agentStr.indexOf("Trident/4.0") > -1) {
            this.Version = 'IE8';
          } else {
            this.IsOn = false; // compatability mimics 7, thus not on
            this.Version = 'IE7';
          }
        } //IE 7
  };
  }]);
