import {Solid} from '../base/Solid';
import {Force} from '../physic/Force';

export class Physic {
    public static compute(solids:Array<Solid>, forces:Set<Force>) {
        solids.forEach((solid) => {
            forces.forEach((force) => {
                solid.applyForce(force); 
            });
            solid.prepareNextPositioning();
        });

        solids.forEach((solid) => {
            solid.applyNextPositioning();
        });
    }
}