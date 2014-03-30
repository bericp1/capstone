module.exports = ['$window', 'GamePlayInputParserService', function ($window, ParserService) {
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
  var tries = 3;

  /**
   * The verbs and aliases and whatnot to be loaded by the parser. This will be broken into states and then into
   * verbs and actions. Generated from individual states capabilities in #manage
   * @type {{Object}}
   */
  var capabilities = {};

  /**
   * Messages that should be shown in output
   * @type {Array.<string>}
   */
  this.messages = [];

  /**
   * Beginning managing game
   * @param game Phaser.Game
   */
  this.manage = function(game){
    var me = this;
    if(game instanceof Phaser.Game){
      if(me.game){
        tries--;
        if(tries === 0){
          $window.location.reload();
        }
        else{
          me.game.destroy();
        }
      }
      me.game = game;

      var states = {
        '_global': require('./states/global')(me),
        'load': require('./states/load'),
        'title': require('./states/title'),
        'map': require('./states/map')(me)
      };
      for(var stateName in states){
        if(states.hasOwnProperty(stateName)){
          if(stateName.indexOf('_') !== 0){
            me.game.state.add(stateName, states[stateName]);
          }
          if(states[stateName].hasOwnProperty('capabilities')){
            capabilities[stateName] = states[stateName].capabilities;
          }
        }
      }

      ParserService.build(me.game, capabilities);

      me.game.state.start('load');
    }
  };

  /**
   * Appends message to outputable array
   * @param message {(Array.<string>|string)}
   */
  this.message = function(message){
    if(message instanceof Array){
      for(var i=0;i<message.length;i++){
        this.message(message[i]);
      }
    }else{
      this.messages.push(message);
      jQuery('textarea').val(jQuery('textarea').val() + '\n' + message);
    }
  };
}];