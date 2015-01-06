Daerion.Wolf = function (game, x, y, key) {
    
    Phaser.Sprite.call(this, game, x, y, key);
    
    this.animations.add('attack', Phaser.Animation.generateFrameNames('Wolf', 0, 21, '', 4), 30, true, false);
    this.animations.add('move', Phaser.Animation.generateFrameNames('Wolf', 22, 37, '', 4), 30, true, false);
    this.animations.add('idle', Phaser.Animation.generateFrameNames('Wolf', 38, 61, '', 4), 30, true, false);
    this.animations.add('death', Phaser.Animation.generateFrameNames('Wolf', 62, 89, '', 4), 24, true, false);
    this.animations.add('hit', Phaser.Animation.generateFrameNames('Wolf', 90, 100, '', 4), 24, true, false);
    
    this.animations.play('idle', null, true);
    
    this.body.setRectangle(50, 30, 46, 70);
    this.inputEnabled = true;
    this.input.pixelPerfect = true;
    this.input.useHandCursor = true;
    this.anchor.setTo(0.5, 0.88);
    this.isPC = false;
    this.timer = game.time.create(false);
    this.attackInterval = 1000; //milliseconds
    this.range = 60;
    this.maxHealth = 350;
    this.health = this.maxHealth;
    this.attackDamage = 50;
    this.offsetX = -3;
    this.offsetY = -5;
    this.speed = 200;
    this.events.onInputDown.add(getSelectionRing);
    this.parameters = {
        close: 15,
        vulnerable: 5,
        strong: 10
    };
    characters.push(this);
    elements.add(this);
};

Daerion.Wolf.prototype = Object.create(Phaser.Sprite.prototype);
Daerion.Wolf.prototype.constructor = Daerion.Wolf;

Daerion.Wolf.prototype.think = function () {
    if (this.leader.alive) {
        if (this.leader.threat) {
            this.chasing = this.leader.threat;
        }
        else if (this.health < this.maxHealth / 4) {
            this.evade();
        }
        else {
            this.chasing = choose(this, this.parameters);
        }
    }
    else {
        this.chasing = choose(this, this.parameters);
    }
};

Daerion.Wolf.prototype.restoreParameters = function restoreParameters() {
    this.parameters = {
        close: 15,
        vulnerable: 5,
        strong: 10
    };
};