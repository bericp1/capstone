(function(angular){
  'use strict';

  angular.module('game', ['ngRoute', 'auth'])
    .directive('autoFocus', require('../common/autofocus-directive'))
    .directive('gamePlayInput', require('./play/input/directive'))
    .directive('gamePlayOutput', require('./play/output-directive'))
    .directive('gamePhaser', require('./play/phaser-directive'))
    .controller('GamePlayController', require('./play/controller'))
    .service('GamePlayInputParserService', require('./play/input/parser-service'))
    .service('GamePlayService', require('./play/service'))
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/game/play', {
          templateUrl: 'game/play/index.tmpl',
          controller: 'GamePlayController'
        });
    }]);
})(angular);