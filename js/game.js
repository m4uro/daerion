var game = new Phaser.Game(1024, 656, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.atlas('wizard', 'assets/wizard.png', 'assets/wizard.json');
    game.load.atlas('fighter', 'assets/fighter.png', 'assets/fighter.json');
    game.load.atlas('wolf', 'assets/wolf.png', 'assets/wolf.json');
    game.load.atlas('necromancer', 'assets/necromancer.png', 'assets/necromancer.json');
    game.load.atlas('powers', 'assets/powers.png', 'assets/powers.json');
    game.load.atlas('effects', 'assets/effects.png', 'assets/effects.json');
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

var sRing, mode, doNotProcess, fireballs, bolts;
var effects, spaceKey, thinkActive, numberOfWolves;
var move;
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
    
    Daerion.bg = game.add.sprite(0, 0, 'bg');
    elements = game.add.group();
    sRing = game.add.sprite(0, 0, 'sRing');
    sRing.visible = false;
    
    trees[0] = elements.create(269, 301, 'tree2');
    trees[0].anchor.setTo(0.4, 0.98);
    trees[0].body.setRectangle(40, 20, 38, 275);
    trees[1] = elements.create(779, 360, 'tree3');
    trees[1].anchor.setTo(0.57, 0.98);
    trees[1].body.setRectangle(60, 30, 75, 330);
    
    Daerion.wizard = new Daerion.Wizard(game, 100, 380, 'wizard');
    Daerion.fighter = new Daerion.Fighter(game, 200, 420, 'fighter');
    Daerion.necromancer = new Daerion.Necromancer(game, 600, 400, 'necromancer');
    
    trees[2] = elements.create(56, 488, 'tree1');
    trees[2].anchor.setTo(0.26, 0.98);
    trees[2].body.setRectangle(70, 40, 9, 445);
    trees[3] = elements.create(899, 588, 'tree4');
    trees[3].anchor.setTo(0.5, 0.98);
    trees[3].body.setRectangle(90, 50, 50, 530);
    
    characters[0] = Daerion.wizard;
    characters[1] = Daerion.fighter;
    characters[2] = Daerion.necromancer;
    
    numberOfWolves = 3; //should be lower than spots.length
    
    for(i = 0; i < numberOfWolves; i += 1) {
        if (i <= spots.length) {
            new Daerion.Wolf(game, spots[i].x, spots[i].y, 'wolf');
        }
    }
    
    elements.add(Daerion.wizard);
    elements.add(Daerion.fighter);
    
    elements.add(Daerion.necromancer);
    elements.add(sRing);
    
    
    //Drawing transparent rectangles for bottom interface:
    g = game.add.graphics(0, 0);
    g.fillColor = 0x000000;
    g.fillAlpha = 0.53;
    g.drawRect(0, Daerion.bg.height - 68, Daerion.bg.width, 68);
    g.fillColor = 0xffffff;
    g.fillAlpha = 0.72;
    g.drawRect(25, Daerion.bg.height - 48, Daerion.bg.width - 50, 28);
    
    game.add.button(400, Daerion.bg.height - 56, 'buttonF', fireball, this, 0, 0, 1);//over, normal, press
    game.add.button(20, Daerion.bg.height - 56, 'buttonP', fireball, this, 0, 0, 1);
    game.add.button(450, Daerion.bg.height - 56, 'buttonL', fireball, this, 0, 0, 1);
    game.add.button(Daerion.bg.width - 65, Daerion.bg.height - 56, 'buttonP', fireball, this, 0, 0, 1);

    //Interface text:
    text = game.add.bitmapText(100, Daerion.bg.height - 50, 'Daerion', { font: '32px AgencyFB', align: 'center' });
    game.input.mouse.mouseDownCallback = mouseClick;
    
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(toggleThink, this);
    thinkActive = false;
    
    for (i = 0; i < trees.length; i += 1) {
        trees[i].body.immovable = true;
        trees[i].radius = trees[i].body.shape.w * Math.SQRT1_2;
    }
    for (i = 0; i < characters.length; i += 1) {
        c = characters[i];
        c.radius = characters[i].body.shape.w * Math.SQRT1_2;
        c.damage = damage;
        c.moveTo = moveTo;
        if (!c.isPC) {
            c.evade = evade;
            if (c !== Daerion.necromancer) {
                Daerion.necromancer.minions.push(c);
                c.leader = Daerion.necromancer;
            }
        }
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
    
    effects = game.add.group();
    for (i = 0; i < 3; i += 1) {
        var e = effects.create(0, 0, 'effects', [0], false);
        e.anchor.setTo(0.52, 0.98);
        e.animations.add('heal', Phaser.Animation.generateFrameNames('Effects', 0, 14, '', 4), 30, true, false);
        e.animations.add('fireball', Phaser.Animation.generateFrameNames('Effects', 15, 25, '', 4), 30, true, false);
        e.animations.add('bolt', Phaser.Animation.generateFrameNames('Effects', 26, 37, '', 4), 30, true, false);
    }

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
                        if (target.x > Daerion.wizard.x) {
                            Daerion.wizard.scale.x = 1;
                        }
                        else {
                            Daerion.wizard.scale.x = -1;
                            offsetX = -95;
                        }
                        
                        game.time.events.add(1000, function () { 
                            var powerAnimation = fireballs.getFirstDead();
                            powerAnimation.reset(Daerion.wizard.x + offsetX, Daerion.wizard.y - 35);
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
        sRing.visible = true;
    }
}

function update() {
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
            if (!item.isPC && thinkActive) {
                item.think();
            }
            if (item.chasing) {
                //If it is chasing a character, and is in attack range (item.range)
                if (item.animations.currentAnim.name !== "attack") {
                    if ((item.x > item.chasing.x - item.range) && (item.x < item.chasing.x + item.range) && (item.y > item.chasing.y - item.range/2) && (item.y < item.chasing.y + item.range/2)) {
                        //if timer is null or time elapsed greater than item.attackInterval
                        if ((item.timeOfLastAttack === undefined) || (game.time.elapsedSince(item.timeOfLastAttack) > item.attackInterval))
                        {
                            (item.chasing.x > item.x) ? item.scale.x = 1 : item.scale.x = -1;
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
    if (mode === "normal" && selected && (event.which === 3) && selected.alive) { //character is selected and right click TODO: replace with sRing.selected.isPC
        selected.chasing = null;
        p = new Phaser.Point(event.clientX - game.canvas.offsetLeft, event.clientY);
        if (checkValidDest(selected, p)) {
            ((event.clientX - game.canvas.offsetLeft) > selected.x) ? selected.scale.x = 1 : selected.scale.x = -1;
            selected.dest = p;
            selected.isMoving = true;
            selected.animations.play('move', null, true);
            selected.trueDest = calcDest(selected, selected.dest);
            calcDest(selected, selected.newDest); //added second calculation to avoid collision when the player is very close to the obstacle
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
    var e = effects.getFirstDead();
    if (e) {
        e.reset(enemy.x, enemy.y);
        e.play('fireball', null, false, true);
    }
}

function boltHitEnemy(enemy, bolt) {
    bolt.destroy();
    enemy.damage(50);
    var e = effects.getFirstDead();
    if (e) {
        e.reset(enemy.x, enemy.y);
        e.play('bolt', null, false, true);
    }
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
        if (this.isLeader) {
            for (i = 0; i < this.minions.length; i++) {
                this.minions[i].restoreParameters();
            }
        }
    }
    else if (this.animations.currentAnim.name === 'idle') {
        this.animations.play('hit', null, false);
    }
}

function evade() {
    var distance, aux, i, j, min, index;
    distance = 0;
    aux = -1;
    this.chasing = null;
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

function choose(thisCharacter, params)
{
    var i, distance, remainingH, strength, aux, index, indexC, indexV, indexS;
    var totals = [];
    
    distance = Infinity;
    remainingH = Infinity;
    strength = 0;
    index = -1;
    aux = -1;
    
    for (i = 0; i < characters.length; i += 1) {
        totals[i] = 0;
        if (characters[i].isPC && characters[i].alive) {
            aux = game.physics.distanceBetween(thisCharacter, characters[i]);
            if (aux < distance) {
                distance = aux;
                indexC = i;
            }
            aux = characters[i].health;
            if (aux < remainingH) {
                remainingH = aux;
                indexV = i;
            }
            aux = characters[i].attackDamage * 1000 / characters[i].attackInterval;
            if (aux > strength) {
                strength = aux;
                indexS = i;
            }
        }
    }
    if (aux > 0) {
        totals[indexC] = params.close;
        totals[indexV] += params.vulnerable;
        totals[indexS] += params.strong;
        aux = 0;
        for (i = 0; i < characters.length; i += 1) {
            if (totals[i] > aux) {
                aux = totals[i];
                index = i;
            }
        }
    }
    if (index >= 0) {
        return characters[index];
    }
    else {
        return null;
    }
}

function toggleThink() {
    thinkActive = (!thinkActive);
}

function render() {
//    game.debug.renderSpriteInfo(Daerion.wolf, 32, 32);
    
//    game.debug.renderSpriteBounds(Daerion.wizard);
//    game.debug.renderSpriteBounds(Daerion.wolf);
//    game.debug.renderSpriteBounds(Daerion.fighter);
//    game.debug.renderSpriteBounds(Daerion.necromancer);
//    
//    game.debug.renderPoint(Daerion.wizard.input._tempPoint);
//    game.debug.renderSpriteBody(Daerion.wizard);
//    game.debug.renderSpriteBody(Daerion.wolf);
//    game.debug.renderSpriteBody(Daerion.fighter);
//    game.debug.renderSpriteBody(Daerion.necromancer);
//    for (i = 0; i < characters.length; i += 1) {
//        game.debug.renderCircle(new Phaser.Circle(characters[i].x, characters[i].y, characters[i].radius * 2));
//        game.debug.renderSpriteBody(characters[i]);
//    }
//    for (i = 0; i < trees.length; i += 1) {
//        game.debug.renderCircle(new Phaser.Circle(trees[i].x, trees[i].y, trees[i].radius * 2));
//        game.debug.renderSpriteBody(trees[i]);
//        game.debug.renderPoint(new Phaser.Point(trees[i].x, trees[i].y));
//    }
//    game.debug.renderPoint(new Phaser.Point(Daerion.wizard.x, Daerion.wizard.y));
//    game.debug.renderPoint(new Phaser.Point(Daerion.wolf.x, Daerion.wolf.y));
//    game.debug.renderPoint(new Phaser.Point(Daerion.wolf.x, Daerion.wolf.y));
//    game.debug.renderPhysicsBody(Daerion.wizard.body);
//    game.debug.renderPhysicsBody(Daerion.wolf.body);
//    game.debug.renderSpriteBody(Daerion.wizard);
//    var i;
//    for (i = 0; i < trees.length; i += 1) {
//        game.debug.renderSpriteBody(trees[i]);
//    }
}