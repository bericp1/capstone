module.exports = (function () {
  'use strict';

  var MoveError = function(px,py,zx,zy){
    this.message = 'Player('+px+','+py+') must be in same row or column as target zone('+zx+','+zy+').';
    this.stack = (new Error()).stack;
  };

  MoveError.prototype = new Error();
  MoveError.prototype.name = 'MoveError';

  return MoveError;

})();