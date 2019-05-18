import {Entity} from './Entity';

export class Renderable extends Entity {
    
    // Base render function (do NOT override): chose which order render children
    public render(context:CanvasRenderingContext2D) {
        this.children.forEach((child:Entity) => {
           (child as Renderable).render(context);
        });
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotationZ * Math.PI / 180);
        this.renderElement(context);
        context.restore();
    }
    
    /* 
        Basic (overridable) function to render current element
        When overriding this function, you should consider that (0, 0) is the current position as well as 0 is the current rotationZ
        Rotations and Translation both are done automatically.
    */
    public renderElement(context:CanvasRenderingContext2D) {
        
    }
}