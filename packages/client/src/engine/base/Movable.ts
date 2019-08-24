import {Entity} from './Entity';
import {Force} from '../physic/Force';

export class Movable extends Entity {
    public isPhysical:boolean = false;
    public velocity:any = {x: 0, y: 0, z: 0};
    public mass:number = 0;
    
    public applyForce(force: Force) {
        let component = force.getComponentRelativeTo(this);
        this.velocity.x += component.x;
        this.velocity.y += component.y;
        this.velocity.z += component.z;
    }
}