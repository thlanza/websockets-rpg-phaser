
const config = {
    type: Phaser.AUTO,
    height: 600,
    width: 1200,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0}
        },
        
    },
    scene: Scene1
}

const game = new Phaser.Game(config);