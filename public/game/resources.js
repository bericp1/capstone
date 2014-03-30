module.exports = (function(Phaser){
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
      'player_front_blink': ['/game/assets/sprites/player_front_blink.png', 320, 640, 13],
      'player_top_moving': ['/game/assets/sprites/player_top_moving.png', 120, 120, 8],
      'map_tiles_sprites': ['/game/assets/tilesets/map.png', 120, 120, 12]
    },
    tilemap: {
      'main': ['/game/assets/tilemaps/main.json', null, Phaser.Tilemap.TILED_JSON]
    },
    image: {
      'map_tiles': ['/game/assets/tilesets/map.png']
    }
  };
})(Phaser);