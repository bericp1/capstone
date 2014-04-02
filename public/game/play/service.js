module.exports = ['$window', 'GamePlayInputParserService', '$rootScope', function ($window, ParserService, $scope) {
  'use strict';

  var strings = require('../strings');

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
   * The current game. Null when not managing
   */
  this.game = null;

  /**
   * All states
   * @type {{string: {}}}
   */
  this.states = {};

  /**
   * Current game input
   * @type {string}
   */
  this.input = '';

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

      me.states = {
        '_global': require('./states/global'),
        'load': require('./states/load'),
        'title': require('./states/title')(me),
        'map': require('./states/map')(me)
      };
      for(var stateName in me.states){
        if(me.states.hasOwnProperty(stateName)){
          if(stateName.indexOf('_') !== 0){
            me.game.state.add(stateName, me.states[stateName]);
          }
          if(me.states[stateName].hasOwnProperty('capabilities')){
            capabilities[stateName] = me.states[stateName].capabilities;
          }
        }
      }

      ParserService.build(me.game, capabilities);

      me.game.state.start('load');
    }
  };

  /**
   * Appends message to outputable array
   * @param messages {(Array.<string>|string)}
   */
  this.message = function(messages){
    if(!(messages instanceof Array)){
      messages = [messages];
    }
    this.messages = messages;
    $scope.$apply();
  };

  /**
   * Run a command through the input parser
   */
  this.run = function(command){
    if(!ParserService.run(command)){
      this.message(strings.noSuchCommand(this.input));
    }
  };

  /**
   * Run command from input
   */
  this.runFromInput = function(){
    this.run(this.input);
    this.input = '';
  };

  /**
   * Examine the current zone
   */
  this.examine = function(){
    this.states.map.examine();
  };
}];