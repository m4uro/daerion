Daerion.Fighter = function (game, x, y, key) {
    
    Phaser.Sprite.call(this, game, x, y, key);
    
    this.animations.add('attack', Phaser.Animation.generateFrameNames('Fighter', 0, 17, '', 4), 40, true, false);
    this.animations.add('move', Phaser.Animation.generateFrameNames('Fighter', 18, 45, '', 4), 30, true, false);
    this.animations.add('idle', Phaser.Animation.generateFrameNames('Fighter', 46, 66, '', 4), 24, true, false);
    this.animations.add('death', Phaser.Animation.generateFrameNames('Fighter', 67, 86, '', 4), 24, true, false);
    this.animations.add('hit', Phaser.Animation.generateFrameNames('Fighter', 87, 96, '', 4), 24, true, false);

    this.animations.play('idle', null, true);

    this.body.setRectangle(40, 30, 20, 73);
    this.inputEnabled = true;
    this.input.pixelPerfect = true;
    this.input.useHandCursor = true;
    this.anchor.setTo(0.37, 0.88); //anchor exacto: (regPoint.x/sourceSize.w, regPoint.y/sourceSize.h)
    this.isPC = true;
    this.timer = game.time.create(false);
    this.attackInterval = 1000; //milliseconds
    this.range = 40;
    this.maxHealth = 1200;
    this.health = this.maxHealth;
    this.attackDamage = 30;
    this.offsetX = 0;
    this.offsetY = 0;
    this.speed = 120;
    this.events.onInputDown.add(getSelectionRing);
    
    game.add.sprite(Daerion.bg.width - 96, 109, 'iconFighter');
    this.healthBar = game.add.sprite(Daerion.bg.width - 90, 186, 'red');
    this.healthBar.width = 71;
    this.healthBar.height = 0;
    this.healthBar.alpha = 0.5;
    this.healthBar.anchor.setTo(0, 1);
};

Daerion.Fighter.prototype = Object.create(Phaser.Sprite.prototype);
Daerion.Fighter.prototype.constructor = Daerion.Fighter;