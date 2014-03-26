module.exports = [function () {
  'use strict';

  //Load states
  this.states = {
    'load': require('./states/load')
  };

  /**
   * Initial game creation and setup
   * @type {Phaser.Game}
   */
  this.init = function(){
    var me = this;
    me.score = 0;
    me.game = new Phaser.Game(600, 500, Phaser.AUTO, 'game-play-phaser');
    for(var stateName in me.states){
      if(me.states.hasOwnProperty(stateName)) me.game.state.add(stateName, me.states[stateName]);
    }
    me.game.state.start('load');
  };

  this.init();
}];