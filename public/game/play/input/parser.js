module.exports = (function () {
  'use strict';

  var Parser = function(game){
    this.game = game;
    if(this.game){
      this.alive = true;
      this.build();
    }else{
      this.dead = false;
    }
  };

  return Parser;

})();