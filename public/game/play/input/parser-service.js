module.exports = ['$injector', function ($injector) {
  'use strict';

  var DictionaryEntry = function(description, args, action, aliases){
    if(typeof description === 'string'){
      this.description = description;
    }else{
      this.description = '';
    }
    if(typeof args === 'object'){
      this.args = args;
    }else{
      this.args = {};
    }
    if(typeof action === 'function' || (typeof action === 'string' && action.trim() !== '')){
      this.action = action;
    }else{
      this.action = function(){};
    }
    if(typeof aliases === 'string'){
      this.aliases = [aliases];
    }else if(aliases instanceof Array){
      this.aliases = aliases;
    }else{
      this.aliases = [];
    }
  };

  var me = this;

  me.build = function(game, capabilities){
    if(game instanceof Phaser.Game && typeof capabilities === 'object'){
      /*
       * Begin parsing capabilities and building a dictionary
       * Each child in dictionary should look like:
       * string state : {string verb : DictionaryEntry entry}
       */
      me.dictionary = {};

      for(var state in capabilities){
        if(capabilities.hasOwnProperty(state)){
          var stateCapabilities = capabilities[state];
          var aliasesToParse = {};
          me.dictionary[state] = {};
          //Parse Verbs and Aliases
          for(var verb in stateCapabilities){
            if(stateCapabilities.hasOwnProperty(verb)){
              var verbDefinition = stateCapabilities[verb];
              if(typeof verbDefinition === 'function'){
                //Straight up action with no description or args
                me.dictionary[state][verb] = new DictionaryEntry('', {}, verbDefinition, []);
              }else if(typeof verbDefinition === 'string'){
                //Alias
                aliasesToParse[verb] = [verbDefinition, true];
              }else if(typeof verbDefinition === 'object'){
                if(verbDefinition instanceof Array){
                  verbDefinition = {
                    description: verbDefinition[0] || '',
                    args: verbDefinition[1] || {},
                    action: verbDefinition[2] || '',
                    aliases: verbDefinition[3] || []
                  };
                }
                //Full on verb def with description an everything
                me.dictionary[state][verb] = new DictionaryEntry(
                  verbDefinition.description,
                  verbDefinition.args,
                  verbDefinition.action,
                  verbDefinition.aliases
                );
                if(typeof verbDefinition.aliases === 'string'){
                  verbDefinition.aliases = [verbDefinition.aliases];
                }
                if(verbDefinition.aliases instanceof Array){
                  for(var i = 0; i < verbDefinition.aliases.length; i++){
                    aliasesToParse[verbDefinition.aliases[i]] = [verb, false];
                  }
                }
              }
            }
          }
          //Parse Aliases
          for(var alias in aliasesToParse){
            if(aliasesToParse.hasOwnProperty(alias)){
              var aliasPair = aliasesToParse[alias],
                fullVerb = aliasPair[0],
                toPropegateToDictionary = aliasPair[1],
                verbParts = fullVerb.trim().split(' '),
                mainVerb = verbParts[0];
              me.dictionary[state][alias] = new DictionaryEntry(
                'An alias for "' + fullVerb + '"',
                {},
                fullVerb
              );
              if(toPropegateToDictionary && verbParts.length === 1 && me.dictionary[state].hasOwnProperty(mainVerb)){
                me.dictionary[state][mainVerb].aliases.push(alias);
              }
            }
          }
        }
      }

      me.game = game;
      me.ready = true;
    }
  };

  /**
   * Runs a command based on the currently built dictionary
   * @returns {boolean} True if command found and run, false otherwise
   */
  me.run = function(command){
    var state = me.game.state.current;
    var rawParts = command.split(' ');
    var args = [];
    for(var i = 0; i < rawParts.length; i++){
      if(rawParts[i].trim() !== ''){
        args.push(rawParts[i]);
      }
    }

    var verb = args.shift();

    var doAction = function(state){
      var action = me.dictionary[state][verb].action;
      if(typeof action === 'function'){
        action.apply($injector.get('GamePlayService'), args);
        return true;
      }else if(typeof action === 'string'){
        return me.run(action + ' ' + args.join(' '));
      }else{
        return false;
      }
    };

    if(me.dictionary.hasOwnProperty(state)){
      if(me.dictionary[state].hasOwnProperty(verb)){
        return doAction(state);
      }else if(me.dictionary.hasOwnProperty('_global') && me.dictionary._global.hasOwnProperty(verb)){
        return doAction('_global');
      }else{
        return false;
      }
    }
  };

  me.reset = function(){
    me.game = false;
    me.ready = false;
    me.dictionary = {};
  };

  me.reset();

}];