module.exports = (function(){
  'use strict';

  var Twine = require('./classes/Twine'),
    style = require('./style');

	return {
    load: {
      loading: 'LOADING'
    },
    title: {
      title: 'NOT HOME',
      author: 'A game by  Brandon Phillips'
    },
    map: {
      wall: 'Gregory would hit a wall if he tried to do that.',
      door: {
        unlocked: 'Gregory used a key to unlock a door in his path.',
        locked: 'Gregory doesn\'t have any keys to unlock the door(s) in his path.'
      },
      key: 'Gregory found a key. How handy!',
      item: {
        'monocle': 'Gregory found the monocle. With this in his inventory, he looks much more intellectual',
        'keyboard_keys': 'Gregory found a few keyboard keys lying around. With these, you can control Gregory with your arrow keys.'
      },
      noSuchZone: 'Gregory can\'t go that way from here.',
      badDirection: 'I didn\'t quite understand you. Which way?',
      surroundings: function(direction, description){
        return 'To the ' + direction + ' is ' + description;
      }
    },
    noSuchCommand: function(command){
      return 'I didn\'t quite understand you. What did you mean by "' + command + '"?';
    },
    help: [
      new Twine('Welcome to the ' + new Twine('NOT HOME', {family: style.font.title, size: 30}) + ' text adventure.', {size: 20}),
      'Meet ' + new Twine('Gre' + new Twine('g', {color:style.color.one}) + 'ory', {color: style.color.two, weight: 'bold', size: 18}),
      new Twine('He\'s not from here and he\'s trying to find his way back home.'),
      'He\'s also a pushover. You can tell him what to do by typing into the text box below and hitting the ' + new Twine( new Twine('',{class:'glyphicon glyphicon-arrow-down', size: 10}) + ' Enter', {class:'label label-default',size:16}) + ' key.',
      new Twine('Guide him through the creepy mansion that he crashed into' + new Twine('(go figure -_-)', {color:style.color.light}) + ' by typing commands below.'),
      new Twine('Blocks of this color', {color:style.color.white,highlight:style.color.dark}) + ' are outside the mansion. Good luck getting to those.',
      new Twine('Blocks of this color', {color:style.color.white,highlight:style.color.light}) + ' are walls. Let\'s avoid running Gregory into those.',
      new Twine('Blocks of this color', {color:style.color.white,highlight:style.color.three}) + ' are doors. They can only be unlocked and passed through using a key.',
      new Twine('Keys are this color', {highlight:style.color.two}) + '. You should pick them up!',
      'By the way, to pick things around you up (that you can see) just tell Gregory to ' + new Twine('pickup ' + new Twine('[insert_item_name_here]', {family:style.font.console,size:12}), {weight:'bold'}) + '.',
      '', new Twine('Let\'s get started!', {weight: 'bold'}) + ' Tell Gregory to ' + new Twine('start', {weight:'bold'}) + '.'
    ]
	};
})();