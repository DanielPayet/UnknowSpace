import {Solid} from '../base/Solid';
import {Force} from '../physic/Force';

export class PhysicManager {
    public static compute(solids: Solid[], forces: Set<Force>) {
        solids.forEach((solid) => {
            forces.forEach((force) => {
                solid.applyForce(force);
            });
            solid.prepareNextPositioning();
        });

        solids.forEach((solid) => {
            solid.applyNextPositioning();
        });

        const solidCount = solids.length;
        for (let solidIndex = 0; solidIndex < solidCount; solidIndex += 1) {
            const solid = solids[solidIndex];
            solid.setColorRGB(0, 255, 0);
        }
        for (let solidIndex = 0; solidIndex < solidCount; solidIndex += 1) {
            const solid = solids[solidIndex];
            if (solid.isPhysical) {
                for (let targetIndex = solidIndex + 1; targetIndex < solidCount; targetIndex += 1) {
                    const target = solids[targetIndex];
                    if (target.isPhysical && solid.collidesWith(target)) {
                        solid.setColorRGB(0, 0, 255);
                        target.setColorRGB(0, 0, 255);
                    }
                }
            }
        }
    }
}
