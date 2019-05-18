import Socket from "./socket";

import {Scene} from './engine/Scene';

const socket = new Socket();

// Get the canvas element from the DOM.
const canva: HTMLCanvasElement = document.getElementById("renderCanvas") as HTMLCanvasElement;

(function() {
    window.onresize = () => { updateCanvaResolution(); }
    updateCanvaResolution();
    function updateCanvaResolution() {
        canva.height = canva.offsetHeight;
        canva.width = canva.offsetWidth;
    }
})();

let scene = new Scene(canva);

setInterval(function() {
    scene.render();
}, 20);

