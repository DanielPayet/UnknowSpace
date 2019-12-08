import {Entity} from '../base/Entity';
import {CirclePrimitive} from '../primitives/CirclePrimitive';

export class Emitter extends Entity {
    private particles:Entity[] = [];
    public maxParticleAmount = 50;
    public particleVelocity = 20;
    public particleVelocityVariation = 20;
    public angleSpread = 10;

    public updateElement() {
        for (let count = 0; count < 6; count ++) {
            let circle = new CirclePrimitive();
            circle.position.x = -300;
            circle.position.y = this.absolutePosition.y;
            circle.isPhysical = true;
            circle.radius = 5 + (Math.random() * 4) - 2;
            circle.mass = 100 + (Math.random() * 8) - 4;
            circle.opacity = 0.5 + (Math.random() * 1) - 0.5;

            circle.velocity.y = this.particleVelocity + (Math.random() * 2*this.particleVelocityVariation) - (this.particleVelocityVariation / 2);
            circle.velocity.x = (Math.random() * 10) - 5;

            this.particles.push(circle);
            while (this.particles.length > this.maxParticleAmount) {
                this.particles.shift().delete();
            }

            this.rootEntity().addChild(circle);
        }
    }
}