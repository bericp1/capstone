module.exports = ['AuthUserService', function (UserService) {
  'use strict';
  return {
    restrict: 'A',
    replace: false,
    templateUrl: 'auth/account-box/index.tmpl',
    scope: {
      returnPath: '=authAccountBox'
    },
    link: function($scope){
      $scope.state = {
        user: UserService.user
      };
      $scope.$watch(function(){return UserService.user;}, function(){
        $scope.state.user = UserService.user;
      });
      $scope.logout = UserService.logout;
      if(typeof $scope.returnPath === 'string' && $scope.returnPath.trim().length > 0){
        $scope.returnPath = 'return=' + $scope.returnPath;
      }else{
        $scope.returnPath = '';
      }
    }
  };
}];