module.exports = (function () {
  'use strict';

  return {
    capabilities: {
      help: [
        'Get information about a command.',
        {
          'command': 'Command to get information about'
        },
        function(){
          console.log('HELP!!!!');
        },
        'info'
      ]
    }
  };
})();