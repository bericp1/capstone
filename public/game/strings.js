module.exports = (function(){
  'use strict';
	return {
    load: {
      loading: 'LOADING'
    },
    title: {
      title: 'NOT HOME',
      start: 'Type a command below and hit [enter]',
      startCommands: '"start"        "help"        "load"'
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
      badDirection: 'I didn\'t quite understand you. Which way?'
    }
	};
})();