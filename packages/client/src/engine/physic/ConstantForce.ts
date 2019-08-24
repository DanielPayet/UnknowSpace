import {Force} from './Force';
import {Movable} from '../base/Movable';

export class ConstantForce extends Force {
    public component:any = {x: 0, y: 0, z: 0};
    
    public getComponentRelativeTo(movable: Movable):any {
        return { x: (this.component.x / 60), y: (this.component.y / 60), z: (this.component.z / 60) }
    }
}