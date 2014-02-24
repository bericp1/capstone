module.exports = function($scope, state){
  'use strict';

  if(typeof state !== 'string'){
    state = 'state';
  }
  return function(status, message, data, duration){
    $scope[state].status = status;
    if(typeof data === 'string'){
      message = message + ' ' + data;
    }
    $scope[state].message = message;
    if(typeof duration === 'number' && duration > 0){
      window.setTimeout(function(){
        $scope.$apply(function(){
          $scope[state].status = '';
          $scope[state].message = '';
        });
      }, duration);
    }
  };
};