module.exports = (function () {
  'use strict';

  var strings = require('../../strings');

  return {
    capabilities: {
      help: [
        'Get information about an available command or how to play.',
        {
          'command': 'Command to get information about'
        },
        function(){
          var mode;
          if(arguments.length > 0) {
            mode = 'help';
          }else {
            mode = this.game.state.current;
          }
          switch(mode){
          case 'title':
            this.message(strings.help);
            break;
          case 'map':
            this.examine();
            break;
          case 'help':
            var args = Array.prototype.slice.call(arguments);
            this.message('Helpful stuff is supposed to be here for the following command: ' + args.join(' '));
            break;
          default:
            this.message('Wait a minute... where are we?');
            break;
          }
        },
        'info'
      ],
      'examine': 'help'
    }
  };
})();