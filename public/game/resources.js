module.exports = (function(){
  'use strict';
  return {
    script: {
      'webfont': ['//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js', function(){
        WebFont.load({
          google: {
            families: ['Fjalla One']
          }
        });
      }]
    },
    spritesheet: {
      'player_front_blink': ['/game/assets/sprites/player_front_blink.png', 32, 64, 10]
    }
  };
})();