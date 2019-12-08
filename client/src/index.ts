// import Socket from "./socket";
import {Camera} from './engine/base/Camera';
import {Scene} from './engine/base/Scene';

// const socket = new Socket();

// Get the canvas element from the DOM.
const canvas: HTMLCanvasElement = document.getElementById("renderCanvas") as HTMLCanvasElement;

(() => {
    window.onresize = () => { updateCanvasResolution(); };
    updateCanvasResolution();
    function updateCanvasResolution() {
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;
    }
})();

const scene = new Scene(canvas);
const camera = new Camera(scene);
scene.addChild(camera);
const targetFPS = 40;
const waitingTime = 20;

let time = 0;
let cumulTime = 0;
function updateFPS() {
    const currentTime = (new Date()).getTime();
    const milliseconds = currentTime - time;
    cumulTime += milliseconds;
    time = currentTime;
    const FPS = Math.round(1000 / milliseconds);

    if (cumulTime > 400) {
        cumulTime = 0;
        document.getElementById("fps").innerHTML = FPS + ' FPS';
    }
}

window.setInterval(() => {
    scene.update();
}, 20);

function renderRoutine() {
    requestAnimationFrame(renderRoutine);
    camera.render();
    updateFPS();
}

renderRoutine();
