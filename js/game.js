var game = new Phaser.Game(1024, 656, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.atlas('wizard', 'assets/prueba.png', 'assets/prueba.json');
    game.load.atlas('wolf', 'assets/wolf.png', 'assets/wolf.json');
    game.load.image('bg', 'assets/woods_bg.png');
    game.load.image('tree1', 'assets/woods_tree1.png');
    game.load.image('tree2', 'assets/woods_tree2.png');
    game.load.image('tree3', 'assets/woods_tree3.png');
    game.load.image('tree4', 'assets/woods_tree4.png');
    game.load.image('sRing', 'assets/selection_ring.png');
    game.load.image('buttonF', 'assets/button_fire.png');
    game.load.image('buttonL', 'assets/button_lightning.png');
    game.load.image('buttonP', 'assets/button_pause.png');
    game.load.image('iconWizard', 'assets/icon_wizard.png');
    game.load.bitmapFont('agency', 'assets/agency.png', 'assets/agency.xml');
}

var wizard, sRing;
var move, bg;
var contador = 0;
var g;
var text;

function create() {
    
    bg = game.add.sprite(0, 0, 'bg');
    game.add.sprite(210, 4, 'tree2');
    game.add.sprite(675, 2, 'tree3');
    sRing = game.add.sprite(0, 0, 'sRing');
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
    
    wolf.animations.play('move', null, true);
   
    move = true;
    
    wizard.inputEnabled = true;
//    wizard.input.pixelPerfect = true;
    wizard.input.useHandCursor = true;
    wizard.events.onInputDown.add(changeAnimation, this);
    
    wolf.inputEnabled = true;
    wolf.input.useHandCursor = true;
    
    wizard.offsetX = -11;
    wizard.offsetY = 0;
    wolf.offsetX = 3;
    wolf.offsetY = -10;

    wizard.events.onInputDown.add(getSelectionRing);
    wolf.events.onInputDown.add(getSelectionRing);
    
    //Drawing transparent rectangles for bottom interface:
    g = game.add.graphics(0,0);
    g.fillColor = 0x000000;
    g.fillAlpha = 0.53;
    g.drawRect(0, bg.height - 68, bg.width, 68);
    g.fillColor = 0xffffff;
    g.fillAlpha = 0.72;
    g.drawRect(25, bg.height - 48, bg.width - 50, 28);
    game.add.sprite(20, bg.height- 56, 'buttonP');
    game.add.sprite(400, bg.height- 56, 'buttonF');
    game.add.sprite(450, bg.height- 56, 'buttonL');
    game.add.sprite(bg.width - 65, bg.height- 56, 'buttonP');
    boton = game.add.sprite(bg.width- 96, 16 , 'iconWizard');
    boton.inputEnabled = true;
    boton.input.enableDrag();
    
    //Interface text:
    text = game.add.bitmapText(100, bg.height - 50, 'Daerion', { font: '32px AgencyFB', align: 'center' });
}

function getSelectionRing(target) {
    sRing.scale.x = target.width/80;
    sRing.x = target.x + (target.width - sRing.width)/2 + target.offsetX;
    sRing.y = target.y + target.height - sRing.height/2 + target.offsetY;
    sRing.selected = target;
}

function update() {
    if (move === true) {
        wizard.x += 1;
        if (wizard.x > game.width) {
            wizard.x = -20;
        }
        if (sRing.selected === wizard) {
//            sRing.x = wizard.x -8;
            getSelectionRing(wizard);
//            sRing.x = wizard.x + wizard.width/2 - 33;
//            sRing.y = wizard.y + wizard.height - 12;
//            sRing.y = wizard.y+72;
        }
    }
    wolf.x += 2;
    if (wolf.x > game.width) {
        wolf.x = -20;
    }
    if (sRing.selected === wolf) {
            getSelectionRing(wolf);
    }
//    if (game.input.mousePointer.isDown)
//    {
//        //  400 is the speed it will move towards the mouse
//        game.physics.moveToPointer(wizard, 100);
//
//        //  if it's overlapping the mouse, don't move any more
//        if (Phaser.Rectangle.contains(wizard.body, game.input.x, game.input.y))
//        {
//            wizard.body.velocity.setTo(0, 0);
//        }
//    }
//    else {
//        wizard.body.velocity.setTo(0,0);
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
//    game.debug.renderSpriteInputInfo(boton, 32, 32);
//    game.debug.renderSpriteBounds(wizard);
//    game.debug.renderSpriteBounds(wolf);
//    game.debug.renderPoint(wizard.input._tempPoint);
    
}