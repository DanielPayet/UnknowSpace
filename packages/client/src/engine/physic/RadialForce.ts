import {Force} from './Force';
import {Solid} from '../base/Solid';

export class RadialForce extends Force {
    // TODO :  radius, distance facteur, amount ...
    
    public getComponentRelativeTo(solid: Solid):any {
        if (solid.mass > 0) {
            let distance = Math.max(0.01, Math.sqrt((this.position.x - solid.position.x)**2 + (this.position.y - solid.position.y)**2));
            return { 
                x: this.force * (this.position.x - solid.position.x) / distance**2, 
                y: this.force * (this.position.y - solid.position.y) / distance**2, 
                z: 0 
            }
        }
        else {
            return { x: 0, y: 0, z: 0 }
        }
    }
}