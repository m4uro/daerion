Daerion.Necromancer = function (game, x, y, key) {
    
    Phaser.Sprite.call(this, game, x, y, key);
    
    this.animations.add('attack', Phaser.Animation.generateFrameNames('Necromancer', 0, 15, '', 4), 30, true, false);
    this.animations.add('move', Phaser.Animation.generateFrameNames('Necromancer', 16, 41, '', 4), 30, true, false);
    this.animations.add('idle', Phaser.Animation.generateFrameNames('Necromancer', 42, 62, '', 4), 30, true, false);
    this.animations.add('death', Phaser.Animation.generateFrameNames('Necromancer', 63, 87, '', 4), 24, true, false);
    this.animations.add('hit', Phaser.Animation.generateFrameNames('Necromancer', 88, 97, '', 4), 24, true, false);
    this.animations.add('bolt', Phaser.Animation.generateFrameNames('Necromancer', 98, 122, '', 4), 24, true, false);
    this.animations.add('heal', Phaser.Animation.generateFrameNames('Necromancer', 123, 144, '', 4), 24, true, false);
    
    this.animations.play('idle', null, true);
    
    this.body.setRectangle(40, 30, 22, 85);
    this.inputEnabled = true;
    this.input.pixelPerfect = true;
    this.input.useHandCursor = true;
    this.anchor.setTo(0.32, 0.93);
    this.isPC = false;
    this.timer = game.time.create(false);
    this.attackInterval = 1000; //milliseconds
    this.range = 40;
    this.maxHealth = 300;
    this.health = this.maxHealth;
    this.attackDamage = 20;
    this.offsetX = 0;
    this.offsetY = 0;
    this.speed = 100;
    this.events.onInputDown.add(getSelectionRing);
    this.healCoolDown = 3000;
    this.boltCoolDown = 3000;
    this.minions = [];
    this.healPower = 15;
    this.isLeader = true;
};

Daerion.Necromancer.prototype = Object.create(Phaser.Sprite.prototype);
Daerion.Necromancer.prototype.constructor = Daerion.Necromancer;

Daerion.Necromancer.prototype.bolt = function (target) {
    if ((this.timeOfLastAttack === undefined) || (game.time.elapsedSince(this.timeOfLastAttack) > this.boltCoolDown)) {
        this.animations.play('bolt', null, false);
        this.body.velocity.setTo(0, 0);
        this.isMoving = false;
        this.chasing = null;
        var offsetX = 95;
        if (target.x > this.x) {
            this.scale.x = 1;
        }
        else {
            this.scale.x = -1;
            offsetX = -95;
        }
        this.timeOfLastAttack = game.time.now;
        game.time.events.add(700, function () { 
            var powerAnimation = bolts.getFirstDead();
            powerAnimation.reset(this.x + offsetX, this.y - 35);
            powerAnimation.play('bolt', null, true);
            game.physics.moveToXY(powerAnimation, target.x, target.y - 20, 500);
            powerAnimation.rotation = game.physics.angleBetween(powerAnimation, target);
        }, this);
    }
};

Daerion.Necromancer.prototype.heal = function (target) {
    if ((this.timeOfLastHeal === undefined) || (game.time.elapsedSince(this.timeOfLastHeal) > this.healCoolDown)) {
        this.animations.play('heal', null, false);
        this.body.velocity.setTo(0, 0);
        this.isMoving = false;
        this.chasing = null;
        
        this.timeOfLastHeal = game.time.now;
        (target.x > this.x) ? this.scale.x = 1 : this.scale.x = -1;
        target.health = (target.health + this.healPower > target.maxHealth) ? target.maxHealth : target.health + this.healPower;
        var e = effects.getFirstDead();
        if (e) {
            e.reset(target.x, target.y);
            e.play('heal', null, false, true);
        }
    }
};

Daerion.Necromancer.prototype.hasMinions = function () {
    for (i = 0; i < this.minions.length; i += 1) {
        if (this.minions[i].alive) {
            return true;
        }
    }
    return false;
};

Daerion.Necromancer.prototype.think = function () {
    var i, distance, c, p, chosen;
    distance = Infinity;
    this.threat = null;
    if (this.hasMinions()) {
        if (this.health <= this.maxHealth / 4) { //necromancer has low health and is being attacked
            for (i = 0; i < characters.length; i += 1) {
                c = characters[i];
                if (c.isPC && c.alive && c.chasing === this && game.physics.distanceBetween(this, c) < distance){
                    distance = game.physics.distanceBetween(this, c);
                    this.threat = c;
                }
            }
            if (this.threat) {
                this.evade();
            }
        }
        else {
            for (i = 0; i < this.minions.length; i += 1) {
                c = this.minions[i];
                if (c.alive && c.health < c.maxHealth/4) {
                    this.heal(c);
                    return;
                }
            }
            //has minions and has to choose who to attack
            p = {
                close: 10,
                vulnerable: 30,
                strong: 5
            };
            chosen = choose(this, p);
            if (chosen && game.physics.distanceBetween(this, chosen) > 100) {
                this.bolt(chosen);
            }
            else {
                this.chasing = chosen;
            }
            for (i = 0; i < this.minions.length; i += 1) {
                c = this.minions[i];
                if (c.alive) {
                    c.parameters.vulnerable = 50; //alters minion behavior
                }
            }
        }
    }
    else {
        p = {
            close: 20,
            vulnerable: 15,
            strong: 10
        };
        chosen = choose(this, p);
        if (chosen && game.physics.distanceBetween(this, chosen) > 100) {
            this.bolt(chosen);
        }
        else {
            this.chasing = chosen;
        }
    }
};