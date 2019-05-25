// import Socket from "./socket";

import { Scene } from './engine/Scene';

// const socket = new Socket();

// Get the canvas element from the DOM.
const canva: HTMLCanvasElement = document.getElementById("renderCanvas") as HTMLCanvasElement;

(() => {
    window.onresize = () => { updateCanvaResolution(); }
    updateCanvaResolution();
    function updateCanvaResolution() {
        canva.height = 2 * canva.offsetHeight;
        canva.width = 2 * canva.offsetWidth;
    }
})();

const scene = new Scene(canva);

setInterval( () => {
    scene.update();
    scene.render();
}, 20);
