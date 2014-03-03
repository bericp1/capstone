(function(angular){
  'use strict';

  angular.module('game', ['ngRoute', 'auth'])
    .controller('GamePlayController', require('./play-controller'))
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/game/play', {
          templateUrl: 'game/play.tmpl',
          controller: 'GamePlayController'
        });
    }]);
})(angular);