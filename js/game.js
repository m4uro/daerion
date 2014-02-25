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
//    game.load.image('buttonF', 'assets/button_fire.png');
//    game.load.image('buttonL', 'assets/button_lightning.png');
//    game.load.image('buttonP', 'assets/button_pause.png');
    game.load.image('iconWizard', 'assets/icon_wizard.png');
    game.load.image('red','assets/red.png');
    game.load.bitmapFont('agency', 'assets/agency.png', 'assets/agency.xml');
    
    game.load.spritesheet('buttonF', 'assets/button_fire.png', 42, 42);
    game.load.spritesheet('buttonL', 'assets/button_lightning.png', 42, 42);
    game.load.spritesheet('buttonP', 'assets/button_pause.png', 42, 42);
}

var wizard, sRing, mode, doNotProcess;
var move, bg;
var contador = 0;
var g;
var text;
var elements;
var trees = [];
var characters = [];

function create() {
    var i;
    
    mode = "normal";
    
    bg = game.add.sprite(0, 0, 'bg');
    elements = game.add.group();
    sRing = game.add.sprite(0, 0, 'sRing');
    
    trees[0] = elements.create(269, 301, 'tree2');
    trees[0].anchor.setTo(0.4, 0.98);
    trees[0].body.setRectangle(40, 30, 38, 265);
    trees[1] = elements.create(779, 360, 'tree3');
    trees[1].anchor.setTo(0.57, 0.98);
    trees[1].body.setRectangle(60, 30, 80, 330);
    
    wizard = game.add.sprite(100, 380, 'wizard');
    wizard.body.setRectangle(40, 30, 6, 53);
    characters[0] = wizard;
    wolf = game.add.sprite(300, 400, 'wolf');
    wolf.body.setRectangle(50, 30, 40, 65);
    characters[1] = wolf;
    trees[2] = elements.create(56, 488, 'tree1');
    trees[2].anchor.setTo(0.26, 0.98);
    trees[2].body.setRectangle(70, 40, 9, 445);
    trees[3] = elements.create(899, 588, 'tree4');
    trees[3].anchor.setTo(0.5, 0.98);
    trees[3].body.setRectangle(90, 50, 50, 530);
    
    for (i = 0; i < trees.length; i += 1) {
        trees[i].body.immovable = true;
        trees[i].radius = trees[i].body.shape.w * Math.SQRT1_2;
    }
    for (i = 0; i < characters.length; i += 1) {
        characters[i].radius = characters[i].body.shape.w * Math.SQRT1_2;
    }
    
    elements.add(wizard);
    elements.add(wolf);
    elements.add(sRing);
//    trees[3].inputEnabled = true;
//    trees[3].input.enableDrag(true);
    //game.stage.backgroundColor = '#555';
    
    wizard.animations.add('attack', Phaser.Animation.generateFrameNames('Wizard', 0, 19, '', 4), 30, true, false);
    wizard.animations.add('idle', Phaser.Animation.generateFrameNames('Wizard', 20, 49, '', 4), 30, true, false);
    wizard.animations.add('move', Phaser.Animation.generateFrameNames('Wizard', 50, 76, '', 4), 30, true, false);
    wizard.animations.add('hit', Phaser.Animation.generateFrameNames('Wizard', 77, 86, '', 4), 24, true, false);
    wizard.animations.add('death', Phaser.Animation.generateFrameNames('Wizard', 87, 103, '', 4), 24, true, false);
    wizard.animations.add('fireball', Phaser.Animation.generateFrameNames('Wizard', 104, 132, '', 4), 24, true, false);

    wizard.animations.play('idle', null, true);
    
    wolf.animations.add('attack', Phaser.Animation.generateFrameNames('Wolf', 0, 21, '', 4), 30, true, false);
    wolf.animations.add('move', Phaser.Animation.generateFrameNames('Wolf', 22, 37, '', 4), 30, true, false);
    wolf.animations.add('idle', Phaser.Animation.generateFrameNames('Wolf', 38, 61, '', 4), 30, true, false);
    wolf.animations.add('death', Phaser.Animation.generateFrameNames('Wolf', 62, 89, '', 4), 24, true, false);
    wolf.animations.add('hit', Phaser.Animation.generateFrameNames('Wolf', 90, 100, '', 4), 24, true, false);
    
    wolf.animations.play('idle', null, true);
   
//    move = true;
    
    wizard.inputEnabled = true;
//    wizard.input.pixelPerfect = true;
    wizard.input.useHandCursor = true;
//    wizard.events.onInputDown.add(changeAnimation, this);
    //anchor exacto: (regPoint.x/sourceSize.w, regPoint.y/sourceSize.h)
    wizard.anchor.setTo(0.35, 0.8); //so it flips around its middle
    //wizard.anchor.setTo(0.2, 1);
    wizard.isPC = true;
    
    wizard.timer = game.time.create(false);
    wizard.attackInterval = 1000; //milliseconds
    wizard.range = 40;
    wizard.health = 200;
    wizard.maxHealth = 200;
    wizard.attackDamage = 20;
    
    wolf.timer = game.time.create(false);
    wolf.attackInterval = 1000; //milliseconds
    wolf.range = 60;
    wolf.health = 200;
    wolf.attackDamage = 30;
    
    wolf.inputEnabled = true;
    wolf.input.useHandCursor = true;

    wolf.anchor.setTo(0.5, 0.88);
    
    wolf.isPC = false;
    
    wizard.offsetX = 0;
    wizard.offsetY = 0;
    wolf.offsetX = -3;
    wolf.offsetY = -5;
    wizard.speed = 100;
    wolf.speed = 200;
    

    wizard.events.onInputDown.add(getSelectionRing);
    wolf.events.onInputDown.add(getSelectionRing);
    
    //Drawing transparent rectangles for bottom interface:
    g = game.add.graphics(0, 0);
    g.fillColor = 0x000000;
    g.fillAlpha = 0.53;
    g.drawRect(0, bg.height - 68, bg.width, 68);
    g.fillColor = 0xffffff;
    g.fillAlpha = 0.72;
    g.drawRect(25, bg.height - 48, bg.width - 50, 28);
    game.add.sprite(20, bg.height - 56, 'buttonP');
    game.add.sprite(400, bg.height - 56, 'buttonF');
    game.add.sprite(450, bg.height - 56, 'buttonL');
    game.add.sprite(bg.width - 65, bg.height - 56, 'buttonP');
    button = game.add.sprite(bg.width - 96, 16, 'iconWizard');
//    button.inputEnabled = true;
//    button.input.useHandCursor = true;
//    button.events.onInputDown.add(getSelectionRing, wizard);
    
    wizard.healthBar = game.add.sprite(bg.width - 90, 93, 'red');
    wizard.healthBar.width = 71;
    wizard.healthBar.height = 0;
    wizard.healthBar.alpha = 0.5;
    wizard.healthBar.anchor.setTo(0, 1);
    
    game.add.button(400, bg.height - 56, 'buttonF', fireball, this, 0, 0, 1);//over, normal, press
    game.add.button(20, bg.height - 56, 'buttonP', fireball, this, 0, 0, 1);
    game.add.button(450, bg.height - 56, 'buttonL', fireball, this, 0, 0, 1);
    game.add.button(bg.width - 65, bg.height - 56, 'buttonP', fireball, this, 0, 0, 1);

    //Interface text:
    text = game.add.bitmapText(100, bg.height - 50, 'Daerion', { font: '32px AgencyFB', align: 'center' });
    game.input.mouse.mouseDownCallback = mouseClick;
}

//function getSelectionRing(target, pointer) {
//    if (pointer && (pointer.button === 2)) { //right click
//        if (!alreadyProcessed) {
//            if (mode === "normal" && sRing.selected && sRing.selected.isPC && target && (!target.isPC) && target.alive) { //player wants to attack
//                sRing.selected.chasing = target;
//            }
//            else if (mode === "select") //cancel attack
//            {
//                mode = "normal";
//            }
//        }
//    }
//    else if (target || (target = sRing.selected)) {
//        sRing.scale.x = target.width / 80;
//        sRing.x = target.x - sRing.width / 2 + (target.offsetX || 0);
//        sRing.y = target.y - sRing.height / 2 + (target.offsetY || 0);
//        sRing.selected = target;
//    }
//}

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
                    alert("effect");
                    mode = "normal";
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
//    wolf.chasing = wizard;
    var i, j, item, p, range, timeElapsed;
    var offset = 4;
    
    for (i = 0; i < trees.length; i += 1) {
        for (j = 0; j < characters.length; j += 1) {
            game.physics.collide(trees[i], characters[j]);
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
                            //decrease enemy's health -- if its dead, play death animation, item.chasing = null
                            item.chasing.health -= item.attackDamage;
                            if (item.chasing.isPC)
                            {
                                item.chasing.healthBar.height = (item.chasing.health < 0)? 71 : 71 - item.chasing.health * 71 /item.chasing.maxHealth;
                            }
                            if (item.chasing.health <= 0)
                            {
                                item.chasing.animations.play('death', null, false);
                                item.chasing.alive = false;
                                item.chasing.body.velocity.setTo(0, 0);
                                item.chasing = null;
                            }
                            else if (item.chasing.animations.currentAnim.name === 'idle') {
                                item.chasing.animations.play('hit', null, false);
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
    
//    if (wolf.isMoving) {
//        if ((wolf.x > wolf.dest.x - offset) && (wolf.x < wolf.dest.x + offset) && (wolf.y > wolf.dest.y - offset) && (wolf.y < wolf.dest.y + offset)) {
//            wolf.isMoving = false;
//            wolf.animations.play('idle', null, true);
//            wolf.body.velocity.setTo(0, 0);
//        }
//    }

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

//function changeAnimation() {
//    var animations = ['attack', 'idle', 'move'];
//    contador = (contador + 1) % 3;
//    wizard.animations.play(animations[contador], null, true);
//    if (contador === 2) {
//        move = true;
//    } else {
//        move = false;
//    }
//    wizard.scale.x *= -1; //flipped
//    wolf.scale.x *= -1;
//}

function moveTo(x, y, target) {
    game.physics.moveToXY(target, x, y, target.speed);
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

function fireball () {
    mode = "select";
}

function render() {
//    game.debug.renderSpriteInfo(trees[3], 32, 32);
//    game.debug.renderSpriteBounds(wizard);
//    game.debug.renderSpriteBounds(wolf);
//    game.debug.renderPoint(wizard.input._tempPoint);
//    game.debug.renderSpriteBody(wizard);
//    game.debug.renderSpriteBody(wolf);
//    game.debug.renderPoint(new Phaser.Point(wizard.x, wizard.y));
//    game.debug.renderPoint(new Phaser.Point(wolf.x, wolf.y));
//    game.debug.renderPhysicsBody(wizard.body);
//    game.debug.renderPhysicsBody(wolf.body);
//    game.debug.renderSpriteBody(wizard);
//    var i;
//    for (i = 0; i < trees.length; i += 1) {
//        game.debug.renderSpriteBody(trees[i]);
//    }
}