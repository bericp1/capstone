module.exports = (function(){
  'use strict';

  var scheme = require('../../color-scheme'),
    resources = require('../../resources'),
    util = require('../../util');

  return {
    preload: function(){
      this.game.stage.backgroundColor = scheme.one;
      var loadingText = this.game.add.text(
        this.game.world.centerX,
        this.game.world.centerY,
        'LOADING',
        {
          font: 'bold 60px Fjalla One',
          fill: scheme.white,
          align: 'center'
        }
      );
      loadingText.anchor.setTo(0.5);

      //Process and load all resources
      util.loadResourcesFromObject(this.game, resources);
    },
    create: function(){
      this.game.state.start('title');
    }
  };
})();