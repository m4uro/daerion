var game = new Phaser.Game(1024, 656, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.atlas('wizard', 'assets/wizard.png', 'assets/wizard.json');
    game.load.atlas('fighter', 'assets/fighter.png', 'assets/fighter.json');
    game.load.atlas('wolf', 'assets/wolf.png', 'assets/wolf.json');
    game.load.atlas('necromancer', 'assets/necromancer.png', 'assets/necromancer.json');
    game.load.atlas('powers', 'assets/powers.png', 'assets/powers.json');
    game.load.image('bg', 'assets/woods_bg.png');
    game.load.image('tree1', 'assets/woods_tree1.png');
    game.load.image('tree2', 'assets/woods_tree2.png');
    game.load.image('tree3', 'assets/woods_tree3.png');
    game.load.image('tree4', 'assets/woods_tree4.png');
    game.load.image('sRing', 'assets/selection_ring.png');
    game.load.image('iconWizard', 'assets/icon_wizard.png');
    game.load.image('iconFighter', 'assets/icon_fighter.png');
    game.load.image('red', 'assets/red.png');
    game.load.bitmapFont('agency', 'assets/agency.png', 'assets/agency.xml');
    game.load.spritesheet('buttonF', 'assets/button_fire.png', 42, 42);
    game.load.spritesheet('buttonL', 'assets/button_lightning.png', 42, 42);
    game.load.spritesheet('buttonP', 'assets/button_pause.png', 42, 42);
}

var wizard, wolf, fighter, necromancer, sRing, mode, doNotProcess, fireballs, bolts;
var move, bg;
var contador = 0;
var g;
var text;
var elements;
var trees = [];
var characters = [];
var spots = [];

function create() {
    var i;
    
    spots.push(new Phaser.Point(125, 292));
    spots.push(new Phaser.Point(462, 313));
    spots.push(new Phaser.Point(653, 318));
    spots.push(new Phaser.Point(229, 430));
    spots.push(new Phaser.Point(494, 436));
    spots.push(new Phaser.Point(770, 451));
    spots.push(new Phaser.Point(125, 551));
    spots.push(new Phaser.Point(441, 547));
    spots.push(new Phaser.Point(729, 535));
    
    mode = "normal";
    
    bg = game.add.sprite(0, 0, 'bg');
    elements = game.add.group();
    sRing = game.add.sprite(0, 0, 'sRing');
    
    trees[0] = elements.create(269, 301, 'tree2');
    trees[0].anchor.setTo(0.4, 0.98);
    trees[0].body.setRectangle(40, 20, 38, 275);
    trees[1] = elements.create(779, 360, 'tree3');
    trees[1].anchor.setTo(0.57, 0.98);
    trees[1].body.setRectangle(60, 30, 75, 330);
    
    wizard = game.add.sprite(100, 380, 'wizard');
    fighter = game.add.sprite(200, 420, 'fighter');
    wolf = game.add.sprite(300, 400, 'wolf');
    necromancer = game.add.sprite(600, 400, 'necromancer');
    
    trees[2] = elements.create(56, 488, 'tree1');
    trees[2].anchor.setTo(0.26, 0.98);
    trees[2].body.setRectangle(70, 40, 9, 445);
    trees[3] = elements.create(899, 588, 'tree4');
    trees[3].anchor.setTo(0.5, 0.98);
    trees[3].body.setRectangle(90, 50, 50, 530);
    
    characters[0] = wizard;
    characters[1] = fighter;
    characters[2] = wolf;
    characters[3] = necromancer;
    
    elements.add(wizard);
    elements.add(fighter);
    elements.add(wolf);
    elements.add(necromancer);
    elements.add(sRing);
    
    wizard.animations.add('attack', Phaser.Animation.generateFrameNames('Wizard', 0, 19, '', 4), 30, true, false);
    wizard.animations.add('idle', Phaser.Animation.generateFrameNames('Wizard', 20, 49, '', 4), 30, true, false);
    wizard.animations.add('move', Phaser.Animation.generateFrameNames('Wizard', 50, 76, '', 4), 30, true, false);
    wizard.animations.add('hit', Phaser.Animation.generateFrameNames('Wizard', 77, 86, '', 4), 24, true, false);
    wizard.animations.add('death', Phaser.Animation.generateFrameNames('Wizard', 87, 103, '', 4), 24, true, false);
    wizard.animations.add('fireball', Phaser.Animation.generateFrameNames('Wizard', 104, 132, '', 4), 24, true, false);

    wizard.animations.play('idle', null, true);

    wizard.body.setRectangle(40, 30, 15, 65);
    wizard.inputEnabled = true;
    wizard.input.pixelPerfect = true;
    wizard.input.useHandCursor = true;
    wizard.anchor.setTo(0.35, 0.8); //anchor exacto: (regPoint.x/sourceSize.w, regPoint.y/sourceSize.h)
    wizard.isPC = true;
    wizard.timer = game.time.create(false);
    wizard.attackInterval = 1000; //milliseconds
    wizard.range = 40;
    wizard.health = 200;
    wizard.maxHealth = 200;
    wizard.attackDamage = 20;
    wizard.offsetX = 0;
    wizard.offsetY = 0;
    wizard.speed = 100;
    wizard.events.onInputDown.add(getSelectionRing);
    
    game.add.sprite(bg.width - 96, 16, 'iconWizard');
    wizard.healthBar = game.add.sprite(bg.width - 90, 93, 'red');
    wizard.healthBar.width = 71;
    wizard.healthBar.height = 0;
    wizard.healthBar.alpha = 0.5;
    wizard.healthBar.anchor.setTo(0, 1);
    
    
    fighter.animations.add('attack', Phaser.Animation.generateFrameNames('Fighter', 0, 17, '', 4), 40, true, false);
    fighter.animations.add('move', Phaser.Animation.generateFrameNames('Fighter', 18, 45, '', 4), 30, true, false);
    fighter.animations.add('idle', Phaser.Animation.generateFrameNames('Fighter', 46, 66, '', 4), 24, true, false);
    fighter.animations.add('death', Phaser.Animation.generateFrameNames('Fighter', 67, 86, '', 4), 24, true, false);
    fighter.animations.add('hit', Phaser.Animation.generateFrameNames('Fighter', 87, 96, '', 4), 24, true, false);

    fighter.animations.play('idle', null, true);

    fighter.body.setRectangle(40, 30, 20, 73);
    fighter.inputEnabled = true;
    fighter.input.pixelPerfect = true;
    fighter.input.useHandCursor = true;
    fighter.anchor.setTo(0.37, 0.88); //anchor exacto: (regPoint.x/sourceSize.w, regPoint.y/sourceSize.h)
    fighter.isPC = true;
    fighter.timer = game.time.create(false);
    fighter.attackInterval = 1000; //milliseconds
    fighter.range = 40;
    fighter.health = 250;
    fighter.maxHealth = 200;
    fighter.attackDamage = 30;
    fighter.offsetX = 0;
    fighter.offsetY = 0;
    fighter.speed = 120;
    fighter.events.onInputDown.add(getSelectionRing);
    
    game.add.sprite(bg.width - 96, 109, 'iconFighter');
    fighter.healthBar = game.add.sprite(bg.width - 90, 186, 'red');
    fighter.healthBar.width = 71;
    fighter.healthBar.height = 0;
    fighter.healthBar.alpha = 0.5;
    fighter.healthBar.anchor.setTo(0, 1);
    
    
    wolf.animations.add('attack', Phaser.Animation.generateFrameNames('Wolf', 0, 21, '', 4), 30, true, false);
    wolf.animations.add('move', Phaser.Animation.generateFrameNames('Wolf', 22, 37, '', 4), 30, true, false);
    wolf.animations.add('idle', Phaser.Animation.generateFrameNames('Wolf', 38, 61, '', 4), 30, true, false);
    wolf.animations.add('death', Phaser.Animation.generateFrameNames('Wolf', 62, 89, '', 4), 24, true, false);
    wolf.animations.add('hit', Phaser.Animation.generateFrameNames('Wolf', 90, 100, '', 4), 24, true, false);
    
    wolf.animations.play('idle', null, true);
    
    wolf.body.setRectangle(50, 30, 46, 70);
    wolf.inputEnabled = true;
    wolf.input.pixelPerfect = true;
    wolf.input.useHandCursor = true;
    wolf.anchor.setTo(0.5, 0.88);
    wolf.isPC = false;
    wolf.timer = game.time.create(false);
    wolf.attackInterval = 1000; //milliseconds
    wolf.range = 60;
    wolf.health = 200;
    wolf.maxHealth = 200;
    wolf.attackDamage = 50;
    wolf.offsetX = -3;
    wolf.offsetY = -5;
    wolf.speed = 200;
    wolf.events.onInputDown.add(getSelectionRing);
    wolf.think = wolfThinking;
    wolf.parameters = {
        close: 10,
        vulnerable: 15,
        strong: 10
    };
    
    necromancer.animations.add('attack', Phaser.Animation.generateFrameNames('Necromancer', 0, 15, '', 4), 30, true, false);
    necromancer.animations.add('move', Phaser.Animation.generateFrameNames('Necromancer', 16, 41, '', 4), 30, true, false);
    necromancer.animations.add('idle', Phaser.Animation.generateFrameNames('Necromancer', 42, 62, '', 4), 30, true, false);
    necromancer.animations.add('death', Phaser.Animation.generateFrameNames('Necromancer', 63, 87, '', 4), 24, true, false);
    necromancer.animations.add('hit', Phaser.Animation.generateFrameNames('Necromancer', 88, 97, '', 4), 24, true, false);
    necromancer.animations.add('bolt', Phaser.Animation.generateFrameNames('Necromancer', 98, 122, '', 4), 24, true, false);
    necromancer.animations.add('heal', Phaser.Animation.generateFrameNames('Necromancer', 123, 144, '', 4), 24, true, false);
    
    necromancer.animations.play('idle', null, true);
    
    necromancer.body.setRectangle(40, 30, 22, 85);
    necromancer.inputEnabled = true;
    necromancer.input.pixelPerfect = true;
    necromancer.input.useHandCursor = true;
    necromancer.anchor.setTo(0.32, 0.93);
    necromancer.isPC = false;
    necromancer.timer = game.time.create(false);
    necromancer.attackInterval = 1000; //milliseconds
    necromancer.range = 40;
    necromancer.health = 200;
    necromancer.maxHealth = 200;
    necromancer.attackDamage = 20;
    necromancer.offsetX = 0;
    necromancer.offsetY = 0;
    necromancer.speed = 100;
    necromancer.events.onInputDown.add(getSelectionRing);
    necromancer.think = necroThinking;
    necromancer.healCoolDown = 3000;
    necromancer.boltCoolDown = 3000;
    
    //Drawing transparent rectangles for bottom interface:
    g = game.add.graphics(0, 0);
    g.fillColor = 0x000000;
    g.fillAlpha = 0.53;
    g.drawRect(0, bg.height - 68, bg.width, 68);
    g.fillColor = 0xffffff;
    g.fillAlpha = 0.72;
    g.drawRect(25, bg.height - 48, bg.width - 50, 28);
    
    game.add.button(400, bg.height - 56, 'buttonF', fireball, this, 0, 0, 1);//over, normal, press
    game.add.button(20, bg.height - 56, 'buttonP', fireball, this, 0, 0, 1);
    game.add.button(450, bg.height - 56, 'buttonL', fireball, this, 0, 0, 1);
    game.add.button(bg.width - 65, bg.height - 56, 'buttonP', fireball, this, 0, 0, 1);

    //Interface text:
    text = game.add.bitmapText(100, bg.height - 50, 'Daerion', { font: '32px AgencyFB', align: 'center' });
    game.input.mouse.mouseDownCallback = mouseClick;
    
    for (i = 0; i < trees.length; i += 1) {
        trees[i].body.immovable = true;
        trees[i].radius = trees[i].body.shape.w * Math.SQRT1_2 - 5;
    }
    for (i = 0; i < characters.length; i += 1) {
        characters[i].radius = characters[i].body.shape.w * Math.SQRT1_2 - 5;
        characters[i].damage = damage;
        characters[i].moveTo = moveTo;
    }
    
    fireballs = game.add.group();
    bolts = game.add.group();
    for (i = 0; i < 100; i += 1) {
        var powerAnimation = fireballs.create(0, 0, 'powers', [0], false);
        powerAnimation.anchor.setTo(0.61, 0.51);
        powerAnimation.animations.add('fireball', Phaser.Animation.generateFrameNames('Powers', 0, 7, '', 4), 30, true, false);
        powerAnimation = bolts.create(0, 0, 'powers', [0], false);
        powerAnimation.anchor.setTo(0.61, 0.51);
        powerAnimation.animations.add('bolt', Phaser.Animation.generateFrameNames('Powers', 8, 18, '', 4), 30, true, false);
    }
    fireballs.setAll('outOfBoundsKill', true);
    bolts.setAll('outOfBoundsKill', true);

}

function getSelectionRing(target, pointer) {
    if (pointer) {
        if (!doNotProcess) {
            if (pointer.button === 2) { //right click on character
                if (sRing.selected && sRing.selected.isPC && (!target.isPC) && target.alive) { //player wants to attack
                    sRing.selected.chasing = target;
                }
            }
            else if (pointer.button === 0) { //left click on character
                if (mode === "normal") {
                    sRing.scale.x = target.width / 80;
                    sRing.x = target.x - sRing.width / 2 + (target.offsetX || 0);
                    sRing.y = target.y - sRing.height / 2 + (target.offsetY || 0);
                    sRing.selected = target;
                }
                else if (mode === "select") {
                    if (!target.isPC) {//TODO this should depend on the type of spell - affecting enemy/ally
                        sRing.selected.animations.play('fireball', null, false);
                        sRing.selected.body.velocity.setTo(0, 0);
                        sRing.selected.isMoving = false;
                        mode = "normal";
                        
                        var offsetX = 95;
                        if (target.x > wizard.x) {
                            wizard.scale.x = 1;
                        }
                        else {
                            wizard.scale.x = -1;
                            offsetX = -95;
                        }
                        
                        game.time.events.add(1000, function () { 
                            var powerAnimation = fireballs.getFirstDead();
                            powerAnimation.reset(wizard.x + offsetX, wizard.y - 35);
                            powerAnimation.play('fireball', null, true);
                            game.physics.moveToXY(powerAnimation, target.x, target.y - 20, 500);
                            console.log(target.key);
                            powerAnimation.rotation = game.physics.angleBetween(powerAnimation, target);
                        }, this);
                    }
                    else {
                        alert("not a valid target");
                    }
                }
            }
        }
    }
    else if (target = sRing.selected) { //if there is a character selected, the ring follows it on update
        sRing.scale.x = target.width / 80;
        sRing.x = target.x - sRing.width / 2 + (target.offsetX || 0);
        sRing.y = target.y - sRing.height / 2 + (target.offsetY || 0);
        sRing.selected = target;
    }
}

function update() {
    
    
    necromancer.think();
    
    var i, j, item, p, range, timeElapsed;
    var offset = 4;
    
    for (i = 0; i < trees.length; i += 1) {
        for (j = 0; j < characters.length; j += 1) {
            game.physics.collide(trees[i], characters[j]);
        }
    }
    
    for (i = 0; i < characters.length; i += 1) {
        if (characters[i].alive) {
            if (!characters[i].isPC) {
                game.physics.overlap(fireballs, characters[i], fireballHitEnemy, null, this);
            }
            else {
                game.physics.overlap(bolts, characters[i], boltHitEnemy, null, this);
            }
        }
    }
    

    
    getSelectionRing();

    for (i = 0; i < characters.length; i += 1) {
        item = characters[i];
        if (item.alive) {
            if (item.chasing) {
                //If it is chasing a character, and is in attack range (item.range)
                if (item.animations.currentAnim.name !== "attack") {
                    if ((item.x > item.chasing.x - item.range) && (item.x < item.chasing.x + item.range) && (item.y > item.chasing.y - item.range/2) && (item.y < item.chasing.y + item.range/2)) {
                        //if timer is null or time elapsed greater than item.attackInterval
                        if ((item.timeOfLastAttack === undefined) || (game.time.elapsedSince(item.timeOfLastAttack) > item.attackInterval))
                        {
                            item.body.velocity.setTo(0, 0);
                            item.isMoving = false;
                            item.animations.play('attack', null, false);
                            //reset/fire timer
                            item.timeOfLastAttack = game.time.now;
                            item.chasing.damage(item.attackDamage);
                            if (item.chasing.alive === false) {
                                item.chasing = null;
                            }
                        }
                    }
                    else {
                        p = new Phaser.Point(item.chasing.x, item.chasing.y);
                        (p.x > item.x) ? item.scale.x = 1 : item.scale.x = -1;
                        item.dest = p;
                        item.isMoving = true;
                        item.animations.play('move', null, true);
                        item.trueDest = calcDest(item, item.dest);
                        calcDest(item, item.newDest);
                        game.physics.moveToXY(item, item.newDest.x, item.newDest.y, item.speed);
                    }
                }
            }
            else if (item.isMoving) {
                if ((item.x > item.newDest.x - offset) && (item.x < item.newDest.x + offset) && (item.y > item.newDest.y - offset) && (item.y < item.newDest.y + offset)) {
                    if (item.trueDest) {
                        item.isMoving = false;
                        item.animations.play('idle', null, true);
                        item.body.velocity.setTo(0, 0);
                    }
                    else {
                        item.trueDest = calcDest(item, item.dest);
                        game.physics.moveToXY(item, item.newDest.x, item.newDest.y, item.speed);
                    }
                }
            }
            if (item.animations.currentAnim.isFinished) {
                item.animations.play('idle', null, true);
            }
        }
    }

    elements.sort();
}

function mouseClick(event) {
    var p;
    var selected = sRing.selected;
    if (mode === "normal" && selected && (event.which === 3)) { //character is selected and right click TODO: replace with sRing.selected.isPC
        selected.chasing = null;
        p = new Phaser.Point(event.clientX, event.clientY);
        if (checkValidDest(selected, p)) {
            (event.clientX > selected.x) ? selected.scale.x = 1 : selected.scale.x = -1;
            selected.dest = p;
            selected.isMoving = true;
            selected.animations.play('move', null, true);
            selected.trueDest = calcDest(selected, selected.dest);
            calcDest(selected, selected.newDest); //added second calculation to avoid collision when the player is very close to the obstacle. Significant overhead
            game.physics.moveToXY(selected, selected.newDest.x, selected.newDest.y, selected.speed);
        }
        doNotProcess = false;
    }
    else if (mode === "select" && (event.which === 3)) {
        mode = "normal";
        doNotProcess = true;
    }
    else {
        doNotProcess = false;
    }
}

function moveTo(target) {
    (target.x > this.x) ? this.scale.x = 1 : this.scale.x = -1;
    this.dest = target;
    this.isMoving = true;
    this.animations.play('move', null, true);
    this.trueDest = calcDest(this, this.dest);
    calcDest(this, this.newDest);
    game.physics.moveToXY(this, this.newDest.x, this.newDest.y, this.speed);
}


/*
    Returns true when there are no obstacles, false otherwise
*/
function calcDest(player, target) {
    var i, item, d, alpha, gamma, dpt, dpi, shorterDistance, beta, closest, u, u1, u2, omega, theta;
    var threats = [];
    gamma = game.physics.angleBetween(player, target);
    dpt = game.physics.distanceBetween(player, target);
    shorterDistance = Infinity;
    for (i = 0; i < trees.length; i++) {
        item = trees[i];
        alpha = Math.abs(gamma - game.physics.angleBetween(player, item));
//        console.log("a: " + (alpha * 180 / Math.PI) + "  g: " + (gamma *180/Math.PI) + "  b: " + (game.physics.angleBetween(player, item)*180/Math.PI));
        if ((alpha < Math.PI / 2)||(alpha > 3* Math.PI/2)) {
            dpi = game.physics.distanceBetween(player, item);
            if (dpi <= dpt) { //if the obstacle is closer than the target
                if (alpha > 3* Math.PI/2) alpha = Math.PI * 2 - alpha;
                d = dpi * Math.sin(alpha);
                if (d <= player.radius + item.radius) {
                    if (dpi < shorterDistance) {
                        shorterDistance = dpi;
                        closest = item;
                    }
//                    console.log("threat: " + i);
                    threats.push(item);
                }
            }
        }
    }
    if (threats.length > 0) {
        dpi = game.physics.distanceBetween(player, closest);
        beta = game.physics.angleBetween(player, closest);
        alpha = Math.abs(gamma - beta);
        var signo = 1;
        if (alpha > 3* Math.PI/2) {
            alpha = Math.PI * 2 - alpha;
            signo = -1;
        }
        d = dpi * Math.sin(alpha);
        u1 = dpi * Math.cos(alpha);
        u2 = player.radius + closest.radius - d + 3; //added a little offset
        u = Math.sqrt(u1 * u1 + u2 * u2);
        theta = Math.asin(u2 / u);
        if (gamma < beta) {
            theta *= -1;
        }
        omega = gamma + theta * signo;
        player.newDest = new Phaser.Point(u * Math.cos(omega) + player.x, u * Math.sin(omega) + player.y);
        return false;
    }
    else {
        player.newDest = target;
        return true;
    }
}

function checkValidDest(player, target) {
    var i, item;
    for (i = 0; i < trees.length; i++) {
        item = trees[i];
        if ((game.physics.distanceBetween(target, item)) <= (player.radius + item.radius)) {
            return false;
        }
    }
    return true;
}

function fireball() {
    mode = "select"; //TODO this should depend on the type of spell/power -> affecting self/target
}

function fireballHitEnemy(enemy, fireball) {
    fireball.destroy();
    enemy.damage(50);
}

function boltHitEnemy(enemy, bolt) {
    bolt.destroy();
    enemy.damage(50);
}

function damage(value)
{
    this.health -= value;
    if (this.isPC)
    {
        this.healthBar.height = (this.health < 0)? 71 : 71 - this.health * 71 /this.maxHealth;
    }
    if (this.health <= 0)
    {
        this.play('death', null, false);
        this.alive = false;
        this.body.velocity.setTo(0, 0);
    }
    else if (this.animations.currentAnim.name === 'idle') {
        this.animations.play('hit', null, false);
    }
}

function wolfThinking() {
    var i, distance, remainingH, strength, aux, indexC, indexV, indexS, min;
    var totals = [];
    
    distance = Infinity;
    remainingH = Infinity;
    strength = 0;
    index = -1;
    aux = -1;
//    attack closest
//    for (i = 0; i < characters.length; i += 1) {
//        if (characters[i].isPC && characters[i].alive) {
//            aux = game.physics.distanceBetween(this, characters[i]);
//            if (aux < distance) {
//                distance = aux;
//                index = i;
//            }
//        }
//    }
//    (index >= 0) ? this.chasing = characters[index] : this.chasing = null;
    
    //attack according to parameters
//    for (i = 0; i < characters.length; i += 1) {
//        totals[i] = 0;
//        if (characters[i].isPC && characters[i].alive) {
//            aux = game.physics.distanceBetween(this, characters[i]);
//            if (aux < distance) {
//                distance = aux;
//                indexC = i;
//            }
//            aux = characters[i].health;
//            if (aux < remainingH) {
//                remainingH = aux;
//                indexV = i;
//            }
//            aux = characters[i].attackDamage * 1000 / characters[i].attackInterval;
//            if (aux > strength) {
//                strength = aux;
//                indexS = i;
//            }
//        }
//    }
//    if (aux > 0) {
//        totals[indexC] = this.parameters.close;
//        totals[indexV] += this.parameters.vulnerable;
//        totals[indexS] += this.parameters.strong;
//        aux = 0;
//        for (i = 0; i < characters.length; i += 1) {
//            if (totals[i] > aux) {
//                aux = totals[i];
//                index = i;
//            }
//        }
//    }
//    (index >= 0) ? this.chasing = characters[index] : this.chasing = null;
    
    //evade
    distance = 0;
    aux = -1;
    for (i = 0; i < spots.length; i += 1) {
        min = Infinity;
        for (j = 0; j < characters.length; j += 1) {
            if (characters[j].isPC && characters[j].alive) {
                aux = game.physics.distanceBetween(spots[i], characters[j]);
                if (aux < min) min = aux;
            }
        }
        if (min > distance && aux > 0) {
            distance = min;
            index = i;
        }
    }
    
    if (game.physics.distanceBetween(this, spots[index]) > 5) {
        this.moveTo(spots[index]);
    }
}

function necroThinking() {
    //throw bolt
//    if ((this.timeOfLastAttack === undefined) || (game.time.elapsedSince(this.timeOfLastAttack) > necromancer.boltCoolDown)) {
//        target = wizard;
//        this.animations.play('bolt', null, false);
//        this.body.velocity.setTo(0, 0);
//        this.isMoving = false;
//        this.chasing = null;
//        var offsetX = 95;
//        if (target.x > this.x) {
//            this.scale.x = 1;
//        }
//        else {
//            this.scale.x = -1;
//            offsetX = -95;
//        }
//        this.timeOfLastAttack = game.time.now;
//        game.time.events.add(700, function () { 
//            var powerAnimation = bolts.getFirstDead();
//            powerAnimation.reset(necromancer.x + offsetX, necromancer.y - 35);
//            powerAnimation.play('bolt', null, true);
//            game.physics.moveToXY(powerAnimation, target.x, target.y - 20, 500);
//            powerAnimation.rotation = game.physics.angleBetween(powerAnimation, target);
//        }, this);
//    }
    //heal
    if ((this.timeOfLastHeal === undefined) || (game.time.elapsedSince(this.timeOfLastHeal) > necromancer.healCoolDown)) {
        target = wolf;
        this.animations.play('heal', null, false);
        this.body.velocity.setTo(0, 0);
        this.isMoving = false;
        this.chasing = null;
        
        this.timeOfLastHeal = game.time.now;
        (target.x > this.x) ? this.scale.x = 1 : this.scale.x = -1;
        target.health = (target.health + 30 > target.maxHealth) ? target.maxHealth : target.health + 30;
    }
}

function render() {
//    game.debug.renderSpriteInfo(wolf, 32, 32);
    
//    game.debug.renderSpriteBounds(wizard);
//    game.debug.renderSpriteBounds(wolf);
//    game.debug.renderSpriteBounds(fighter);
//    game.debug.renderSpriteBounds(necromancer);
//    
//    game.debug.renderPoint(wizard.input._tempPoint);
//    game.debug.renderSpriteBody(wizard);
//    game.debug.renderSpriteBody(wolf);
//    game.debug.renderSpriteBody(fighter);
//    game.debug.renderSpriteBody(necromancer);
//    for (i = 0; i < characters.length; i += 1) {
//        game.debug.renderCircle(new Phaser.Circle(characters[i].x, characters[i].y, characters[i].radius * 2));
//    }
//    for (i = 0; i < trees.length; i += 1) {
//        game.debug.renderCircle(new Phaser.Circle(trees[i].x, trees[i].y, trees[i].radius * 2));
//    }
//    game.debug.renderPoint(new Phaser.Point(wizard.x, wizard.y));
//    game.debug.renderPoint(new Phaser.Point(wolf.x, wolf.y));
//    game.debug.renderPoint(new Phaser.Point(necromancer.x, necromancer.y));
//    game.debug.renderPhysicsBody(wizard.body);
//    game.debug.renderPhysicsBody(wolf.body);
//    game.debug.renderSpriteBody(wizard);
//    var i;
//    for (i = 0; i < trees.length; i += 1) {
//        game.debug.renderSpriteBody(trees[i]);
//    }
}