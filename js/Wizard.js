Daerion.Wizard = function (game, x, y, key) {
    
    Phaser.Sprite.call(this, game, x, y, key);
    
    this.animations.add('attack', Phaser.Animation.generateFrameNames('Wizard', 0, 19, '', 4), 30, true, false);
    this.animations.add('idle', Phaser.Animation.generateFrameNames('Wizard', 20, 49, '', 4), 30, true, false);
    this.animations.add('move', Phaser.Animation.generateFrameNames('Wizard', 50, 76, '', 4), 30, true, false);
    this.animations.add('hit', Phaser.Animation.generateFrameNames('Wizard', 77, 86, '', 4), 24, true, false);
    this.animations.add('death', Phaser.Animation.generateFrameNames('Wizard', 87, 103, '', 4), 24, true, false);
    this.animations.add('fireball', Phaser.Animation.generateFrameNames('Wizard', 104, 132, '', 4), 24, true, false);

    this.animations.play('idle', null, true);

    this.body.setRectangle(40, 30, 15, 65);
    this.inputEnabled = true;
    this.input.pixelPerfect = true;
    this.input.useHandCursor = true;
    this.anchor.setTo(0.35, 0.8); //anchor exacto: (regPoint.x/sourceSize.w, regPoint.y/sourceSize.h)
    this.isPC = true;
    this.timer = game.time.create(false);
    this.attackInterval = 1000; //milliseconds
    this.range = 40;
    this.maxHealth = 1000;
    this.health = this.maxHealth;
    this.attackDamage = 20;
    this.offsetX = 0;
    this.offsetY = 0;
    this.speed = 100;
    this.events.onInputDown.add(getSelectionRing);
    
    game.add.sprite(Daerion.bg.width - 96, 16, 'iconWizard');
    this.healthBar = game.add.sprite(Daerion.bg.width - 90, 93, 'red');
    this.healthBar.width = 71;
    this.healthBar.height = 0;
    this.healthBar.alpha = 0.5;
    this.healthBar.anchor.setTo(0, 1);
};

Daerion.Wizard.prototype = Object.create(Phaser.Sprite.prototype);
Daerion.Wizard.prototype.constructor = Daerion.Wizard;