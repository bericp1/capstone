(function(angular){
  'use strict';

  angular.module('auth', ['ngRoute', 'ngResource'])
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/signup', {
          templateUrl: 'auth/signup.tmpl'
        })
        .otherwise({
          redirectTo: '/signup'
        });
    }]);
})(angular);