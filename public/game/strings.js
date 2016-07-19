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
      wall: new Twine('Gregory would hit a wall if he tried to do that.', {color:style.color.three}),
      door: {
        unlocked: 'Gregory used a key to unlock a door in his path.',
        locked: new Twine('Gregory doesn\'t have any keys to unlock the door(s) in his path.', {color:style.color.three})
      },
      key: 'Gregory found a key. How handy!',
      item: {
        'monocle': 'Gregory found the monocle. With this in his inventory, he looks much more intellectual',
        'keyboard_keys': 'Gregory found a few keyboard keys lying around. With these, you can control Gregory with your arrow keys. (right = east, down = south, etc.)'
      },
      noSuchZone: new Twine('Gregory can\'t go that way from here.', {color:style.color.three}),
      badDirection: new Twine('I didn\'t quite understand you. Which way?', {color:style.color.three}),
      noPickup: new Twine('There are no items nearby for Gregory to pick up.', {color:style.color.three}),
      stillMoving: new Twine('Hold your horses!', {color:style.color.three}),
      surroundings: function(direction, description){
        return 'To the ' + direction + ' is ' + description;
      }
    },
    noSuchCommand: function(command){
      return new Twine('I didn\'t quite understand you. What did you mean by "' + command + '"?', {color:style.color.three});
    },
    help: [
      new Twine('Welcome to the ' + new Twine('NOT HOME', {family: style.font.title, size: 30}) + ' text adventure.', {size: 20}),
      'Meet ' + new Twine('Gre' + new Twine('g', {color:style.color.one}) + 'ory', {color: style.color.two, weight: 'bold', size: 18}) + '.',
      new Twine('He\'s not from here and he\'s trying to find his way back home.'),
      'He\'s also a pushover. You can tell him what to do by typing into the text box below and hitting the ' + new Twine( new Twine('',{classes:'glyphicon glyphicon-arrow-down', size: 10}) + ' Enter', {classes:'label label-default',size:16}) + ' key.',
      new Twine('Guide him through the creepy mansion that he crashed into' + new Twine('(go figure -_-)', {color:style.color.light}) + ' by typing commands below.'),
      new Twine('Blocks of this color', {color:style.color.white,highlight:style.color.dark}) + ' are outside the mansion. Good luck getting to those.',
      new Twine('Blocks of this color', {color:style.color.white,highlight:style.color.light}) + ' are walls. Let\'s avoid running Gregory into those.',
      new Twine('Blocks of this color', {color:style.color.white,highlight:style.color.three}) + ' are doors. They can only be unlocked and passed through using a key.',
      new Twine('Keys are this color', {highlight:style.color.two}) + '. You should pick them up!',
      'By the way, to pick things around you up (that you can see) just tell Gregory to ' + new Twine('pickup&nbsp;&nbsp;' + new Twine('(item name here)', {family:style.font.console,size:12}), {weight:'bold'}) + '.',
      '', new Twine('Let\'s get started!', {weight: 'bold'}) + ' Tell Gregory to ' + new Twine('start', {weight:'bold'}) + '.'
    ],
    win: {
      congrats: 'You Win!!!',
      face: ':-)',
      gregory: 'Gregory has found his way home!'
    },
    dead: {
      gregory: 'Gregory has died.',
      face: ':-(',
      instructions: 'Try communicating with Gergory from beyond the grave.\nType "revive".'
    }
	};
})();