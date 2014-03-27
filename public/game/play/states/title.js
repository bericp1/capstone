module.exports = (function () {
  'use strict';

  var style = require('../../style'),
    strings = require('../../strings').title;

  return {
    /**
     * On state load/create
     * @this {{game:Phaser.Game}}
     */
    create: function(){
      this.game.stage.backgroundColor = style.color.white;

      var titleText = this.game.add.text(
        this.game.world.centerX,
        100,
        strings.title,
        {
          font: 'bold 50px ' + style.font.title,
          fill: style.color.dark,
          align: 'center'
        }
      );
      titleText.anchor.setTo(0.5);

      var blinkingPlayer = this.game.add.sprite(this.game.world.centerX, 150, 'player_front_blink');
      blinkingPlayer.anchor.setTo(0.5, 0);
      blinkingPlayer.scale.setTo(0.35);
      blinkingPlayer.animations.add('blink',
        [
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,1,2,3,4,5,
          6,6,6,7,8,9,10,11,12
        ], 20, true);
      blinkingPlayer.animations.play('blink');

      var startText = this.game.add.text(
        this.game.world.centerX,
        435,
        strings.start,
        {
          font: '30px ' + style.font.regular,
          fill: style.color.dark,
          align: 'center'
        }
      );
      startText.anchor.setTo(0.5);

      var startCommandsText = this.game.add.text(
        this.game.world.centerX,
        510,
        strings.startCommands,
        {
          font: '26px ' + style.font.regular,
          fill: style.color.dark,
          align: 'center'
        }
      );
      startCommandsText.anchor.setTo(0.5);
    }
  };
})();