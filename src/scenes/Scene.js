"use strict";

import Phaser from 'phaser';
import {game} from '../index';



export class Scene extends Phaser.Scene {
    /// this class is just for testing
    constructor() {
        super({
            key: "Scene"
        });
        this.width = game.config.width;
        this.height = game.config.height;
        this.COLOR_PRIMARY = 0x4e342e;
        this.COLOR_LIGHT = 0x7b5e57;
    }
    create() {

        this.createLeftArrow();


        //set table position and size
        let tableXPosition = this.width / 2;
        let tableYPosition = this.height / 4 * 2;
        let tableWidth = this.width * 0.75;
        let tableHeight = this.height / 4 * 2;



        //return new RexPlugins.UI.GridTable(scene, {
        //this works
        //return this.rexUI.add.GridTable(  .........this throws Error   Uncaught TypeError: Cannot read property 'destroy' of undefined
        //when clicking arrow

        let tabel =
            new RexPlugins.UI.GridTable(this, {
                x: tableXPosition,
                y: tableYPosition,
                items: ["test1", "test2"],
                background: this.rexUI.add.roundRectangle(0, 0, 20, 100, 10,
                    this.COLOR_PRIMARY),

                table: {
                    width: tableWidth,
                    height: tableHeight,
                    cellWidth: tableWidth,
                    cellHeight: tableHeight * 0.2,
                    columns: 1,
                    mask: {
                        padding: 1,
                    },
                },
                scrollMode: 0,
                slider: {
                    track: this.rexUI.add.roundRectangle(0, 0, this.width * 0.02, this.width * 0.018, this.width * 0.018,
                        "0x260e04"),
                    thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, this.width * 0.016,
                        this.COLOR_LIGHT),
                },

                scroller: {
                    threshold: 10,
                    slidingDeceleration: 5000,
                    backDeceleration: 2000,
                },

                //setup one table cell
                createCellContainerCallback: function (cell) {
                    let scene = cell.scene,
                        width = cell.width,
                        height = cell.height,
                        item = cell.item,
                        index = cell.index,
                        name = cell.item.id;


                    let icon = scene.add.image(0, 0, "1");
                    icon.﻿setDisplaySize(cell.height / 2, cell.height / 2);﻿


                    //return new RexPlugins.UI.Label(scene, {
                    //this works
                    //return this.rexUI.add.label(  .........this throws Error   Uncaught TypeError: Cannot read property 'destroy' of undefined
                    //when clicking arrow

            return new RexPlugins.UI.Label(scene, {
                width: width,
                height: height,
                name: name,
                background: scene.rexUI.add.roundRectangle(0, 0,
                    20, 20, 0).setStrokeStyle(5, "0x260e04"),
                icon: icon,
                text: scene.add.text(0, 0, item.name, {
                    fontSize: width * 0.07
                }),

                space: {
                    icon: 0,
                    left: 0,
                    right: 0,
                    top: -50,
                    bottom: -50,
                }
            });
                },
            })
                .layout();
    }

    preload() {
    }

    createLeftArrow() {
        let leftArrow =
            this.add.image(
                this.width / 4, this.height / 4 * 3.5, "arrow_left");
        leftArrow.﻿setDisplaySize(this.width / 6, this.width / 8);﻿
        leftArrow.setInteractive();
        leftArrow.on("pointerdown", function () {
            this.scene.start("SceneMain");

        }, this);
        return leftArrow;
    }
}





