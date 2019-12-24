import {Force} from '../physic/Force';
import {Renderable} from './Renderable';

export enum SolidBodyType {'concave', 'convex', 'box', 'circle'}

export class Solid extends Renderable {
    public isPhysical: boolean = false;
    public velocity: any = {x: 0, y: 0, z: 0};
    public nextPosition: any = {x: 0, y: 0, z: 0};
    public mass: number = 0;

    public solidBodyType: SolidBodyType = SolidBodyType.box;

    public collidesWith(solid: Solid) {
        if (this.absolutePosition.z === solid.absolutePosition.z) {
            const distance = Math.sqrt(((this.absolutePosition.x - solid.absolutePosition.x) ** 2) + ((this.absolutePosition.y - solid.absolutePosition.y) ** 2));
            const minDistance = distance - (this.maxRadius + solid.maxRadius);

            if (minDistance <= 0) {
                const maxDistance = distance - (this.minRadius + solid.minRadius);
                if (maxDistance <= 0) {
                    return true;
                }

                for (let index = 0; index < this.vertices.length; index += 1) {
                    if (solid.hoversCoordinates(this.absolutePositionOfVertex(this.vertices[index]))) {
                        return true;
                    }
                }

                for (let index = 0; index < solid.vertices.length; index += 1) {
                    if (this.hoversCoordinates(solid.absolutePositionOfVertex(solid.vertices[index]))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public absolutePositionOfVertex(vertex) {
        let radian = 0;
        if (vertex.x === 0) {
            radian = (vertex.y > 0) ? 0 : Math.PI;
        }
        else if (vertex.y === 0) {
            radian = (vertex.x > 0) ? (Math.PI / 2) : - (Math.PI / 2);
        }
        else {
            radian = Math.atan(vertex.x / vertex.y);
            if (vertex.y < 0) {
                radian += Math.PI;
            }
        }
        const radianAbsoluteRotationZ = (this.absoluteRotationZ * Math.PI / 180);
        const angle = (Math.PI / 2) - (radian + radianAbsoluteRotationZ);
        const distanceFromOrigin = Math.sqrt((vertex.x ** 2) + (vertex.y ** 2));
        return {
            x: (Math.cos(angle) * distanceFromOrigin) + this.absolutePosition.x,
            y: (Math.sin(angle) * distanceFromOrigin) + this.absolutePosition.y,
        };
    }

    /* Doesn't supports concave solid yet */
    public hoversCoordinates(vertex: any): boolean {
        if (this.solidBodyType === SolidBodyType.circle) {
            const distance = Math.sqrt(((this.absolutePosition.x - vertex.x) ** 2) + ((this.absolutePosition.y - vertex.y) ** 2));
            return (distance < this.maxRadius);
        }
        else {
            let currentSide = null;
            for (let index = 0; index < this.vertices.length; index += 1) {
                const vertex1 = this.absolutePositionOfVertex(this.vertices[index]);
                const vertex2 = this.absolutePositionOfVertex(this.vertices[(index + 1) % this.vertices.length]);
                const side = (((vertex2.x - vertex1.x) * (vertex.y - vertex1.y) - (vertex2.y - vertex1.y) * (vertex.x - vertex1.x)) > 0);
                if ((currentSide !== null) && (currentSide !== side)) {
                    return false;
                }
                currentSide = side;
            }
            return true;
        }
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
