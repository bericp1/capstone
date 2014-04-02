module.exports = (function (Phaser) {
  'use strict';

  return function(UIService){

    var style = require('../../style'),
      strings = require('../../strings').map,
      MapManager = require('../../classes/MapManager'),
      Twine = require('../../classes/Twine');

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
     * Cursors for movement with keyboard_keys item
     * @type {Phaser.CursorKeys}
     */
    var cursors;

    /**
     * @type {Phaser.Tilemap}
     */
    var map;

    /**
     * @type {MapManager}
     */
    var mapManager;

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
     * Tween to manage the movement of the player
     * @type {Phaser.Tween}
     */
    var moveTween;

    /**
     * The speed at which the player should travel when omving.
     * Measured in pixels/ms
     * @type {number}
     */
    var speed = 250/1000;

    /**
     * Will be true when the player is being moved. Blocks moving when true.
     * @type {boolean}
     */
    var moving = false;

    /**
     * The active course of movement as returned by MapManager#findInPath
     * @type {{
     *    direction: string,
     *    objects: Array.<{name: string, group: string, distance: number, sprite: Phaser.Sprite}>,
     *    locations: Object<number,Array.<{name: string, group: string, distance: number, sprite: Phaser.Sprite}>>,
     *    contains: Object.<string,Array.<{name: string, group: string, distance: number, sprite: Phaser.Sprite}>>
     *  }}
     */
    var activeCourse = null;

    /**
     * The zone that the player currently occupies. Null when moving
     * @type {Phaser.Tween}
     */
    var activeZone = null;

    /**
     * The zone that the player is moving towards. Is null when not moving
     * @type {Phaser.Tween}
     */
    var targetZone = null;

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

    var preload = function(){
      keys = 0;
      inventory = [];
      moving = false;
      targetZone = null;
      activeZone = null;
      activeCourse = null;
    };

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

      cursors = game.input.keyboard.createCursorKeys();
    };

    /**
     * Output the current zones details
     * @param zone {Phaser.Sprite|*} Zone to examine or null for activeZone
     */
    var examine = function(zone){
      if(!(zone instanceof Phaser.Sprite)) zone = activeZone;
      var messages = [];
      messages.push(new Twine(zone.long, {color: style.color.one, weight: 'bold'}));
      for(var i=0;i<directions.length;i++){
        if(zone.hasOwnProperty(directions[i].short)){
          messages.push(new Twine(strings.surroundings(
            directions[i].long, mapManager.findByNameIn(zone[directions[i].short], 'zones').short
          ), {color: style.color.one}));
        }
      }
      UIService.message(messages);
    };

    /**
     * Moves player to a certain zone
     * @param zoneName {string|Phaser.Sprite} Zone to move player to
     * @return {boolean} True if movement began, false otherwise (something in the way, not enough keys, etc.)
     */
    var movePlayerTo = function(zoneName){
      if(!moving){
        var zone = mapManager.findByNameIn(zoneName, 'zones');

        //Check to make sure the target zone exists
        if(zone instanceof  Phaser.Sprite){
          if(zone.x === activeZone.x && zone.y === activeZone.y){
            examine();
            return false;
          }else{
            var course = mapManager.findInPath(player, zone, ['walls','doors','events']);
            //Check if objects in the way
            if(course.contains.hasOwnProperty('walls')){
              //There's a wall in the way
              UIService.message(strings.wall);
              return false;
            }else if(course.contains.hasOwnProperty('doors') && course.contains.doors.length > keys){
              //Not enough keys to continue
              UIService.message(strings.door.locked);
              return false;
            }else{
              //Begin Moving
              targetZone = zone;
              activeCourse = course;
              player.animations.play('top_moving');
              moving = true;
              var props = {},
                time = (Math.abs(player[activeCourse.direction]-targetZone[activeCourse.direction])/speed);
              props[activeCourse.direction] = targetZone[activeCourse.direction];
              moveTween = game.add.tween(player);
              moveTween.onComplete.add(doneMovingPlayer, this);
              moveTween.to(props, time, Phaser.Easing.Linear.None);
              moveTween.start();
              activeZone = null;
              return true;
            }
          }
        }else{
          throw new Error('The zone \'' + zoneName + ' does not exist. Cannot move player there.');
        }
      }else{
        return false;
      }
    };

    /**
     * Callback run when player is done moving
     */
    var doneMovingPlayer = function(){
      activeZone = targetZone;
      targetZone = null;
      activeCourse = null;
      player.animations.stop('top_moving');
      player.frame = 0;
      examine();
      moving = false;
    };

    /**
     * Run on game update, every frame (MUST BE LIGHTWEIGHT)
     */
    var update = function(){
      try {
        if (moving) {
          for (var i = 0; i < activeCourse.objects.length; i++) {
            if(player.overlap(activeCourse.objects[i].sprite) && !!activeCourse.objects[i].sprite.visible && !!player.visible){
              switch (activeCourse.objects[i].group) {
              case 'events':
                UIService.run(activeCourse.objects[i].sprite.command, true);
                break;
              case 'doors':
                keys--;
                activeCourse.objects[i].sprite.kill();
                break;
              default:
                break;
              }
              UIService.refresh();
            }
          }
        }
      }catch(error){if(typeof console === 'object'){console.error(error);}}
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

    var friendlyMove = function(direction){
      if(!moving){
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
      }else{
        UIService.message(strings.stillMoving);
      }
    };

    var pickup = function(item){
      var surroundingItems, groups = ['keys', 'items'];
      if(typeof item === 'string'){
        if(item === 'key' || item === 'keys'){
          groups = ['keys'];
          item = null;
        }else if(item === 'item' || item === 'items'){
          groups = ['items'];
          item = null;
        }
      }
      var add = function(toAdd){
        if(toAdd.group === 'keys'){
          keys++;
          toAdd.sprite.kill();
        }else if(toAdd.group === 'items'){
          inventory.push(toAdd.sprite.kill());
        }
        UIService.refresh();
      };
      surroundingItems = mapManager.findAroundPlayer(player, groups);
      if(surroundingItems.objects.length > 0){
        var result = [];
        for(var i=0;i<surroundingItems.objects.length;i++){
          var obj = surroundingItems.objects[i];
          if(typeof item === 'string'){
            if(item === obj.name){
              result.push(obj);
              add(obj);
            }
          }else{
            result.push(obj);
            add(obj);
          }
        }
        if(result.length>0){
          return result;
        }else{
          return false;
        }
      }else{
        return false;
      }
    };

    var friendlyPickup = function(item){
      var pickedUpItems = pickup(item);
      if(!!pickedUpItems){
        for(var i=0;i<pickedUpItems.length;i++){
          var info = pickedUpItems[i];
          if(info.group === 'keys'){
            UIService.message(strings.key);
          }else{
            UIService.message(strings.item[info.name]);
          }
        }
      }else{
        UIService.message(strings.noPickup);
      }
    };

    var friendlyKill = function(toKill){
      if(toKill === 'gregory'){
        player.kill();
        if(typeof moveTween === 'object') moveTween.stop();
        UIService.message('Gregory is dead!!! Why?!?!?!?');
        setTimeout(function(){
          game.state.start('dead');
        }, 2000);
      }
    };

    var win = function(){
      game.state.start('win');
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
          friendlyMove,
          'go'
        ],
        'pickup': [
          'Pickup items around or beneath you.',
          {
            item: 'A specific item or type of items to pickup'
          },
          friendlyPickup,
          'grab'
        ],
        'kill': [
          'Kill someone or something.',
          {
            '(someone or something)': 'The person or thing to kill'
          },
          friendlyKill,
          'murder'
        ],
        'die': 'kill Gregory',
        'lose': 'kill Gregory',
        'win': {
          description: 'Win the game.',
          action: win,
          admin: true
        }
      };
      for(var dirIdx=0;dirIdx<directions.length;dirIdx++){
        var direction = directions[dirIdx];
        caps[direction.short] = 'move ' + direction.short;
        caps[direction.long] = 'move ' + direction.short;
      }
      return caps;
    };

    return {
      preload: preload,

      create: create,

      update: update,

      movePlayerTo: movePlayerTo,

      capabilities: constructCapabilities(),

      examine: examine,

      getKeys: function(){
        return keys;
      },

      setKeys: function(){
        if(typeof arguments[0] === 'number')
          keys = arguments[0];
      },

      getInventory: function(){
        return keys;
      },

      setInventory: function(){
        if(arguments[0] instanceof Array)
          inventory = arguments[0];
      }
    };

  };

})(Phaser);