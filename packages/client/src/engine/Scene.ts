import {Entity} from './Entity';
import {SquarePrimitive} from './primitives/SquarePrimitive';

export class Scene {
    private canva: HTMLCanvasElement = null;
    private context: CanvasRenderingContext2D = null;
    private rootEntity: Entity = null;
    
    constructor(canva: HTMLCanvasElement) {
        this.canva = canva;
        this.context = canva.getContext('2d');
        this.rootEntity = new Entity();
        
        let square = new SquarePrimitive();
        square.position.x = 200;
        square.position.y = 200;
        this.rootEntity.addChild(square);
    }

    public render() {
        this.context.clearRect(0, 0, this.canva.width, this.canva.height);
        this.rootEntity.render(this.context);
    }
}