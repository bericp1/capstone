module.exports = (function(){
  'use strict';
  return {
    audio: {
      'main_bg': ['/game/assets/audio/jeppoe-creepy.mp3'],
      'ambient': ['/game/assets/audio/akashic_records-creepy_haunted_atmosphere.mp3']
    },
    script: {
      'webfont': ['//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js', function(){
        WebFont.load({
          google: {
            families: ['Fjalla One', 'Henny Penny']
          }
        });
      }]
    },
    spritesheet: {
      'player_front_blink': ['/game/assets/sprites/player_front_blink.png', 320, 640, 13]
    }
  };
})();