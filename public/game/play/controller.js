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
      input: ''
    }
  };

  $scope.$watch('state.game.phaser', function(){
    PlayService.manage($scope.state.game.phaser);
  });

}];