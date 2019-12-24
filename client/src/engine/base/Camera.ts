import {Entity} from './Entity';
import {Renderable} from './Renderable';
import {Scene} from './Scene';

export class Camera extends Entity {
    public scene: Scene;
    public zoom: number = 1;
    public perspectiveFactor: number = 2.5;
    private negativeRenderStack: Renderable[][] = [];
    private positiveRenderStack: Renderable[][] = [];
    public renderingLimits: any = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    public targetFPS: number = 40;
    public currentFPS: number = 0;
    private lastRenderTime: number = 0;
    private cumulTime: number = 0;

    constructor(scene: Scene) {
        super();
        this.registerForKeyPressEvent();
        this.registerForScrollEvent();
        this.scene = scene;
    }

    public startRender() {
        this.renderRoutine();
    }

    public renderRoutine() {
        const operations = () => {
            requestAnimationFrame(operations);
            this.render();
            this.updateFPS();
        };
        requestAnimationFrame(operations);
    }

    public updateFPS() {
        const currentTime = (new Date()).getTime();
        const milliseconds = currentTime - this.lastRenderTime;
        this.lastRenderTime = currentTime;
        this.cumulTime += milliseconds;
        this.currentFPS = Math.round(1000 / milliseconds);

        if (this.cumulTime > 400) {
            this.cumulTime = 0;
            document.getElementById("fps").innerHTML = this.currentFPS + ' FPS';
        }
    }

    public pushInRenderStack(renderable: Renderable) {
        const positive: boolean = (renderable.absolutePosition.z > 0);
        const zPosition: number = positive ? renderable.absolutePosition.z : - renderable.absolutePosition.z;
        const renderStack = positive ? this.positiveRenderStack : this.negativeRenderStack;
        if (renderStack[zPosition] === undefined) {
            renderStack[zPosition] = [];
        }
        renderStack[zPosition].push(renderable);
    }

    private clearRenderStack() {
        this.positiveRenderStack = [];
        this.negativeRenderStack = [];
    }

    private updateRenderingLimits() {
        this.renderingLimits.minX = this.position.x - (this.scene.canvas.width / this.zoom);
        this.renderingLimits.maxX = this.position.x + (this.scene.canvas.width / this.zoom);
        this.renderingLimits.minY = this.position.y - (this.scene.canvas.width / this.zoom);
        this.renderingLimits.maxY = this.position.y + (this.scene.canvas.width / this.zoom);
    }

    public render(camera?: Camera) {
        if (camera === undefined) {
            this.updateRenderingLimits();
            this.clearRenderStack();
            this.scene.prepareRenderStack(this);
            this.scene.render(this);
            if (this.scene.webglContext !== null) {
                Object.keys(this.negativeRenderStack).reverse().forEach((zPosition) => {
                    this.negativeRenderStack[zPosition].forEach((renderable) => {
                        renderable.webglRender(this);
                    });
                });
                Object.keys(this.positiveRenderStack).forEach((zPosition) => {
                    this.positiveRenderStack[zPosition].forEach((renderable) => {
                        renderable.webglRender(this);
                    });
                });
            }
            else {
                Object.keys(this.negativeRenderStack).reverse().forEach((zPosition) => {
                    this.negativeRenderStack[zPosition].forEach((renderable) => {
                        renderable.render(this);
                    });
                });
                Object.keys(this.positiveRenderStack).forEach((zPosition) => {
                    this.positiveRenderStack[zPosition].forEach((renderable) => {
                        renderable.render(this);
                    });
                });
            }
        }
    }

    public scrollUp() {
        this.zoom = Math.min(1.8, (this.zoom + 0.01));
    }

    public scrollDown() {
        this.zoom = Math.max(0.1, (this.zoom - 0.01));
    }

    public keyPress(code: string) {
        const speed: number = 10;
        if (code === 'ArrowUp') {
            this.position.y += speed;
        }
        else if (code === 'ArrowDown') {
            this.position.y -= speed;
        }
        else if (code === 'ArrowLeft') {
            this.position.x -= speed;
        }
        else if (code === 'ArrowRight') {
            this.position.x += speed;
        }
    }
}
