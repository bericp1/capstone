module.exports = ['$scope', '$routeParams', '$location', 'AuthUserService', function($scope, $routeParams, $location, UserService){

  'use strict';

  $scope.state = {
    active: $routeParams.mode,
    returnPath: $routeParams.return,
    status: '',
    message: '',
    loading: false
  };
  $scope.modes = {
    'login': {
      title: 'Login',
      fields: [
        {
          'name': 'email',
          'label': 'Email',
          'type': 'text'
        },
        {
          'name': 'password',
          'label': 'Password',
          'type': 'password'
        }
      ],
      submit: function(){
        loading();
        UserService.login(
          $scope.modes.login.data,
          handleSuccess('Login Successful!'),
          handleError('Login Failed!')
        );
      },
      bad:[],
      data: {}
    },
    'signup': {
      title: 'Signup',
      fields: [
        {
          'name': 'email',
          'label': 'Email',
          'type': 'text'
        },
        {
          'name': 'password',
          'label': 'Password',
          'type': 'password'
        },
        {
          'name': 'name',
          'label': 'Name',
          'type': 'text'
        }
      ],
      submit: function(){
        loading();
        UserService.signup(
          $scope.modes.signup.data,
          handleSuccess('Signup Successful!'),
          handleError('Signup Failed!')
        );
      },
      bad:[],
      data: {}
    }
  };
  $scope.change = function(to){
    $location.path('/auth/'+to);
  };

  if(typeof $scope.state.returnPath !== 'string' || $scope.state.returnPath.trim().length === 0){
    $scope.state.returnPath = false;
  }

  if(!$scope.modes.hasOwnProperty($scope.state.active)){
    for(var mode in $scope.modes){
      if($scope.modes.hasOwnProperty(mode)){
        $scope.change(mode);
        break;
      }
    }
  }

  var changeStatus = require('../assets/js/change-status')($scope);

  var loading = function(){
    $scope.state.loading = true;
    $scope.modes[$scope.state.active].bad = [];
    changeStatus('none');
  };

  var handleError = function(status){
    return function(data){
      changeStatus('danger', status, data.error);
      if(Array.isArray(data.fields)){
        $scope.modes[$scope.state.active].bad = data.fields;
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
      if($scope.state.returnPath !== false){
        $location.path($scope.state.returnPath);
      }else{
        $location.path('/');
      }
    };
  };

}];