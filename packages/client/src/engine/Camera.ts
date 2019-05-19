import {Entity} from './Entity';
import {Scene} from './Scene';

export class Camera extends Entity {
    public scene:Scene;
    public zoom:number = 1;
    
    constructor(scene:Scene) {
        super();
        this.scene = scene;
    }
    
    public render() {
        
    }
}