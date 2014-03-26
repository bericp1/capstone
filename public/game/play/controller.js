module.exports = ['$scope', '$location', 'GamePlayService', function($scope, $location, PlayService){

  'use strict';

  $scope.state = {
    returnPath: $location.path()
  };

  $scope.state.game = {
    input: '',
    score: PlayService.score
  };

  $scope.$watch(function(){return PlayService.score;}, function(){
    $scope.state.game.score = PlayService.score;
  });

}];