(function(angular){
  'use strict';
  var expressResource = require('../assets/js/expressResource');

  angular.module('exampleModule', ['ngRoute', 'ngResource'])
    .factory(   'PetResource',        expressResource('/data/pet'))
    .controller('ExampleController',  require('./controller'))
    .directive( 'petBox',             require('./pet/box'))
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'example/main.tmpl',
          controller: 'ExampleController'
        })
        .otherwise({
          redirectTo: '/'
        });
    }]);
})(angular);