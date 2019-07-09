"use strict";


const COLOR_DARK = 0x260e04;

import phaser from 'phaser'
import {game} from '../index'

export class SceneMain extends phaser.Scene {
    constructor() {
        super({
            key: "SceneMain"
        });
        this.width = game.config.width;
        this.height = game.config.height;
    }

    create() {

        let label = this.add.text(this.width / 4, this.height / 4, 'Switch Scene', {
             fontSize: this.width * 0.08,
             fontStyle: 'bold',
             color: '#2E7EAF',
             align: 'center',
             stroke: '#fff',
             strokeThickness: 20,
        });
        label.setInteractive();

        label.on("pointerup", function () {
            this.scene.start("Scene");
        }, this);




    }
    preload() {

        this.load.image("arrow_left",
            "assets/arrow_left.png");

    }
}




