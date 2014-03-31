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
            directions[i].long, mapManager.findByNameIn(targetZone[directions[i].short], 'zones').short
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
        targetZone = mapManager.findByNameIn(zoneName, 'zones');

        //Check to make sure the target zone exists
        if(targetZone instanceof  Phaser.Sprite){
          if(targetZone.x === activeZone.x && targetZone.y === activeZone.y){
            examine();
            return false;
          }else{
            activeCourse = mapManager.findInPath(player, targetZone);
            //Check if objects in the way
            if(activeCourse.contains.hasOwnProperty('walls')){
              //There's a wall in the way
              UIService.message(strings.wall);
              return false;
            }else if(activeCourse.contains.hasOwnProperty('doors') && activeCourse.contains.doors.length > keys){
              //Not enough keys to continue
              UIService.message(strings.door.locked);
              return false;
            }else{
              //Begin Moving
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
      player.animations.stop('top_moving', true);
      examine();
      moving = false;
    };

    /**
     * Run on game update, every frame (MUST BE LIGHTWEIGHT)
     */
    var update = function(){
      try {
        if (moving && activeCourse.locations.hasOwnProperty(player[activeCourse.direction])) {
          for (var i = 0; i < activeCourse.locations[player[activeCourse.direction]].length; i++) {
            switch (activeCourse.locations[player[activeCourse.direction]][i].group) {
            case 'items':
              inventory.push(activeCourse.locations[player[activeCourse.direction]][i].sprite.kill());
              break;
            case 'keys':
              keys++;
              activeCourse.locations[player[activeCourse.direction]][i].sprite.kill();
              break;
            case 'events':
              //performEvent(activeCourse.locations[player[activeCourse.direction]][i].sprite.name);
              break;
            case 'doors':
              activeCourse.locations[player[activeCourse.direction]][i].sprite.kill();
              break;
            default:
              break;
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

      capabilities: constructCapabilities(),

      examine: examine
    };

  };

})(Phaser);