import {Force} from './Force';
import {Solid} from '../base/Solid';

export class ConstantForce extends Force {
    public component:any = {x: 0, y: 0, z: 0};
    
    public getComponentRelativeTo(solid: Solid):any {
        if (solid.mass > 0) {
            return { x: (this.component.x / (solid.mass * 60)), y: (this.component.y / (solid.mass * 60)), z: (this.component.z / (solid.mass * 60)) }
        }
        else {
            return { x: (this.component.x / 60), y: (this.component.y / 60), z: (this.component.z / 60) }
        }
    }
}