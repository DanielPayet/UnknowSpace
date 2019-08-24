import {Renderable} from './Renderable';
import {Force} from '../physic/Force';

export class Solid extends Renderable {
    public isPhysical:boolean = false;
    public velocity:any = {x: 0, y: 0, z: 0};
    public nextPosition:any = {x: 0, y: 0, z: 0};
    public mass:number = 0;

    public applyForce(force: Force) {
        if (this.isPhysical) {
            let component = force.getComponentRelativeTo(this);
            this.velocity.x += component.x;
            this.velocity.y += component.y;
            this.velocity.z += component.z;
        }
    }

    public prepareNextPositioning() {    
        if (this.isPhysical) {
            this.nextPosition.x = this.position.x + this.velocity.x;
            this.nextPosition.y = this.position.y + this.velocity.y;
            this.nextPosition.z = this.position.z + this.velocity.z;
        }
    }

    public applyNextPositioning() {
        if (this.isPhysical) {
            this.position.x = this.nextPosition.x;
            this.position.y = this.nextPosition.y;
            this.position.z = this.nextPosition.z;
        }
    }
}