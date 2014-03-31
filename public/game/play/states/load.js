module.exports = (function(){
  'use strict';

  var style = require('../../style'),
    strings = require('../../strings').load,
    resources = require('../../resources'),
    util = require('../../util');

  return {
    preload: function(){
      this.game.stage.backgroundColor = style.color.one;
      this.game.sound.volume = 0.4;
      var loadingText = this.game.add.text(
        this.game.world.centerX,
        this.game.world.centerY,
        strings.loading,
        {
          font: 'bold 60px ' + style.font.regular,
          fill: style.color.white,
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