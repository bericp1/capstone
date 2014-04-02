module.exports = function (UIService) {
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

      var titleBackgroundMusic = this.game.add.audio('main_bg', 1, true);
      titleBackgroundMusic.play();

      var titleText = this.game.add.text(
        this.game.world.centerX,
        150,
        strings.title,
        {
          font: 'bold 50px ' + style.font.title,
          fill: style.color.dark,
          align: 'center'
        }
      );
      titleText.anchor.setTo(0.5);

      var blinkingPlayer = this.game.add.sprite(this.game.world.centerX, 200, 'player_front_blink');
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

      var authorText = this.game.add.text(
        this.game.world.centerX,
        485,
        strings.author,
        {
          font: '30px ' + style.font.regular,
          fill: style.color.dark,
          align: 'center'
        }
      );
      authorText.anchor.setTo(0.5);

      var nameText = this.game.add.text(
        this.game.world.centerX + 66,
        485,
        'Brandon Phillips',
        {
          font: '31px ' + style.font.regular,
          fill: style.color.one,
          align: 'center'
        }
      );
      nameText.anchor.setTo(0.5);

      UIService.run('help');

//      var startText = this.game.add.text(
//        this.game.world.centerX,
//        435,
//        strings.start,
//        {
//          font: '30px ' + style.font.regular,
//          fill: style.color.dark,
//          align: 'center'
//        }
//      );
//      startText.anchor.setTo(0.5);
//
//      var startCommandsText = this.game.add.text(
//        this.game.world.centerX,
//        510,
//        strings.startCommands,
//        {
//          font: '26px ' + style.font.regular,
//          fill: style.color.dark,
//          align: 'center'
//        }
//      );
//      startCommandsText.anchor.setTo(0.5);
    },

    capabilities: {
      'start': [
        'Start the game.',
        {},
        function(){
          this.game.state.start('map');
        },
        'go'
      ],
      'load': [
        'Load a saved game.',
        {
          'id': 'ID of save to load'
        },
        function(saveID){
          console.log('LOADING!!!', 'Save ID:', saveID);
        }
      ]
    }
  };
};