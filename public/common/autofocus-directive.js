module.exports = [function () {
  'use strict';
  return {
    restrict: 'AC',
    link: function ($scope, $element) {
      $element.focus();
    }
  };
}];