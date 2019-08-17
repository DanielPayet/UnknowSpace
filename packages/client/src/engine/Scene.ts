import { Entity } from './Entity';
import { Camera } from './Camera';
import { SquarePrimitive } from './primitives/SquarePrimitive';
import { LinePrimitive } from './primitives/LinePrimitive';
import { SpritePrimitive } from './primitives/SpritePrimitive';
import { CirclePrimitive } from './primitives/CirclePrimitive';
import { InputEventListener } from './services/InputEventListener';

class window {
    WebGLRenderingContext: WebGLRenderingContext;
}

export class Scene extends Entity {
    public canva: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public canvaContext: CanvasRenderingContext2D = null;
    public webglContext: WebGLRenderingContext = null;
    private backgroundColor: string = '#050508';

    constructor(canva: HTMLCanvasElement) {
        super();
        this.canva = canva;
        this.webglContext = canva.getContext("webgl") || canva.getContext("experimental-webgl");
        if (this.webglContext === null) {
            this.canvaContext = canva.getContext('2d');
        }
        const tmpWindow: any = window;

        InputEventListener.init();

        for (let x = -50; x < 50; x += 10) {
            for (let y = -50; y < 50; y += 10) {
                for (let z = -10; z < 10; z += 10) {
                    const planetTest = new SpritePrimitive('planet/MeridaOne.png');
                    planetTest.imageScale = 0.02;
                    planetTest.position.z = z * 5;
                    planetTest.position.x = x * 5;
                    planetTest.position.y = y * 5;
                    this.addChild(planetTest);
                }
            }
        }

    }

    public update() {
        InputEventListener.notifyKeyPress();
        super.update();
    }

    public render(camera: Camera) {
        if (this.webglContext !== null) {
            const context = this.webglContext;
            context.viewport(0, 0, camera.scene.canva.width, camera.scene.canva.height);
            context.clearColor(0.0, 0.0, 0.05, 1.0);
            context.clearDepth(1.0);
            context.enable(context.DEPTH_TEST);
            context.depthFunc(context.LEQUAL);
            context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
        }
        else {
            this.canvaContext.clearRect(0, 0, this.canva.width, this.canva.height);
            this.canvaContext.fillStyle = this.backgroundColor;
            this.canvaContext.fillRect(0, 0, this.canva.width, this.canva.height);
        }
        super.render(camera);
    }
}