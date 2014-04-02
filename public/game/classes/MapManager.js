module.exports = (function (Phaser) {
  'use strict';

  var MoveError = require('./MoveError');

  var MapManager = function(map){
    this.map = map;
    this.game = map.game;
    this.cache = {};
    this.groups = [];
    this.objects = {};
  };

  MapManager.prototype.addObjectLayer = function(layerName, spriteSheetName){
    if(typeof spriteSheetName !== 'string')
      throw new Error('A spritesheet name must be specified to create group from object layer.');
    var totalTiles = this.game.cache.getFrameData(spriteSheetName).total - 1,
      group = this.game.add.group(this.game.world, layerName);
    for(var idx=0; idx<=totalTiles; idx++){
      this.map.createFromObjects(layerName, idx+1, spriteSheetName, idx, true, false, group);
    }
    group.forEach(function(sprite){
      if(sprite.name === '' || typeof sprite.name !== 'string'){
        sprite.name = layerName.substr(0, 4) + Math.floor(sprite.x) + 'x' + Math.floor(sprite.y);
      }
      MapManager.fixAnchor(sprite);
    });
    this.addGroup(group);
  };

  MapManager.prototype.addObjectLayers = function(layerNames, spriteSheetName){
    if(typeof layerNames === 'string'){
      if(typeof spriteSheetName !== 'string'){
        spriteSheetName = layerNames;
        layerNames = this.map.objects;
      }else{
        layerNames = [layerNames];
      }
    }
    if(typeof layerNames === 'object' && !(layerNames instanceof Array)){
      for(var layerName in layerNames){
        if(layerNames.hasOwnProperty(layerName)){
          this.addObjectLayer(layerName,spriteSheetName);
        }
      }
    }else{
      for(var i=0;i<layerNames.length;i++){
        this.addObjectLayer(layerNames[i],spriteSheetName);
      }
    }
  };

  MapManager.prototype.addGroup = function(group){
    if(group instanceof Phaser.Group){
      this.cache[group.name] = {x:{},y:{}};
      this.groups.push(group.name);
      this.objects[group.name] = group;
      var me = this;
      group.forEach(function(sprite){
        me.addToCache(sprite, group.name);
      });
    }else{
      throw new Error('Can only add Phaser.Groups objects to MapManager');
    }
  };

  MapManager.prototype.addGroups = function(groups){
    if(typeof groups === 'object' && !(groups instanceof Array)){
      for(var groupName in groups){
        if(groups.hasOwnProperty(groupName)){
          this.addGroup(groups[groupName]);
        }
      }
    }else{
      for(var i=0;i<groups.length;i++){
        this.addGroup(groups[i]);
      }
    }
  };

  MapManager.prototype.addToCache = function(sprite, groupName){
    var by = ['x','y'];
    var yb = ['y', 'x'];
    for(var i=0;i<by.length;i++){
      if(!this.cache[groupName][by[i]].hasOwnProperty(sprite[by[i]])) {
        this.cache[groupName][by[i]][sprite[by[i]]] = {};
      }
      this.cache[groupName][by[i]][sprite[by[i]]][sprite[yb[i]]] = sprite.name;
    }
  };
  /**
   * Returns the objects in the path connecting the two sprites
   * @param player {Phaser.Sprite}
   * @param zone {Phaser.Sprite}
   * @param groups {(Array|string|*)}
   * @returns {{
   *    direction: string,
   *    objects: Array.<{name: string, group: string, distance: number, sprite: Phaser.Sprite}>,
   *    locations: Object<number,Array.<{name: string, group: string, distance: number, sprite: Phaser.Sprite}>>,
   *    contains: Object.<string,Array.<{name: string, group: string, distance: number, sprite: Phaser.Sprite}>>
   *  }}
   */
  MapManager.prototype.findInPath = function(player, zone, groups){
    if(player instanceof Phaser.Sprite && zone instanceof Phaser.Sprite){
      if(typeof groups === 'string'){
        groups = [groups];
      }else if(typeof groups === 'undefined'){
        groups = this.groups;
      }

      var mainParam, checkParam;
      if(player.x === zone.x && player.y !== zone.y){
        mainParam = 'x';
        checkParam = 'y';
      }else if(player.x !== zone.x && player.y === zone.y){
        mainParam = 'y';
        checkParam = 'x';
      }else if(player.x !== zone.x && player.y !== zone.y){
        throw new MoveError(player.x, player.y, zone.x, zone.y);
      }else{
        return {};
      }

      var objects = [];
      var locations = {};
      var contains = {};
      for(var groupIndex=0;groupIndex<groups.length;groupIndex++){
        var groupName = groups[groupIndex];
        if(this.cache[groupName][mainParam].hasOwnProperty(player[mainParam])){
          for(var spriteLocation in this.cache[groupName][mainParam][player[mainParam]]){
            if(this.cache[groupName][mainParam][player[mainParam]].hasOwnProperty(spriteLocation)){
              var offsetFromPlayer = (spriteLocation - player[checkParam]);
              if((offsetFromPlayer * (spriteLocation - zone[checkParam])) <= 0){
                //In between zone and player. In the way!!!!
                var spriteName = this.cache[groupName][mainParam][player[mainParam]][spriteLocation],
                  sprite = this.findByNameIn(spriteName, groupName);
                if(sprite.visible) {
                  var objectInfo = {name: spriteName, group: groupName, distance: Math.abs(offsetFromPlayer), sprite: sprite};
                  objects.push(objectInfo);
                  if(!locations.hasOwnProperty(sprite[checkParam])) locations[sprite[checkParam]] = [];
                  locations[sprite[checkParam]].push(objectInfo);
                  if(!contains.hasOwnProperty(groupName)) contains[groupName] = [];
                  contains[groupName].push(objectInfo);
                }
              }
            }
          }
        }
      }
      objects.sort(MapManager.sortByDistance);
      return {direction: checkParam, objects: objects, locations: locations, contains: contains};
    }
  };

  /**
   * Return a sprite by searching for its name within a group
   * @param name {string}
   * @param group {Phaser.Group|string}
   * @returns {*}
   */
  MapManager.prototype.findByNameIn = function(name, group){
    if(name instanceof Phaser.Sprite) return name;
    if(typeof group === 'string') group = this.objects[group];
    for(var i=0; i<group.children.length; i++){
      if(group.children[i].name === name){
        return group.children[i];
      }
    }
    return false;
  };

  MapManager.fixAnchor = function(sprite){
    sprite.anchor.setTo(0.5);
    sprite.x += 60;
    sprite.y += 60;
  };

  MapManager.sortByDistance = function(a,b){
    if(a.distance<b.distance){
      return -1;
    }else if(a.distance>b.distance){
      return 1;
    }else{
      return 0;
    }
  };

  return MapManager;

})(Phaser);