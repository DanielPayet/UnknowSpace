import {Solid} from '../base/Solid';
import {Force} from './Force';

export class RadialForce extends Force {
    public distanceFactor: number = 2;

    public getComponentRelativeTo(solid: Solid): any {
        if (solid.mass > 0) {
            const distance = Math.max(0.01, Math.sqrt(((this.position.x - solid.position.x) ** 2) + ((this.position.y - solid.position.y) ** 2)));
            return {
                x: this.force * (this.position.x - solid.position.x) / (solid.mass * (distance ** this.distanceFactor)),
                y: this.force * (this.position.y - solid.position.y) / (solid.mass * (distance ** this.distanceFactor)),
                z: 0,
            };
        }
        else {
            return {x: 0, y: 0, z: 0};
        }
    }
}
