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

        const merida = new SpritePrimitive('planet/MeridaOne.png');
        merida.imageScale = 0.1;
        merida.position.z = 0;
        merida.position.x = 0;
        merida.position.y = 0;
        this.addChild(merida);

        let optulus = new SpritePrimitive('planet/OptulusK27.png');
        optulus.imageScale = 0.1;
        optulus.position.z = -20;
        optulus.position.x = 180;
        optulus.position.y = 180;
        optulus.rotationZ = Math.random()*360;
        merida.addChild(optulus);
        
        optulus = new SpritePrimitive('planet/OptulusK27.png');
        optulus.imageScale = 0.1;
        optulus.position.z = -40;
        optulus.position.x = 100;
        optulus.position.y = -150;
        optulus.rotationZ = Math.random()*360;
        merida.addChild(optulus);
        
        optulus = new SpritePrimitive('planet/OptulusK27.png');
        optulus.imageScale = 0.1;
        optulus.position.z = 20;
        optulus.position.x = -180;
        optulus.position.y = 180;
        optulus.rotationZ = Math.random()*360;
        merida.addChild(optulus);
        
        optulus = new SpritePrimitive('planet/OptulusK27.png');
        optulus.imageScale = 0.1;
        optulus.position.z = 40;
        optulus.position.x = -180;
        optulus.position.y = -160;
        optulus.rotationZ = Math.random()*360;
        merida.addChild(optulus);

//        for (let x = 200; x < 1000; x += 300) {
//            for (let i = 0; i > -100; i -= 10) {
//                let square = new SquarePrimitive();
//                square.position.z = i;
//                square.position.x = x;
//                square.position.y = 0;
//                square.rotationZ = 45;
//                square.width = 10;
//                square.height = 10;
//
//                this.addChild(square);
//            }
//        }

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
            context.enable(context.BLEND);
            context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
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