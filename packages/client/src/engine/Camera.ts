import {Entity} from './Entity';
import {Renderable} from './Renderable';
import {Scene} from './Scene';

export class Camera extends Entity {
    public scene:Scene;
    public zoom:number = 1;
    private negativeRenderStack:Array<Array<Renderable>> = [];
    private positiveRenderStack:Array<Array<Renderable>> = [];
    
    constructor(scene:Scene) {
        super();
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
}