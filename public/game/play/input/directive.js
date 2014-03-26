module.exports = [function () {
  'use strict';
  return {
    restrict: 'AC',
    replace: true,
    templateUrl: 'game/play/input/index.tmpl',
    scope: {
      input: '=gamePlayInput'
    },
    link: function ($scope, $element) {
      $element.val($scope.input);
      $scope.$watch('input', function(){
        $element.val($scope.input);
      }, true);
      $element.on('keyup', function(){
        $scope.input = $element.val();
        $scope.$apply();
      });
    }
  };
}];