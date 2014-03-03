module.exports = ['$scope', 'AuthUserService', function($scope, UserService){

  'use strict';

  $scope.state = {
    user: UserService.user
  };

  $scope.$watch(function(){return UserService.user;}, function(){
    $scope.state.user = UserService.user;
  });

  $scope.logout = UserService.logout;

}];