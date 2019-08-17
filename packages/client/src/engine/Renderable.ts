import {Entity} from './Entity';
import {Camera} from './Camera';
import {WebGL} from './services/WebGL';

export class Renderable extends Entity {

    public prepareRenderStack(camera:Camera) {
        camera.pushInRenderStack(this);
        super.prepareRenderStack(camera);
    }

    public isInRenderingArea(camera:Camera) {
        let inField = true;
        if (this.position.x < camera.renderingLimits.minX || this.position.x > camera.renderingLimits.maxX) {
            inField = false;
        }
        else if (this.position.y < camera.renderingLimits.minY || this.position.y > camera.renderingLimits.maxY) {
            inField = false;
        }
        else {
            const scaleFactor = Math.max(0, 1 + this.absolutePosition.z * camera.perspectiveFactor) * camera.zoom;
            if (scaleFactor == 0) {
                inField = false;
            }
        }
        return inField;
    }

    // NO-OVERRIDE Base render function
    public render(camera:Camera) {
        if (this.isInRenderingArea(camera)) {
            const context = camera.scene.canvaContext;
            context.save();
            this.preRenderTransformation(camera);
            this.renderElementCanva(context);
            context.restore();
        }
    }
    
    // NO-OVERRIDE Base render function
    public webglRender(camera:Camera) {
        //if (this.isInRenderingArea(camera)) {
            this.renderElementWebGL(camera.scene.webglContext);
        //}
    }

    // Base transformations
    public preRenderTransformation(camera:Camera) {
        const perspectiveFactor = camera.perspectiveFactor;
        const context = camera.scene.canvaContext;
        const scaleFactor = Math.max(0, 1 + this.absolutePosition.z * perspectiveFactor) * camera.zoom;
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

    /* 
        Basic (overridable) function to render current element
        When overriding this function, you should consider that (0, 0) is the current position as well as 0 is the current rotationZ
        Rotations and Translation both are done automatically.
    */
    public renderElementCanva(context:CanvasRenderingContext2D) {}
    public renderElementWebGL(context:WebGLRenderingContext) {}
}