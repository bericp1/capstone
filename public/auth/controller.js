module.exports = ['$scope', '$http', function($scope, $http){

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

  var reset = function(){
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
      changeStatus('success', status + ' Token: ' + data.token.substr(0,10) + '...');
      $scope.state.loading = false;
    }
  };

  //TODO Move login/signup/logout logic to a service/factory/whatever (uses localstorage)

  $scope.login = function(){
    reset();
    $http
      .post('/auth/login', {email: $scope.state.email, password: $scope.state.password})
      .success(handleSuccess('Login Successful!'))
      .error(handleError('Login Failed!'));
  };

  $scope.signup = function(){
    reset();
    $http
      .post('/auth/signup', {email: $scope.state.email, password: $scope.state.password, name: $scope.state.name})
      .success(handleSuccess('Signup Successful!'))
      .error(handleError('Signup Failed!'));
  };

}];