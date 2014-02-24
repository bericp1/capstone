require('./assets/js/util');
require('./auth');

(function(angular){
  'use strict';
  angular
    .module('capstone', ['compiled-templates', 'btford.socket-io', 'auth'])
    .config(['socketProvider', function(socketProvider){
      socketProvider.prefix('socket.');
    }]);
})(angular);