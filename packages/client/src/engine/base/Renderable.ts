import {Entity} from './Entity';
import {Camera} from './Camera';
import {WebGL} from '../services/WebGL';

export class Renderable extends Entity {

    protected renderPosition:any = {x: 0, y: 0};
    protected renderScale:number = 1;
    protected webglProgram:any = null;
    protected webglVertices:Float32Array = null;
    protected webglVerticesAttribute = null;
    protected webglVerticesBuffer = null;
    protected webglResolution:any = null;
    protected webglPosition:any = null;
    protected webglRotation:any = null;
    protected webglScale:any = null;

    // BLEND MODE

    public prepareRenderStack(camera:Camera) {
        camera.pushInRenderStack(this);
        super.prepareRenderStack(camera);
    }

    public isInRenderingArea(camera:Camera) {
        return true;
        // TODO : verify the function (prepare bouding box)
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
        const perspectiveFactor = (camera.perspectiveFactor / 1000);
        this.renderScale = Math.max(0, 1 + (this.absolutePosition.z * perspectiveFactor)) * camera.zoom;
        const cameraDX = this.absolutePosition.x - camera.absolutePosition.x;
        const cameraDY = this.absolutePosition.y - camera.absolutePosition.y;
        this.renderPosition.x = this.absolutePosition.x + cameraDX * (this.absolutePosition.z * perspectiveFactor);
        this.renderPosition.y = this.absolutePosition.y + cameraDY * (this.absolutePosition.z * perspectiveFactor);
    }

    // NO-OVERRIDE Base render function
    public render(camera:Camera) {
        if (this.isInRenderingArea(camera)) {
            const context = camera.scene.canvaContext;
            context.save();
            this.preRenderCalculation(camera);
            const centerX = (context.canvas.width / 2) - (camera.absolutePosition.x * this.renderScale);
            const centerY = (context.canvas.height / 2) + (camera.absolutePosition.y * this.renderScale);
            context.transform(this.renderScale, 0, 0, this.renderScale, centerX, centerY);
            context.translate(this.renderPosition.x, -this.renderPosition.y);
            context.rotate(this.absoluteRotationZ * Math.PI / 180);
            context.imageSmoothingEnabled = true;
            this.renderElementCanva(context);
            context.restore();
        }
    }

    // NO-OVERRIDE Base render function
    public webglRender(camera:Camera) {
        if (this.isInRenderingArea(camera)) {
            let context = camera.scene.webglContext;
            if (this.webglProgram === null) {
                this.webglInit(context);
            }
            if (this.webglProgram !== null && this.webglVertices !== null) {
                // PRECALCULATION
                this.preRenderCalculation(camera);
                const centerX = (camera.scene.webglContext.canvas.width / 2) - (camera.absolutePosition.x);
                const centerY = (camera.scene.webglContext.canvas.height / 2) - (camera.absolutePosition.y);
                const rotationRad = this.absoluteRotationZ * Math.PI / 180
                this.renderPosition.x += centerX;
                this.renderPosition.y += centerY;
                this.renderPosition.x *= camera.zoom;
                this.renderPosition.y *= camera.zoom;
                // WEBGL
                context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
                context.useProgram(this.webglProgram);
                context.uniform2f(this.webglResolution, context.canvas.clientWidth, context.canvas.clientHeight);
                context.uniform2f(this.webglPosition, this.renderPosition.x, this.renderPosition.y);
                context.uniform2fv(this.webglScale, [this.renderScale, this.renderScale]);
                context.uniform2f(this.webglRotation, Math.sin(rotationRad), Math.cos(rotationRad));
                this.updateWebglVertices(context);
                this.renderElementWebGL(context);
                context.drawArrays(context.TRIANGLE_FAN, 0, (this.webglVertices.length / 2));
            }
        }
    }

    protected webglInit(context) {
        this.webglProgram = WebGL.baseProgram(context);
        context.useProgram(this.webglProgram);
        this.webglVerticesAttribute = context.getAttribLocation(this.webglProgram, 'vertices');
        this.webglResolution = context.getUniformLocation(this.webglProgram, "resolution");
        this.webglPosition = context.getUniformLocation(this.webglProgram, "position");
        this.webglRotation = context.getUniformLocation(this.webglProgram, "rotation");
        this.webglScale = context.getUniformLocation(this.webglProgram, "scale");
        this.updateWebglVertices(context);
    }

    protected updateWebglVertices(context) {
        if (this.webglVertices != null) {
            if (this.webglVerticesBuffer == null) {
                this.webglVerticesBuffer = context.createBuffer();
            }
            context.bindBuffer(context.ARRAY_BUFFER, this.webglVerticesBuffer);
            context.bufferData(context.ARRAY_BUFFER, this.webglVertices, context.STATIC_DRAW);
            context.enableVertexAttribArray(this.webglVerticesAttribute);
            context.vertexAttribPointer(this.webglVerticesAttribute, 2, context.FLOAT, false, 0, 0);
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