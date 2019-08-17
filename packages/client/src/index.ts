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
        canva.height = canva.clientHeight;
        canva.width = canva.clientWidth;
    }
})();

const scene = new Scene(canva);
const camera = new Camera(scene);
scene.addChild(camera);
const targetFPS = 40;
let waitingTime = 20;

let time = 0;
let cumulTime = 0;
function updateFPS() {
    const currentTime = (new Date()).getTime();
    const milliseconds = currentTime - time;
    cumulTime += milliseconds;
    time = currentTime;
    const FPS = Math.round(1000/milliseconds);

    if (FPS < targetFPS - 1) {
        waitingTime = Math.max(2, waitingTime - 1);
    }
    else if (FPS > targetFPS + 1) {
        waitingTime = Math.min(80, waitingTime + 1);
    }

    if (cumulTime > 400) {
        cumulTime = 0;
        document.getElementById("fps").innerHTML = FPS + ' FPS';
    }
}

function renderRoutine() {
    if (waitingTime == 0) { 
        requestAnimationFrame(renderRoutine);
    }
    else {
        window.setTimeout(function() {
            requestAnimationFrame(renderRoutine);
        }, waitingTime);
    }
    scene.update();
    camera.render();
    updateFPS();
}

renderRoutine();


