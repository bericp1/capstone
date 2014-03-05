module.exports = ['$scope', '$location', function($scope, $location){

  'use strict';

  $scope.state = {
    returnPath: $location.path()
  };

}];