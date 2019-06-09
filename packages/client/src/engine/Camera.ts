import {Entity} from './Entity';
import {Renderable} from './Renderable';
import {Scene} from './Scene';

export class Camera extends Entity {
    public scene:Scene;
    public zoom:number = 1;
    public perspectiveFactor = 0.005;
    private negativeRenderStack:Array<Array<Renderable>> = [];
    private positiveRenderStack:Array<Array<Renderable>> = [];
    
    constructor(scene:Scene) {
        super();
        this.registerForKeyPressEvent();
        this.scene = scene;
    }
    
    public pushInRenderStack(renderable:Renderable) {
        const positive = (renderable.absolutePosition.z > 0);
        const zPosition:number = positive ? renderable.absolutePosition.z : -renderable.absolutePosition.z;
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
        
    public render(camera?:Camera) {
        if (camera === undefined) {
            this.clearRenderStack();
            this.scene.prepareRenderStack(this);
            this.scene.render(this);
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
    
    public keyPress(code:string) {
        const speed:number = 8;
        if (code == 'ArrowUp') {
            this.position.y += speed;
        }
        else if (code == 'ArrowDown') {
            this.position.y -= speed;
        }
        else if (code == 'ArrowLeft') {
            this.position.x -= speed;
        }
        else if (code == 'ArrowRight') {
            this.position.x += speed;
        }
    }
}