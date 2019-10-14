import {Entity} from '../base/Entity';
import {Solid} from '../base/Solid';

export class Force extends Entity {
    public getComponentRelativeTo(solid: Solid):any {}
    public force:number = 0;
}