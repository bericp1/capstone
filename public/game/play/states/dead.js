module.exports = (function () {
  'use strict';

  var strings = require('../../strings').dead,
    style = require('../../style');

  return {
    create: function(){
      this.game.world.width = this.game.canvas.width;
      this.game.world.height = this.game.canvas.height;
      this.game.camera.reset();
      this.game.stage.backgroundColor = style.color.three;
      var deadText = this.game.add.text(
        this.game.world.centerX,
        200,
        strings.gregory,
        {
          font: 'bold 60px ' + style.font.regular,
          fill: style.color.white,
          align: 'center'
        }
      );
      deadText.anchor.setTo(0.5);
      this.game.stage.backgroundColor = style.color.three;
      var face = this.game.add.text(
        this.game.world.centerX,
        320,
        strings.face,
        {
          font: 'bold 85px ' + style.font.regular,
          fill: style.color.white,
          align: 'center'
        }
      );
      face.anchor.setTo(0.5);
      this.game.stage.backgroundColor = style.color.three;
      var instructions = this.game.add.text(
        this.game.world.centerX,
        430,
        strings.instructions,
        {
          font: 'bold 20px ' + style.font.regular,
          fill: style.color.white,
          align: 'center'
        }
      );
      instructions.anchor.setTo(0.5);
    },
    capabilities: {
      'revive': function(){this.game.state.start('map');}
    }
  };
})();