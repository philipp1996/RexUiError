import UIPlugin from './js/templates/ui/ui-plugin.js';
import Phaser from 'phaser'
import { SceneMain } from './scenes/SceneMain'
import { Scene } from './scenes/Scene'


var config = {
  type: Phaser.WEBGL,
  renderer: Phaser.AUTO,
  backgroundColor: "#FFFFFF",
    dom: {
        createContainer: false},
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerHeight/0.75,
        height: window.innerHeight
    },
  scene: [
      SceneMain,
      Scene,
  ],
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: UIPlugin,
            mapping: 'rexUI'
        }],
    },


};


let game = new Phaser.Game(config);
export { game };
