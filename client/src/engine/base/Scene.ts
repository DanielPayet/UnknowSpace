import { Force } from '../physic/Force';
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

        window.onresize = () => { this.updateCanvasResolution(); };
        this.updateCanvasResolution();

        window.setInterval(() => {
            this.update();
        }, 20);
    }

    private updateCanvasResolution() {
        this.canvas.height = this.canvas.clientHeight;
        this.canvas.width = this.canvas.clientWidth;
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
            context.viewport(0, 0, this.canvas.width, this.canvas.height);
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
