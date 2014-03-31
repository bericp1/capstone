module.exports = [function () {
  'use strict';
  return {
    restrict: 'A',
    replace: true,
    template: '<div></div>',
    scope: {
      output: '=gamePlayOutput'
    },
    link: function ($scope, $element) {
      $scope.output = [];
      var $c = angular.element('<div></div>'), $p = angular.element('<p></p>');
      var render = function(){
        if($scope.output.length > 0){
          var $newC = $c.clone();
          while($scope.output.length > 0){
            var data = $scope.output.shift();
            if(typeof data !== 'string' && typeof data.toString === 'function')
              data = data.toString();
            $p.clone().html(data).appendTo($newC);
          }
          $newC.appendTo($element);
          $element.get(0).scrollTop = $element.get(0).scrollHeight;
        }
      };
      $scope.$watch('output', render, true);
    }
  };
}];