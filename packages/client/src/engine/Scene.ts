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
        console.log(window);

        InputEventListener.init();

        const planet = new SpritePrimitive('planet/MeridaOne.png');
        planet.imageScale = 0.1;

        for (let i = -50; i < 130; i += 5) {
            const planetTest = new SpritePrimitive('planet/MeridaOne.png');
            planetTest.imageScale = 0.1;
            planetTest.position.z = i;
            planetTest.position.x = i*39%800;
            planetTest.position.y = i*589%800;
            this.addChild(planetTest);
        }

        const planetEffect = new SpritePrimitive('effect/MeridaOneEffect.png');
        planetEffect.imageScale = 0.28;
        planetEffect.blendMode = 'hard-light';
        planet.addChild(planetEffect);
        this.addChild(planet);

    }

    public update() {
        InputEventListener.notifyKeyPress();
        super.update();
    }

    public render(camera: Camera) {
        if (this.webglContext !== null) {
            const context = this.webglContext;
            const x = camera.position.x - (camera.scene.canva.width / 2);
            const y = camera.position.y - (camera.scene.canva.height / 2);
            context.viewport(-x, -y, camera.scene.canva.width, camera.scene.canva.height);
            context.clearColor(0.1, 0.0, 0.0, 1.0);
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