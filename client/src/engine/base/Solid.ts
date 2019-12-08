import {Force} from '../physic/Force';
import {Renderable} from './Renderable';

export enum SolidBodyType {'concave', 'convex', 'box', 'circle'}

export class Solid extends Renderable {
    public isPhysical: boolean = false;
    public velocity: any = {x: 0, y: 0, z: 0};
    public nextPosition: any = {x: 0, y: 0, z: 0};
    public mass: number = 0;

    public solidBodyType: SolidBodyType = SolidBodyType.box;

    public log = true;
    
    public collideWith(solid: Solid) {
        if (this.absolutePosition.z === solid.absolutePosition.z) {
            const distance = Math.sqrt(((this.absolutePosition.x - solid.absolutePosition.x) ** 2) + ((this.absolutePosition.y - solid.absolutePosition.y) ** 2));
            const minDistance = distance - (this.maxRadius + solid.maxRadius);
            
            if (this.log && distance < 30) {
                this.log = false;
                console.log(this.maxRadius + ' | ' + this.boundingBox.width);
            }
            
            if (minDistance <= 0) {
                const maxDistance = distance - (this.minRadius + solid.minRadius);
                if (maxDistance <= 0) {
                    return true;
                }
                return false; // not actually false (TODO: box collision system)
            }
        }
        return false;
    }

    public applyForce(force: Force) {
        if (this.isPhysical) {
            const component = force.getComponentRelativeTo(this);
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
            this.velocity.x *= 0.99;
            this.velocity.y *= 0.99;
            this.velocity.z *= 0.99;
        }
    }
}
