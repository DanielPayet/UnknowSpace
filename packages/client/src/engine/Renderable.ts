import {Entity} from './Entity';
import {Camera} from './Camera';
import {WebGL} from './services/WebGL';

export class Renderable extends Entity {

    protected renderPosition:any = {x: 0, y: 0};
    protected renderScale:number = 1;
    protected webglProgram:any = null;
    protected webglVertices:Float32Array = null;
    protected webglResolution:any = null;
    protected webglPosition:any = null;
    protected webglRotation:any = null;
    protected webglScale:any = null;

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

    // Base transformations
    public preRenderCalculation(camera:Camera) {
        this.renderScale = Math.max(0, 1 + this.absolutePosition.z * camera.perspectiveFactor * 0.5) * camera.zoom;
        const cameraDX = this.absolutePosition.x - camera.absolutePosition.x;
        const cameraDY = this.absolutePosition.y - camera.absolutePosition.y;
        this.renderPosition.x = this.absolutePosition.x + cameraDX * (this.absolutePosition.z * camera.perspectiveFactor);
        this.renderPosition.y = this.absolutePosition.y + cameraDY * (this.absolutePosition.z * camera.perspectiveFactor);
    }

    // NO-OVERRIDE Base render function
    public render(camera:Camera) {
        //if (this.isInRenderingArea(camera)) {
        const context = camera.scene.canvaContext;
        context.save();
        this.preRenderCalculation(camera);
        const centerX = (context.canvas.width / 2) - camera.absolutePosition.x;
        const centerY = (context.canvas.height / 2) + camera.absolutePosition.y;
        context.transform(this.renderScale, 0, 0, this.renderScale, centerX, centerY);
        context.translate(this.renderPosition.x, -this.renderPosition.y);
        context.rotate(this.absoluteRotationZ * Math.PI / 180);
        context.imageSmoothingEnabled = true;
        this.renderElementCanva(context);
        context.restore();
        //}
    }

    // NO-OVERRIDE Base render function
    public webglRender(camera:Camera) {
        //if (this.isInRenderingArea(camera)) {
        let context = camera.scene.webglContext;
        this.preRenderCalculation(camera);
        const centerX = (camera.scene.webglContext.canvas.width / 2) - camera.absolutePosition.x;
        const centerY = (camera.scene.webglContext.canvas.height / 2) - camera.absolutePosition.y;
        this.renderPosition.x *= this.renderScale;
        this.renderPosition.y *= this.renderScale;
        this.renderPosition.x += centerX;
        this.renderPosition.y += centerY;
        if (this.webglProgram === null) {
            this.webglInit(context);
        }
        context.useProgram(this.webglProgram);
        if (this.webglVertices !== null) {
            this.renderElementWebGL(context);
            context.uniform2f(this.webglResolution, context.canvas.clientWidth, context.canvas.clientHeight);
            context.uniform2f(this.webglPosition, this.renderPosition.x, this.renderPosition.y);
            context.uniform2fv(this.webglScale, [this.renderScale, this.renderScale]);
            const rotationRad = this.absoluteRotationZ * Math.PI / 180
            context.uniform2f(this.webglRotation, Math.sin(rotationRad), Math.cos(rotationRad));
            context.drawArrays(context.TRIANGLE_FAN, 0, (this.webglVertices.length / 2));
        }
        //}
    }

    protected webglInit(context) {
        this.webglProgram = WebGL.baseProgram(context);
        this.webglResolution = context.getUniformLocation(this.webglProgram, "resolution");
        this.webglPosition = context.getUniformLocation(this.webglProgram, "position");
        this.webglRotation = context.getUniformLocation(this.webglProgram, "rotation");
        this.webglScale = context.getUniformLocation(this.webglProgram, "scale");
        this.updateWebglVertices(context);
    }

    protected updateWebglVertices(context) {
        if (this.webglVertices != null) {
            context.bufferData(context.ARRAY_BUFFER, this.webglVertices, context.STATIC_DRAW);
        }
    }


    /* 
        Basic (overridable) function to render current element
        When overriding this function, you should consider that (0, 0) is the final position as well as 0 is the final rotationZ
        Rotations and Translation both are done automatically.
    */
    public renderElementCanva(context:CanvasRenderingContext2D) {}
    
    /*
        Basic (overridable) function to change the render process of the element
        The override of this function is optional as long as vertices of the element are defined
        In that case color will be chosen randomly
    */
    public renderElementWebGL(context:WebGLRenderingContext) {}
}