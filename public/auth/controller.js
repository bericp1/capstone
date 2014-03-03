module.exports = ['$scope', 'AuthUserService', function($scope, UserService){

  'use strict';

  $scope.state = {
    status: '',
    message: '',
    email: '',
    password: '',
    name: '',
    bad: [],
    loading: false
  };

  var changeStatus = require('../assets/js/change-status')($scope);

  var loading = function(){
    $scope.state.loading = true;
    $scope.state.bad = [];
    changeStatus('none');
  };

  var handleError = function(status){
    return function(data){
      changeStatus('danger', status, data.error);
      if(Array.isArray(data.fields)){
        $scope.state.bad = data.fields;
      }
      $scope.state.loading = false;
    };
  };

  var handleSuccess = function(status){
    return function(data){
      if(typeof data.token === 'string'){
        status = status + ' Token: ' + data.token.substr(0,10) + '...';
      }
      changeStatus('success', status);
      $scope.state.loading = false;
    };
  };

  $scope.login = function(){
    loading();
    UserService.login(
      $scope.state.email, $scope.state.password,
      handleSuccess('Login Successful!'),
      handleError('Login Failed!')
    );
  };

  $scope.logout = function(){
    loading();
    UserService.logout(
      handleSuccess('Logout Successful!'),
      handleError('Logout Failed!')
    );
  };

  $scope.signup = function(){
    loading();
    UserService.signup(
      {
        email: $scope.state.email,
        password: $scope.state.password,
        name: $scope.state.name
      },
      handleSuccess('Signup Successful!'),
      handleError('Signup Failed!')
    );
  };

}];