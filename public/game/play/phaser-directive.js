module.exports = [function () {
  'use strict';
  return {
    restrict: 'AC',
    scope: {
      game: '=gamePhaser',
      config: '=gamePhaserConfig'
    },
    link: function ($scope, $element) {
      if(!$scope.config){
        $scope.config = {};
      }
      $scope.game = new Phaser.Game(
        $scope.config.width,
        $scope.config.height,
        $scope.config.renderer,
        $element.get(0),
        $scope.config.state,
        $scope.config.transparent,
        $scope.config.antialias,
        $scope.config.physicsConfig
      );
    }
  };
}];