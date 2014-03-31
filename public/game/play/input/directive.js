module.exports = [function () {
  'use strict';
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'game/play/input/index.tmpl',
    scope: {
      input: '=gamePlayInput',
      run: '=gamePlayRunCommand'
    },
    link: function ($scope, $element) {
      $element.val($scope.input);
      $scope.$watch('input', function(){
        $element.val($scope.input);
      }, true);
      $element
        .on('keyup', function(event){
          if(event.which===13){
            $scope.run();
          }else{
            $scope.input = $element.val();
          }
          $scope.$apply();
        });
    }
  };
}];