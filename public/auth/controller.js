module.exports = ['$scope', '$http', function($scope, $http){

  $scope.state = {
    status: '',
    message: '',
    email: '',
    password: '',
    loading: false
  };

  var changeStatus = require('../assets/js/change-status')($scope);

  $scope.login = function(){
    $scope.state.loading = true;
    $http
      .post('/login', {email: $scope.state.email, password: $scope.state.password})
      .success(function(data){
        changeStatus('success', 'Login Successful! Welcome, ' + data.user.local.email, 2500);
        $scope.state.loading = false;
      })
      .error(function(data){
        changeStatus('danger', 'Login Failed!', data.error, 2500);
        $scope.state.loading = false;
      });
  };

  $scope.signup = function(){
    $scope.state.loading = true;
    $http
      .post('/signup', {email: $scope.state.email, password: $scope.state.password})
      .success(function(data){
        changeStatus('success', 'Signup Successful! Welcome, ' + data.user.local.email, 2500);
        $scope.state.loading = false;
      })
      .error(function(data){
        changeStatus('danger', 'Signup Failed!', data.error, 2500);
        $scope.state.loading = false;
      });
  };

}];