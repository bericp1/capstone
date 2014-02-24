(function(angular){
  'use strict';

  angular.module('auth', ['ngRoute', 'ngResource'])
    .controller('AuthController', require('./controller'))
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/signup', {
          templateUrl: 'auth/signup.tmpl',
          controller: 'AuthController'
        })
        .when('/login', {
          templateUrl: 'auth/login.tmpl',
          controller: 'AuthController'
        })
        .otherwise({
          redirectTo: '/login'
        });
    }]);
})(angular);