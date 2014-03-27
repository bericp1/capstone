module.exports = ['$window', function ($window) {
  'use strict';

  /**
   * Number of times to allow the game to be rebooted.
   *
   * Since...
   *  1. the game has to re-initialize when angular routes are changed,
   *  2. it's impossible to de-initialize or destroy WebAudio contexts (window.AudioContext), and
   *  3. the browser limits the number of available AudioContexts
   * ...we must force a page reload after the game has been rebooted a certain number of times
   * @type {number}
   */
  this.tries = 3;

  /**
   * Beginning managing game
   * @param game Phaser.Game
   */
  this.manage = function(game){
    var me = this;
    if(game instanceof Phaser.Game){
      if(me.game){
        me.tries--;
        if(me.tries === 0){
          $window.location.reload();
        }
        else{
          me.game.destroy();
        }
      }
      me.game = game;

      var states = {
        'load': require('./states/load'),
        'title': require('./states/title')
      };
      for(var stateName in states){
        if(states.hasOwnProperty(stateName)) me.game.state.add(stateName, states[stateName]);
      }

      me.game.state.start('load');
    }
  };
}];