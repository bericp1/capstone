module.exports = ['GamePlayInputParserService', function (ParserService) {
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
      $element
        .on('keyup', function(event){
          if(event.which===13 && !!ParserService.ready){
            ParserService.run($scope.input);
            $scope.input = '';
          }else{
            $scope.input = $element.val();
          }
          $scope.$apply();
        });
    }
  };
}];