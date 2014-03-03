module.exports = ['$http', function($http){

  'use strict';

  var me = this;

  me.token = false;
  me.user = false;

  me.login = function(email, password, success, error){
    return $http
      .post('/auth/login', {
        email: email,
        password: password
      })
      .success(function(data){
        me.token = data.token;
        me.user = data.user;
        success(data);
      })
      .error(error);
  };

  me.logout = function(success, error){
    if(typeof success !== 'function'){
      success = function(){};
    }
    if(typeof error !== 'function'){
      error = function(){};
    }
    return $http.post('/auth/logout', {token: me.token})
      .success(function(data){
        me.token = false;
        me.user = false;
        success(data);
      })
      .error(error);
  };

  me.signup = function(data, success, error){
    return $http
      .post('/auth/signup', data)
      .success(function(data){
        me.token = data.token;
        me.user = data.user;
        success(data);
      })
      .error(error);
  };

}];