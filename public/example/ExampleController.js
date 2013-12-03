module.exports = ['$scope', 'ExampleModel', function($scope, ExampleModel){
  'use strict';
  $scope.exampleText = 'Example Pets';
  $scope.pets = [];
  $scope.$watch(
    function(){return ExampleModel.pets;},
    function(){
      $scope.pets = ExampleModel.pets;
    },
    true
  );
  $scope.isAlive = function(pet){
    return (pet === ExampleModel.alivePet);
  };
  $scope.setAlive = function(pet){
    ExampleModel.setAlivePet(pet);
  };
}];