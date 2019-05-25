// import Socket from "./socket";

import {Scene} from './engine/Scene';
import {Camera} from './engine/Camera';

// const socket = new Socket();

// Get the canvas element from the DOM.
const canva: HTMLCanvasElement = document.getElementById("renderCanvas") as HTMLCanvasElement;

(function() {
    window.onresize = () => { updateCanvaResolution(); }
    updateCanvaResolution();
    function updateCanvaResolution() {
        canva.height = 2*canva.offsetHeight;
        canva.width = 2*canva.offsetWidth;
    }
})();

const scene = new Scene(canva);
const camera = new Camera(scene);
scene.addChild(camera);

setInterval(function() {
    scene.update();
    camera.render();
}, 20);

