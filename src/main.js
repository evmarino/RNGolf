// Code Practice: RNGolf
// Name: Evelyn Marino
// Date: 01/29/2025

'use strict'

//const { Physics } = require("phaser")

let config = ({
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    physics: {

        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: [ Play ]
});

let game = new Phaser.Game(config)

let { width, height } = game.config