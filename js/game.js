var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
    //game.load.atlas('wizard', 'assets/wizardStarling.png', 'assets/wizardStarling.xml', null, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);
    game.load.atlas('wizard', 'assets/wizard.png', 'assets/wizard.json');
}

var wizard;
var move;
var atck;

function create() {
    wizard = game.add.sprite(100, 100, 'wizard');
    game.stage.backgroundColor = '#ff5';
    
    wizard.animations.add('attack', ['Wizard0000', 'Wizard0001', 'Wizard0002', 'Wizard0003', 'Wizard0004', 'Wizard0005', 'Wizard0006', 'Wizard0007', 'Wizard0008', 'Wizard0009', 'Wizard0010', 'Wizard0011', 'Wizard0012', 'Wizard0013', 'Wizard0014'], 50, true, false);
    wizard.animations.add('idle', ['Wizard0015', 'Wizard0016', 'Wizard0017', 'Wizard0018', 'Wizard0019', 'Wizard0020', 'Wizard0021', 'Wizard0022', 'Wizard0023', 'Wizard0024', 'Wizard0025', 'Wizard0026', 'Wizard0027', 'Wizard0028', 'Wizard0029', 'Wizard0030', 'Wizard0031', 'Wizard0032', 'Wizard0033', 'Wizard0034', 'Wizard0035', 'Wizard0036', 'Wizard0037', 'Wizard0038', 'Wizard0039', 'Wizard0040', 'Wizard0041', 'Wizard0042', 'Wizard0043', 'Wizard0044'], 30, true, false);
    wizard.animations.add('move', ['Wizard0045', 'Wizard0046', 'Wizard0047', 'Wizard0048', 'Wizard0049', 'Wizard0050', 'Wizard0051', 'Wizard0052', 'Wizard0053', 'Wizard0054', 'Wizard0055', 'Wizard0056', 'Wizard0057', 'Wizard0058', 'Wizard0059', 'Wizard0060', 'Wizard0061', 'Wizard0062', 'Wizard0063', 'Wizard0064', 'Wizard0065', 'Wizard0066', 'Wizard0067', 'Wizard0068', 'Wizard0069', 'Wizard0070', 'Wizard0071'], 30, true, false);

    //bot.velocity.x = -100;
    wizard.animations.play('move', null, true);
    wizard.input.start(0, false, true);
    move = true;
    atck = false;
}

function update() {
    if (wizard.input.justPressed(0, 30)) {
        if (atck) {
            //wizard.y += 21;
            wizard.animations.play('idle', null, true);

            atck = false;
        } else {
            //wizard.y -= 21;
            wizard.animations.play('attack', null, true);

            atck = true;
        }
    }
    if (move === true) {
        wizard.x += 1;
        if (wizard.x > game.width) {
            wizard.x = -20;
        }
    }
}