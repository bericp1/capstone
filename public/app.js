require('./assets/js/util');
require('./auth');
require('./game');

(function(angular){
  'use strict';
  angular
    .module('capstone', ['compiled-templates', 'btford.socket-io', 'ngRoute', 'auth', 'game'])
    .config(['socketProvider', '$routeProvider', function(socketProvider, $routeProvider){
      socketProvider.prefix('socket.');
      $routeProvider.otherwise({redirectTo: '/game/play'});
    }]);
})(angular);