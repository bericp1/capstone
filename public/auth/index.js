(function(angular){
  'use strict';

  angular.module('auth', ['ngRoute', 'ngCookies'])
    .service('AuthUserService', require('./user-service'))
    .controller('AuthController', require('./controller'))
    .directive('authAccountBox', require('./account-box/directive'))
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/auth/:mode', {
          templateUrl: 'auth/index.tmpl',
          controller: 'AuthController'
        });
    }]);
})(angular);