import { Entity } from './Entity';
import { Solid } from './Solid';
import { Camera } from './Camera';
import { Force } from '../physic/Force';
import { SquarePrimitive } from '../primitives/SquarePrimitive';
import { SpritePrimitive } from '../primitives/SpritePrimitive';
import { CirclePrimitive } from '../primitives/CirclePrimitive';
import { ConstantForce } from '../physic/ConstantForce';
import { RadialForce } from '../physic/RadialForce';
import { InputEventListener } from '../services/InputEventListener';
import { Physic } from '../services/Physic';

class window {
    WebGLRenderingContext: WebGLRenderingContext;
}

export class Scene extends Entity {
    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public canvasContext: CanvasRenderingContext2D = null;
    public webglContext: WebGLRenderingContext = null;
    private backgroundColor: string = '#050508';
    
    private forces:Set<Force> = new Set();

    constructor(canvas: HTMLCanvasElement) {
        super();
        this.canvas = canvas;
        this.webglContext = canvas.getContext("webgl") || canvas.getContext("webgl2");
        if (this.webglContext === null) {
            this.canvasContext = canvas.getContext('2d');
        }
        const tmpWindow: any = window;

        InputEventListener.init();
        
        let gravity = new ConstantForce();
        gravity.component.y = -5;
        this.addChild(gravity);
        
        let radial = new RadialForce();
        radial.force = 50;
        radial.position.x = 100;
        this.addChild(radial);
        
        radial = new RadialForce();
        radial.force = 50;
        radial.position.x = 400;
        radial.position.y = -150;
        this.addChild(radial);
        
        for (let i = 0; i < 10; i++) {
        let physical = new CirclePrimitive();
            physical.radius = 10;
            physical.setColorHSL(((i * 638) % 100), 50, 50);
            physical.position.z = 0;
            physical.position.x = (i * 638) % 100;
            physical.position.y = (i * 92) % 100;
            physical.rotationZ = 0;
            physical.mass = 10;
            physical.isPhysical = true;
            this.addChild(physical);
        }
        
        let box = new SpritePrimitive('textures/box.jpg');
        box.position.z = 0;
        box.position.x = -260;
        box.position.y = -269;
        box.rotationZ = 0;
        box.imageScale = 0.05;
        this.addChild(box);
        box = new SpritePrimitive('textures/box.jpg');
        box.position.z = 0;
        box.position.x = -200;
        box.position.y = -269;
        box.rotationZ = 0;
        box.imageScale = 0.05;
        this.addChild(box);
        box = new SpritePrimitive('textures/box.jpg');
        box.position.z = 0;
        box.position.x = -240;
        box.position.y = -219;
        box.rotationZ = 0;
        box.imageScale = 0.05;
        this.addChild(box);
    
        let square = new SquarePrimitive();
        square.position.z = 0;
        square.position.x = 0;
        square.position.y = -300;
        square.rotationZ = 0;
        square.width = 800;
        square.height = 10;
        this.addChild(square);
                
        //DUMMY
        square = new SquarePrimitive();
        square.position.z = 0;
        square.position.x = 100;
        square.position.y = 0;
        square.rotationZ = 45;
        square.width = 5;
        square.height = 5;
        this.addChild(square);
        square = new SquarePrimitive();
        square.position.z = 0;
        square.position.x = 400;
        square.position.y = -150;
        square.rotationZ = 45;
        square.width = 5;
        square.height = 5;
        this.addChild(square);
    }
    
    public getForces() {
        return this.forces;
    }
    
    public solidDescendents() {
        let solids = [];
        this.descendents().forEach((descendent) => {
            if (descendent instanceof Solid) {
                solids.push(descendent);
            }
        });
        return solids;
    }

    public update() {
        InputEventListener.notifyKeyPress();
        Physic.compute(this.solidDescendents(), this.getForces());
        super.update();
    }

    public render(camera: Camera) {
        if (this.webglContext !== null) {
            const context = this.webglContext;
            context.viewport(0, 0, camera.scene.canvas.width, camera.scene.canvas.height);
            context.clearColor(0.0, 0.0, 0.05, 1.0);
            context.clearDepth(1.0);
            context.enable(context.DEPTH_TEST);
            context.depthFunc(context.LEQUAL);
            context.enable(context.BLEND);
            context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
        }
        else {
            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.canvasContext.fillStyle = this.backgroundColor;
            this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        super.render(camera);
    }
    
    // SCENE SPECIFIC FUNCTION
    
    public childAdded(child:Entity) {
        if (child instanceof Force) {
            this.forces.add(child);
        }
        super.childAdded(child);
    }
    
    public childRemoved(child:Entity) {
        if (child instanceof Force) {
            this.forces.delete(child);
        }
        super.childRemoved(child);
    }
}