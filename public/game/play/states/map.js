module.exports = (function () {
  'use strict';

  var style = require('../../style'),
    strings = require('../../strings');

  var game, map, groundLayer, wallsLayer, items, specials, cursors, player;

  var findByName = function(group, name){
    for(var i=0; i<group.children.length; i++){
      console.log(group.children[i]);
      if(group.children[i].name === name){
        return group.children[i];
      }
    }
  };

  return {
    create: function(){
      game = this.game;

      game.stage.backgroundColor = style.color.light;

      map = game.add.tilemap('main');
      map.addTilesetImage('map_tiles', 'map_tiles');
      groundLayer = map.createLayer('ground');
      wallsLayer = map.createLayer('walls');
      groundLayer.resizeWorld();
      map.setLayer(wallsLayer);
      map.setCollision(4);

      items = game.add.group();
      specials = game.add.group();
      for(var specialIdx=0; specialIdx<=11; specialIdx++){
        map.createFromObjects('special', specialIdx+1, 'map_tiles_sprites', specialIdx, true, false, specials);
      }
      for(var itemIdx=0; itemIdx<=11; itemIdx++){
        map.createFromObjects('items', itemIdx+1, 'map_tiles_sprites', itemIdx, true, false, items);
      }

      specials.setAll('alpha', 0);

      var startSpace = findByName(specials, 'start');

      player = game.add.sprite(startSpace.x, startSpace.y, 'player_top_moving', 0);
      player.animations.add('top_moving', null, 16, true);
      game.camera.follow(player);
      //player.animations.play('top_moving');

      cursors = game.input.keyboard.createCursorKeys();
    },

    update: function(){
      if (cursors.left.isDown)
      {
        game.camera.x -= 8;
      }
      else if (cursors.right.isDown)
      {
        game.camera.x += 8;
      }

      if (cursors.up.isDown)
      {
        game.camera.y -= 8;
      }
      else if (cursors.down.isDown)
      {
        game.camera.y += 8;
      }

    }
  };
})();