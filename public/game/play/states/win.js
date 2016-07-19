module.exports = (function () {
  'use strict';

  var strings = require('../../strings').win,
    style = require('../../style');

  return {
    create: function(){
      this.game.world.width = this.game.canvas.width;
      this.game.world.height = this.game.canvas.height;
      this.game.camera.reset();
      this.game.stage.backgroundColor = style.color.one;
      var congratsText = this.game.add.text(
        this.game.world.centerX,
        200,
        strings.congrats,
        {
          font: 'bold 60px ' + style.font.regular,
          fill: style.color.white,
          align: 'center'
        }
      );
      congratsText.anchor.setTo(0.5);
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
      var gregory = this.game.add.text(
        this.game.world.centerX,
        430,
        strings.gregory,
        {
          font: 'bold 20px ' + style.font.regular,
          fill: style.color.white,
          align: 'center'
        }
      );
      gregory.anchor.setTo(0.5);
    }
  };
})();