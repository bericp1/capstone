module.exports = (function (Phaser) {
  'use strict';

  return function(UIService){

    var style = require('../../style'),
      strings = require('../../strings').map,
      MapManager = require('../../classes/MapManager');

    /**
     * Game that this state belongs to
     * @type {Phaser.Game}
     */
    var game;

    /**
     * The background sound
     * @type {Phaser.Sound}
     */
    var mapBackgroundMusic;

    /**
     * @type {Phaser.Tilemap}
     */
    var map;

    /**
     * The layer which contains the ground tiles
     * @type {Phaser.TilemapLayer}
     */
    var groundLayer;

    /**
     * The Sprite instance for the play
     * @type {Phaser.Sprite}
     */
    var player;

    /**
     * @type {MapManager}
     */
    var mapManager;

    /**
     * Tween to manage the movement of the player
     * @type {Phaser.Tween}
     */
    var moveTween;

    /**
     * The zone that the player currently occupies
     * @type {Phaser.Tween}
     */
    var activeZone;

    /**
     * The number of keys that the player currently possesses
     * @type {number}
     */
    var keys = 0;

    /**
     * The player's inventory
     * @type {Array.<Phaser.Sprite>}
     */
    var inventory = [];

    /**
     * The speed at which the player should travel when omving.
     * Measured in pixels/ms
     * @type {number}
     */
    var speed = 250/1000;

    /**
     * Run on state load to create the stage
     */
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

    /**
     * Run on game update
     */
    var update = function(){};

    /**
     * Possible directions coupled with their long forms and angles at which the player should be turned
     * @type {{short: string, long: string, angle: number}[]}
     */
    var directions = [
      {short:'n',long:'north', angle:-Math.PI/2},
      {short:'ne',long:'northeast', angle:-Math.PI/4},
      {short:'e',long:'east', angle:0},
      {short:'se',long:'southeast', angle:Math.PI/4},
      {short:'s',long:'south', angle:Math.PI/2},
      {short:'sw',long:'southwest', angle:3*Math.PI/4},
      {short:'w',long:'west', angle:Math.PI},
      {short:'nw',long:'northwest', angle:-3*Math.PI/4}
    ];

    /**
     * Queues used for collision testing and sprite killing. (Oh the humanity!)
     * @type {{inventory: Array, key: Array, message: Array, door: Array}}
     */
    var deathRow = {
      inventory:  [],
      key:        [],
      message:    [],
      door:       []
    };

    /**
     * Moves player to a certain zone
     * @param zone Zone to move player to
     */
    var movePlayerTo = function(zone){
      //Start walking animation
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
              break;
            case 'doors':
              if(deathRow.key.length>0){
                deathRow.key.pop();
                deathRow.message.push(strings.door.unlocked);
                deathRow.door.push(objectInfo.sprite);
              }else if(keys>0){
                keys--;
                deathRow.message.push(strings.door.unlocked);
                deathRow.door.push(objectInfo.sprite);
              }else{
                deathRow.message.push(strings.door.locked);
                safe = false;
              }
              break;
            case 'items':
              deathRow.inventory.push(objectInfo.sprite);
              deathRow.message.push(strings.item[objectInfo.name]);
              break;
            case 'keys':
              deathRow.key.push(objectInfo.sprite);
              deathRow.message.push(strings.key);
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
          deathRow.message.push(zone.long);
          for(var dirIdx=0;dirIdx<directions.length;dirIdx++){
            if(zone.hasOwnProperty(directions[dirIdx].short)){
              deathRow.message.push('To the ' + directions[dirIdx].long + ' is ' +
                mapManager.findByNameIn(zone[directions[dirIdx].short], 'zones').short);
            }
          }
        }

        if(typeof course.direction === 'string' && !!safe){
          props[course.direction] = zone[course.direction];
          var time = (Math.abs(player[course.direction]-zone[course.direction])/speed);
          moveTween = game.add.tween(player);
          moveTween.onComplete.add(doneMovingPlayer, this);
          moveTween.to(props, time, Phaser.Easing.Linear.None);
          moveTween.start();
          activeZone = zone;
        }else{
          doneMovingPlayer.apply(this,[]);
        }

      }
    };

    /**
     * Callback run when player is done moving (or can't move)
     */
    var doneMovingPlayer = function(){
      keys+=deathRow.key.length;
      for(var keyi=0;keyi<deathRow.key.length;keyi++){
        deathRow.key[keyi].kill();
      }
      for(var invi=0;invi<deathRow.inventory.length;invi++){
        inventory.push(deathRow.inventory[invi]);
        deathRow.inventory[invi].kill();
      }
      for(var doori=0;doori<deathRow.door.length;doori++){
        deathRow.door[doori].kill();
      }
      UIService.message(deathRow.message);
      deathRow.key=[];
      deathRow.inventory = [];
      deathRow.door = [];
      deathRow.message = [];
      player.animations.stop('top_moving', true);
    };

    /**
     * Return a direction object from a string
     * @param direction {string} Can be either the short or long version of the direction's name
     * @returns {({short: string, long: string, angle: number}|boolean)} The direction object or false if none found
     */
    var resolveDirection = function(direction){
      for(var dirIdx=0;dirIdx<directions.length;dirIdx++){
        if(direction === directions[dirIdx].short || direction === directions[dirIdx].long){
          return directions[dirIdx];
        }
      }
      return false;
    };

    /**
     * Construct capabilities partly from possible directions
     * @returns {Object.<string,(Object.<string,*>|string|Array.<*>)>}
     */
    var constructCapabilities = function(){
      var caps = {
        'move': [
          'Move Gregory in a certain direction.',
          {
            direction: 'The direction in which to move Gregory'
          },
          function(direction){
            var newDirection = resolveDirection(direction);
            if(!!newDirection){
              var newZone = mapManager.findByNameIn(activeZone[newDirection.short], 'zones');
              if(!!newZone){
                player.rotation=newDirection.angle;
                movePlayerTo(newZone);
              }else{
                UIService.message(strings.noSuchZone);
              }
            }else{
              UIService.message(strings.badDirection);
            }
          },
          'go'
        ]
      };
      for(var dirIdx=0;dirIdx<directions.length;dirIdx++){
        var direction = directions[dirIdx];
        caps[direction.short] = 'move ' + direction.short;
        caps[direction.long] = 'move ' + direction.short;
      }
      return caps;
    };

    return {
      create: create,

      update: update,

      movePlayerTo: movePlayerTo,

      capabilities: constructCapabilities()
    };

  };

})(Phaser);