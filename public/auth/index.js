(function(angular){
  'use strict';

  angular.module('auth', ['ngRoute', 'ngResource'])
    .service('AuthUserService', require('./user-service'))
    .controller('AuthController', require('./controller'))
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/auth/signup', {
          templateUrl: 'auth/signup.tmpl',
          controller: 'AuthController'
        })
        .when('/auth/login', {
          templateUrl: 'auth/login.tmpl',
          controller: 'AuthController'
        })
        .otherwise({
          redirectTo: '/auth/login'
        });
    }]);
})(angular);