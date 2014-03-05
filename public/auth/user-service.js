module.exports = ['$http', function($http){

  'use strict';

  var me = this;

  me.token = false;
  me.user = false;

  var genericRequest = function(path, payload, success, error){
    if(typeof success !== 'function'){
      success = function(){};
    }
    if(typeof error !== 'function'){
      error = function(){};
    }
    return $http
      .post(path, payload)
      .success(function(data){
        me.token = data.token;
        me.user = data.user;
        success.apply(this, arguments);
      })
      .error(error);
  };

  me.login = function(payload, success, error){
    return genericRequest('/auth/login', payload, success, error);
  };

  me.signup = function(payload, success, error){
    return genericRequest('/auth/signup', payload, success, error);
  };

  me.logout = function(more){
    var done = function(){
      me.token = false;
      me.user = false;
      if(typeof more === 'function'){
        more.apply(this, arguments);
      }
    };
    return $http.post('/auth/logout', {token: me.token})
      .success(done)
      .error(function(data, status){
        if(status === 500){
          console.error('Session couldn\'t be invalidated on the server. Server response:', data);
        }
        done.apply(this, arguments);
      });

  };

}];