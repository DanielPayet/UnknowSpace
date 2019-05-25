import {Entity} from './Entity';
import {Camera} from './Camera';

export class Renderable extends Entity {
    
    // Base render function (do NOT override): chose which order render children
    public render(camera:Camera) {
        const context = camera.scene.context;
        this.children.forEach((child:Entity) => {
            if (child.position.z < 0) {
                child.render(camera);
            }
        });
        context.save();
        this.preRenderTransformation(context);
        this.renderElement(context);
        context.restore();
        this.children.forEach((child:Entity) => {
            if (child.position.z >= 0) {
                child.render(camera);
            }
        });
    }
    
    // Base transformations
    public preRenderTransformation(context:CanvasRenderingContext2D) {
        context.transform(1, 0, 0, 1, context.canvas.width / 2, context.canvas.height / 2);
        context.translate(this.absolutePosition.x, -this.absolutePosition.y);
        context.rotate(this.absoluteRotationZ * Math.PI / 180);
    }
        
    /* 
        Basic (overridable) function to render current element
        When overriding this function, you should consider that (0, 0) is the current position as well as 0 is the current rotationZ
        Rotations and Translation both are done automatically.
    */
    public renderElement(context:CanvasRenderingContext2D) {
        
    }
}