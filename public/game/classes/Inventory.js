module.exports = (function (Phaser) {
  'use strict';

  var Inventory = function(inventory){
    if(inventory instanceof Array){
      this.inventory = inventory;
    }else if(inventory instanceof Phaser.Sprite){
      this.inventory = [inventory];
    }else{
      this.inventory = [];
    }
  };

  Inventory.prototype.add = function(item){
    if(item instanceof Array){
      for(var i=0;i<item.length;i++){
        this.add(item[i]);
      }
    }
    if(item instanceof Phaser.Sprite){
      this.inventory.push(item);
    }
  };

  return Inventory;
})(Phaser);