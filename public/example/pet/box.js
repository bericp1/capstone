module.exports = [function(){
  'use strict';
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'example/pet/box.tmpl',
    scope: {
      'pet':'=',
      'deletePet':'&onDelete'
    }
  };
}];