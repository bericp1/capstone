(function(angular){
  'use strict';

  angular.module('auth', ['ngRoute'])
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
        });
    }]);
})(angular);