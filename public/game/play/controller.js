module.exports = ['$scope', '$location', 'GamePlayService', function($scope, $location, PlayService){

  'use strict';

  $scope.state = {
    returnPath: $location.path(),

    game: {
      phaser: {},
      config: {
        width: 600,
        height: 600
      },
      input: {
        value: PlayService.input,
        run: function(){
          PlayService.run.apply(PlayService);
        }
      },
      output: []
    }
  };

  $scope.$watch('state.game.phaser', function(){
    PlayService.manage($scope.state.game.phaser);
  });

  $scope.$watch('state.game.input.value', function(){
    PlayService.input = $scope.state.game.input.value;
  }, true);

  $scope.$watch(function(){return PlayService.input;}, function(){
    $scope.state.game.input.value = PlayService.input;
  }, true);

  $scope.$watch('state.game.output', function(){
    PlayService.messages = $scope.state.game.output;
  }, true);

  $scope.$watch(function(){return PlayService.messages;}, function(){
    $scope.state.game.output = PlayService.messages;
  }, true);

}];