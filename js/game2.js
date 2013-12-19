var game = new Phaser.Game(1024, 656, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.atlas('wizard', 'assets/wizard.png', 'assets/wizard.json');
    game.load.image('fondo', 'assets/bosque_fondo.png');
    game.load.image('arbol1', 'assets/bosque_arbol1.png');
    game.load.image('arbol2', 'assets/bosque_arbol2.png');
    game.load.image('arbol3', 'assets/bosque_arbol3.png');
    game.load.image('arbol4', 'assets/bosque_arbol4.png');
}

var wizard;
var move;
var contador = 0;


function create() {
    game.add.sprite(0, 0, 'fondo');
    
    game.add.sprite(210, 4, 'arbol2');
    game.add.sprite(675, 2, 'arbol3');
    wizard = game.add.sprite(100, 300, 'wizard');
    game.add.sprite(12, 0, 'arbol1');
    game.add.sprite(815, 0, 'arbol4');
    //game.stage.backgroundColor = '#555';
    
    wizard.animations.add('attack', Phaser.Animation.generateFrameNames('Wizard', 0, 14, '', 4), 40, true, false);
    wizard.animations.add('idle', Phaser.Animation.generateFrameNames('Wizard', 15, 44, '', 4), 30, true, false);
    wizard.animations.add('move', Phaser.Animation.generateFrameNames('Wizard', 45, 71, '', 4), 30, true, false);

    wizard.animations.play('move', null, true);

    move = true;
    
    wizard.inputEnabled = true;
//    wizard.input.pixelPerfect = true;
    wizard.input.useHandCursor = true;
    wizard.events.onInputDown.add(changeAnimation, this);
}

function update() {
    if (move === true) {
        wizard.x += 1;
        if (wizard.x > game.width) {
            wizard.x = -20;
        }
    }
}

function changeAnimation() {
    var animations = ['attack', 'idle', 'move'];
    contador = (contador + 1) % 3;
    wizard.animations.play(animations[contador], null, true);
    if (contador === 2) {
        move = true;
    } else {
        move = false;
    }
}

function render() {
//    game.debug.renderSpriteInputInfo(wizard, 32, 32);
//    game.debug.renderSpriteBounds(wizard);
//    game.debug.renderPoint(wizard.input._tempPoint);
}