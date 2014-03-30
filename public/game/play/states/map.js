module.exports = (function (Phaser, $) {
  'use strict';

  var style = require('../../style'),
    strings = require('../../strings').map,
    MapManager = require('../../classes/MapManager');

  var game, mapBackgroundMusic, map, groundLayer, player, mapManager, moveTween;

  var activeZone;

  var keys = 0;

  var inventory = [];

  var create = function(){
    game = this.game;

    game.sound.stopAll();
    mapBackgroundMusic = this.game.add.audio('ambient', 1, true);
    mapBackgroundMusic.play();

    game.stage.backgroundColor = style.color.light;

    map = game.add.tilemap('main');
    map.addTilesetImage('map_tiles', 'map_tiles');
    groundLayer = map.createLayer('ground');
    groundLayer.resizeWorld();

    mapManager = new MapManager(map);
    mapManager.addObjectLayers('map_tiles_sprites');

    mapManager.objects.zones.setAll('alpha', 0);

    activeZone = mapManager.findByNameIn('start', 'zones');
    player = game.add.sprite(activeZone.x, activeZone.y, 'player_top_moving', 0);
    player.anchor.setTo(0.5);
    game.camera.follow(player);

    player.animations.add('top_moving', null, 16, true);

    movePlayerTo(activeZone);

//      cursors = game.input.keyboard.createCursorKeys();
  };

  var update = function(){};

  var directions = [
    {short:'n',long:'north'},
    {short:'ne',long:'northeast'},
    {short:'e',long:'east'},
    {short:'se',long:'southeast'},
    {short:'s',long:'south'},
    {short:'sw',long:'southwest'},
    {short:'w',long:'west'},
    {short:'nw',long:'northwest'}
  ];

  var inventoryQueue = [], keyQueue = 0, messageQueue = [];

  var movePlayerTo = function(zone){
    player.animations.play('top_moving');
    zone = mapManager.findByNameIn(zone, 'zones');
    if(!!zone){
      var course = mapManager.findInPath(player, zone),
        props = {}, safe = true;

      if(course.objects instanceof Array && course.objects.length > 0){
        for(var objIdx=0;objIdx<course.objects.length;objIdx++){
          var objectInfo = course.objects[objIdx];
          switch (objectInfo.group) {
          case 'walls':
            safe = false;
            return strings.wall;
          case 'doors':
            if(keyQueue>0){
              keyQueue--;
              messageQueue.push(strings.door.unlocked);
              objectInfo.sprite.kill();
            }else if(keys>0){
              keys--;
              messageQueue.push(strings.door.unlocked);
              objectInfo.sprite.kill();
            }else{
              messageQueue.push(strings.door.locked);
              safe = false;
            }
            break;
          case 'items':
            inventoryQueue.push(objectInfo.sprite);
            messageQueue.push(strings.item[objectInfo.name]);
            objectInfo.sprite.kill();
            break;
          case 'keys':
            keyQueue++;
            messageQueue.push(strings.key);
            objectInfo.sprite.kill();
            break;
          case 'events':
            //TODO acknowledge events
            break;
          default:
            break;
          }
          if(!safe){break;}
        }
      }

      if(!!safe){
        messageQueue.push(zone.long);
        for(var dirIdx=0;dirIdx<directions.length;dirIdx++){
          if(zone.hasOwnProperty(directions[dirIdx].short)){
            messageQueue.push('To the ' + directions[dirIdx].long + ' is ' +
              mapManager.findByNameIn(zone[directions[dirIdx].short], 'zones').short);
          }
        }
      }

      if(typeof course.direction === 'string' && !!safe){
        props[course.direction] = zone[course.direction];
        moveTween = game.add.tween(player);
        moveTween.onComplete.add(doneMovingPlayer, this);
        moveTween.to(props, 3000, Phaser.Easing.Linear.None);
        moveTween.start();
        activeZone = zone;
      }else{
        doneMovingPlayer.apply(this,[]);
      }

    }
  };

  var doneMovingPlayer = function(){
    keys+=keyQueue;
    keyQueue=0;
    for(var i=0;i<inventoryQueue.length;i++){
      inventory.push(inventoryQueue[i]);
    }
    inventoryQueue = [];
    $(window).trigger('gamePlay.doneMoving', [{messages: messageQueue}]);
    messageQueue = [];
    player.animations.stop('top_moving', true);
  };

  var resolveDirection = function(direction){
    for(var dirIdx=0;dirIdx<directions.length;dirIdx++){
      if(direction === directions[dirIdx].short || direction === directions[dirIdx].long){
        return directions[dirIdx].short;
      }
    }
    return false;
  };

  return {
    create: create,

    update: update,

    movePlayerTo: movePlayerTo,

    capabilities: {
      'move': [
        'Move Gregory in a certain direction.',
        {
          direction: 'The direction in which to move Gregory'
        },
        function(direction){
          var newDirection = resolveDirection(direction);
          if(!!newDirection){
            var newZone = mapManager.findByNameIn(activeZone[newDirection], 'zones');
            if(!!newZone){
              movePlayerTo(newZone);
            }else{
              this.message(strings.noSuchZone);
            }
          }else{
            this.message(strings.badDirection);
          }
        },
        'go'
      ],
      'n': 'move n',
      'north': 'move n',
      's': 'move s',
      'south': 'move s',
      'e': 'move e',
      'east': 'move e',
      'w': 'move w',
      'west': 'w',
      'ne': 'move ne',
      'northeast': 'move ne',
      'se': 'move se',
      'southeast': 'move se',
      'nw': 'move nw',
      'northwest': 'move nw',
      'sw': 'move sw',
      'southweat': 'move sw'
    }
  };
})(Phaser, jQuery);