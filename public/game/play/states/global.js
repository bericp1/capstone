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
          if(arguments.length === 0){
            switch(this.game.state.current){
            case 'title':
              this.message(strings.help);
              break;
            case 'map':
              this.examine();
              break;
            }
          }else{
            var args = Array.prototype.slice.call(arguments);
            this.message('Helpful stuff is supposed to be here for the following command: ' + args.join(' '));
          }
        },
        'info'
      ],
      'examine': 'help'
    }
  };
})();