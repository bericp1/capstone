module.exports = (function () {
  'use strict';
  return function(UIState){
    return {
      capabilities: {
        help: [
          'Get information about a command.',
          {
            'command': 'Command to get information about'
          },
          function(){
            UIState.message(['Helpful stuff is supposed to be here for the following commands:']);
            UIState.message(Array.prototype.slice.call(arguments));
          },
          'info'
        ]
      }
    };
  };
})();