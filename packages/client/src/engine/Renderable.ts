import {Entity} from './Entity';
import {Camera} from './Camera';

export class Renderable extends Entity {
    
    private inField:boolean = true;
    
    public prepareRenderStack(camera:Camera) {
        camera.pushInRenderStack(this);
        super.prepareRenderStack(camera);
    }
    
    // Base render function (do NOT override): chose which order render children
    public render(camera:Camera) {
        const context = camera.scene.context;
        context.save();
        this.inField = true;
        if (this.position.x < camera.renderingLimits.minX || this.position.x > camera.renderingLimits.maxX) {
            this.inField = false;
        }
        else if (this.position.y < camera.renderingLimits.minY || this.position.y > camera.renderingLimits.maxY) {
            this.inField = false;
        }
        else {
            this.preRenderTransformation(camera);
        }
        if (this.inField) {
            this.renderElement(context);
        }
        context.restore();
    }
    
    // Base transformations
    public preRenderTransformation(camera:Camera) {
        const perspectiveFactor = camera.perspectiveFactor;
        const context = camera.scene.context;
        const scaleFactor = Math.max(0, 1 + this.absolutePosition.z * perspectiveFactor) * camera.zoom;
        if (scaleFactor == 0) {
            this.inField = false;
        }
        else {
            const centerX = (context.canvas.width / 2) - camera.absolutePosition.x;
            const centerY = (context.canvas.height / 2) + camera.absolutePosition.y;
            const cameraDX = this.absolutePosition.x - camera.absolutePosition.x;
            const cameraDY = this.absolutePosition.y - camera.absolutePosition.y;
            const objectCenterX = this.absolutePosition.x + (this.absolutePosition.z * perspectiveFactor * cameraDX);
            const objectCenterY = this.absolutePosition.y + (this.absolutePosition.z * perspectiveFactor * cameraDY);
            context.transform(scaleFactor, 0, 0, scaleFactor, centerX, centerY);
            context.translate(objectCenterX, -objectCenterY);
            context.rotate(this.absoluteRotationZ * Math.PI / 180);
            context.imageSmoothingEnabled = true;
        }
    }
        
    /* 
        Basic (overridable) function to render current element
        When overriding this function, you should consider that (0, 0) is the current position as well as 0 is the current rotationZ
        Rotations and Translation both are done automatically.
    */
    public renderElement(context:CanvasRenderingContext2D) {
        
    }
}