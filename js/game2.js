var game = new Phaser.Game(1024, 656, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.atlas('wizard', 'assets/wizard.png', 'assets/wizard.json');
    game.load.atlas('wolf', 'assets/wolf.png', 'assets/wolf.json');
    game.load.image('bg', 'assets/woods_bg.png');
    game.load.image('tree1', 'assets/woods_tree1.png');
    game.load.image('tree2', 'assets/woods_tree2.png');
    game.load.image('tree3', 'assets/woods_tree3.png');
    game.load.image('tree4', 'assets/woods_tree4.png');
    game.load.image('sRing', 'assets/selection_ring.png');
}

var wizard, sRing;
var move;
var contador = 0;


function create() {
    game.add.sprite(0, 0, 'bg');
    game.add.sprite(210, 4, 'tree2');
    game.add.sprite(675, 2, 'tree3');
    sRing = game.add.sprite(0,0,'sRing');
    wizard = game.add.sprite(100, 300, 'wizard');
    wolf = game.add.sprite(300, 300, 'wolf');
    game.add.sprite(12, 0, 'tree1');
    game.add.sprite(815, 0, 'tree4');
    //game.stage.backgroundColor = '#555';
    
    wizard.animations.add('attack', Phaser.Animation.generateFrameNames('Wizard', 0, 14, '', 4), 40, true, false);
    wizard.animations.add('idle', Phaser.Animation.generateFrameNames('Wizard', 15, 44, '', 4), 30, true, false);
    wizard.animations.add('move', Phaser.Animation.generateFrameNames('Wizard', 45, 71, '', 4), 30, true, false);

    wizard.animations.play('move', null, true);
    
    wolf.animations.add('attack', Phaser.Animation.generateFrameNames('Wolf', 0, 21, '', 4), 30, true, false);
    wolf.animations.add('move', Phaser.Animation.generateFrameNames('Wolf', 22, 37, '', 4), 30, true, false);
    wolf.animations.add('idle', Phaser.Animation.generateFrameNames('Wolf', 38, 61, '', 4), 30, true, false);
    
    wolf.animations.play('idle', null, true);
   
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
        sRing.x = wizard.x -8;
        sRing.y = wizard.y+72;
    }
//    wolf.x += 2;
//    if (wolf.x > game.width) {
//        wolf.x = -20;
//    }
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