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
    public canva: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public canvaContext: CanvasRenderingContext2D = null;
    public webglContext: WebGLRenderingContext = null;
    private backgroundColor: string = '#050508';
    
    private forces:Set<Force> = new Set();

    constructor(canva: HTMLCanvasElement) {
        super();
        this.canva = canva;
        this.webglContext = canva.getContext("webgl") || canva.getContext("experimental-webgl");
        if (this.webglContext === null) {
            this.canvaContext = canva.getContext('2d');
        }
        const tmpWindow: any = window;

        InputEventListener.init();
        
        let gravity = new ConstantForce();
        gravity.component.y = -5;
        this.addChild(gravity);
        
        let radial = new RadialForce();
        radial.force = 100;
        radial.position.x = 100;
        this.addChild(radial);
        
        radial = new RadialForce();
        radial.force = 100;
        radial.position.x = 100;
        radial.position.y = -50;
        this.addChild(radial);
        
        let physical = new SquarePrimitive();
        physical.position.z = 0;
        physical.position.x = 0;
        physical.position.y = 0;
        physical.rotationZ = 0;
        physical.width = 20;
        physical.height = 20;
        physical.mass = 10;
        physical.isPhysical = true;
        this.addChild(physical);

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
        square.position.x = 150;
        square.position.y = 0-100;
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
            context.viewport(0, 0, camera.scene.canva.width, camera.scene.canva.height);
            context.clearColor(0.0, 0.0, 0.05, 1.0);
            context.clearDepth(1.0);
            context.enable(context.DEPTH_TEST);
            context.depthFunc(context.LEQUAL);
            context.enable(context.BLEND);
            context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
        }
        else {
            this.canvaContext.clearRect(0, 0, this.canva.width, this.canva.height);
            this.canvaContext.fillStyle = this.backgroundColor;
            this.canvaContext.fillRect(0, 0, this.canva.width, this.canva.height);
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