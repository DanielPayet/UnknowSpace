import { Emitter } from '../effect/Emitter';
import { ConstantForce } from '../physic/ConstantForce';
import { Force } from '../physic/Force';
import { RadialForce } from '../physic/RadialForce';
import { CirclePrimitive } from '../primitives/CirclePrimitive';
import { SpritePrimitive } from '../primitives/SpritePrimitive';
import { SquarePrimitive } from '../primitives/SquarePrimitive';
import { InputEventListener } from '../services/InputEventListener';
import { PhysicManager } from '../services/PhysicManager';
import { Camera } from './Camera';
import { Entity } from './Entity';
import { Solid } from './Solid';

class Window {
    WebGLRenderingContext: WebGLRenderingContext;
}

export class Scene extends Entity {
    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public canvasContext: CanvasRenderingContext2D = null;
    public webglContext: WebGLRenderingContext = null;
    private backgroundColor: string = '#050508';
    private forces: Set<Force> = new Set();

    private solidDescendentsCache: any[] = [];

    constructor(canvas: HTMLCanvasElement) {
        super();
        this.canvas = canvas;
        this.webglContext = canvas.getContext("webgl") || canvas.getContext("webgl2");
        if (this.webglContext === null) {
            this.canvasContext = canvas.getContext('2d');
        }
        const tmpWindow: any = Window;

        InputEventListener.init();

        if (true) {

            const gravity = new ConstantForce();
            gravity.component.y = -10;
            this.addChild(gravity);

            const radial = new RadialForce();
            radial.force = 50;
            radial.position.x = 100;
            this.addChild(radial);

            for (let i = 0; i < 20; i++) {
                const physical = new CirclePrimitive();
                physical.radius = 10;
                physical.setColorHSL(((i * 638) % 100), 50, 50);
                physical.velocity.x = 0;
                physical.position.z = 0;
                physical.position.x = (i * 638) % 200;
                physical.position.y = (i * 92) % 200;
                physical.rotationZ = 0;
                physical.mass = 10;
                physical.isPhysical = true;
                this.addChild(physical);
            }
        }

        //let box = new SpritePrimitive('textures/box.jpg');
        //box.position.z = 0;
        //box.position.x = -260;
        //box.position.y = -269;
        //box.rotationZ = 0;
        //box.imageScale = 0.05;
        //this.addChild(box);
        //box = new SpritePrimitive('textures/box.jpg');
        //box.position.z = 0;
        //box.position.x = -200;
        //box.position.y = -269;
        //box.rotationZ = 0;
        //box.imageScale = 0.05;
        //this.addChild(box);
        //box = new SpritePrimitive('textures/box.jpg');
        //box.position.z = 0;
        //box.position.x = -240;
        //box.position.y = -219;
        //box.rotationZ = 0;
        //box.imageScale = 0.05;
        //this.addChild(box);

        const plan = new SquarePrimitive();
        plan.position.z = 0;
        plan.position.x = 0;
        plan.position.y = 0;
        plan.rotationZ = 0;
        plan.width = 800;
        plan.height = 10;
        plan.isPhysical = true;
        this.addChild(plan);

        //DUMMY
        //square = new SquarePrimitive();
        //square.position.z = 0;
        //square.position.x = 100;
        //square.position.y = 0;
        //square.rotationZ = 45;
        //square.width = 5;
        //square.height = 5;
        //this.addChild(square);
    }

    public getForces() {
        return this.forces;
    }

    public solidDescendents() {
        return this.solidDescendentsCache;
    }

    public updateSolidDescendentsCache() {
        this.solidDescendentsCache = [];
        this.descendents().forEach((descendent) => {
            if (descendent instanceof Solid) {
                this.solidDescendentsCache.push(descendent);
            }
        });
    }

    public update() {
        super.update();
        this.updateAbsolutePositionning();
        PhysicManager.compute(this.solidDescendents(), this.getForces());
        InputEventListener.notifyKeyPress();
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

    public childAdded(child: Entity) {
        if (child instanceof Force) {
            this.forces.add(child);
        }
        super.childAdded(child);
        this.updateSolidDescendentsCache();
    }

    public childRemoved(child: Entity) {
        if (child instanceof Force) {
            this.forces.delete(child);
        }
        super.childRemoved(child);
        this.updateSolidDescendentsCache();
    }
}
