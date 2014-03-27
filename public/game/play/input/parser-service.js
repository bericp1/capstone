module.exports = [function () {
  'use strict';

  var me = this;
  me.ready = false;

  me.build = function(game){
    if(game){
      me.game = game;
      //TODO parsing of game's capabilities/actions
      me.ready = true;
    }
  };

  me.destroy = function(){
    delete me.game;
    me.ready = false;
  };

}];