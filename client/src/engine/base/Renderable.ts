import {Camera} from './Camera';
import {Entity} from './Entity';
import {WebGL} from '../services/WebGL';

export class Renderable extends Entity {

    protected color: any = {r: 255, g: 255, b: 255};
    public vertices: any[] = [];
    public opacity: number = 1;
    public boundingBox: any = {x : 0, y: 0, width: 0, height: 0};
    public maxRadius = 0;
    public minRadius = 0;

    protected renderPosition: any = {x: 0, y: 0};
    protected renderScale: number = 1;
    protected webglProgram: any = null;
    protected webglVertices: Float32Array = null;
    protected webglVerticesAttribute = null;
    protected webglVerticesBuffer = null;
    protected webglResolution: any = null;
    protected webglPosition: any = null;
    protected webglRotation: any = null;
    protected webglScale: any = null;
    protected webglColor: any = null;

    public setColorRGB(R, G, B) {
        this.color.r = Math.min(Math.max(0, R), 255);
        this.color.g = Math.min(Math.max(0, G), 255);
        this.color.b = Math.min(Math.max(0, B), 255);
    }

    public setColorHSL(H, S, L) {
        S /= 100;
        L /= 100;
        const a = S * Math.min(L, (1 - L));
        let k = ((H / 30) % 12);
        this.color.r = 255 * (L - a * Math.max(Math.min(k - 3, 9 - k, 1), -1));
        k = ((8 + (H / 30)) % 12);
        this.color.g = 255 * (L - a * Math.max(Math.min(k - 3, 9 - k, 1), -1));
        k = ((4 + (H / 30)) % 12);
        this.color.b = 255 * (L - a * Math.max(Math.min(k - 3, 9 - k, 1), -1));
    }

    public prepareRenderStack(camera: Camera) {
        camera.pushInRenderStack(this);
        super.prepareRenderStack(camera);
    }

    public isInRenderingArea(camera: Camera) {
        return true;
        // TODO : verify the function (prepare bounding box)
        let inField = true;
        if (this.position.x < camera.renderingLimits.minX || this.position.x > camera.renderingLimits.maxX) {
            inField = false;
        }
        else if (this.position.y < camera.renderingLimits.minY || this.position.y > camera.renderingLimits.maxY) {
            inField = false;
        }
        else {
            const scaleFactor = Math.max(0, 1 + this.absolutePosition.z * camera.perspectiveFactor) * camera.zoom;
            if (scaleFactor === 0) {
                inField = false;
            }
        }
        return inField;
    }

    // Base transformations
    public preRenderCalculation(camera: Camera) {
        const perspectiveFactor = (camera.perspectiveFactor / 1000);
        this.renderScale = Math.max(0, 1 + (this.absolutePosition.z * perspectiveFactor)) * camera.zoom;
        const cameraDX = this.absolutePosition.x - camera.absolutePosition.x;
        const cameraDY = this.absolutePosition.y - camera.absolutePosition.y;

        // Apply perspective
        this.renderPosition.x = this.absolutePosition.x + cameraDX * (this.absolutePosition.z * perspectiveFactor);
        this.renderPosition.y = this.absolutePosition.y + cameraDY * (this.absolutePosition.z * perspectiveFactor);

        // Apply relativity position from camera position and zoom
        this.renderPosition.x = ((this.renderPosition.x - camera.absolutePosition.x) * camera.zoom);
        this.renderPosition.y = ((this.renderPosition.y - camera.absolutePosition.y) * camera.zoom);
    }

    // NO-OVERRIDE Base render function
    public render(camera: Camera) {
        if (this.isInRenderingArea(camera)) {
            const context = camera.scene.canvasContext;
            context.save();
            this.preRenderCalculation(camera);
            this.renderPosition.x += (camera.scene.canvasContext.canvas.width / 2);
            this.renderPosition.y -= (camera.scene.canvasContext.canvas.height / 2);

            context.transform(this.renderScale, 0, 0, this.renderScale, this.renderPosition.x, -this.renderPosition.y);
            context.rotate(this.absoluteRotationZ * Math.PI / 180);
            context.imageSmoothingEnabled = true;
            context.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.opacity + ')';
            this.renderElementCanvas(context);
            context.restore();
        }
    }

    // NO-OVERRIDE Base render function
    public webglRender(camera: Camera) {
        if (this.isInRenderingArea(camera)) {
            const context = camera.scene.webglContext;
            if (this.webglProgram === null) {
                this.webglInit(context);
            }
            if (this.webglProgram !== null && this.webglVertices !== null) {
                // PRECALCULATION
                this.preRenderCalculation(camera);
                const rotationRad = (this.absoluteRotationZ * Math.PI) / 180;
                this.renderPosition.x += (camera.scene.webglContext.canvas.width / 2);
                this.renderPosition.y += (camera.scene.webglContext.canvas.height / 2);

                // WEBGL
                context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
                context.useProgram(this.webglProgram);
                context.uniform2f(this.webglResolution, context.canvas.width, context.canvas.height);
                context.uniform2f(this.webglPosition, this.renderPosition.x, this.renderPosition.y);
                context.uniform2fv(this.webglScale, [this.renderScale, this.renderScale]);
                context.uniform4fv(this.webglColor, [(this.color.r / 255.0), (this.color.g / 255.0), (this.color.b / 255.0), this.opacity]);
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
        this.webglColor = context.getUniformLocation(this.webglProgram, "color");
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

    protected pushVerticesUpdate() {
        const coordinates = [];
        this.vertices.forEach((vertex) => {
            coordinates.push(vertex.x);
            coordinates.push(vertex.y);
        });
        this.webglVertices = new Float32Array(coordinates);
    }

    // General function to use for non specific shapes in derived class
    protected computeBoundingBox() {
        let maxCoordinateX = 0;
        let minCoordinateX = 0;
        let maxCoordinateY = 0;
        let minCoordinateY = 0;
        this.vertices.forEach((vertex) => {
            maxCoordinateX = Math.max(vertex.x, maxCoordinateX);
            minCoordinateX = Math.min(vertex.x, minCoordinateX);
            maxCoordinateY = Math.max(vertex.y, maxCoordinateY);
            minCoordinateY = Math.min(vertex.y, minCoordinateY);
        });
        this.boundingBox.width = maxCoordinateX - minCoordinateX;
        this.boundingBox.height = maxCoordinateY - minCoordinateY;
        this.boundingBox.x = (this.boundingBox.width / 2) - maxCoordinateX;
        this.boundingBox.y = (this.boundingBox.height / 2) - maxCoordinateY;
        this.maxRadius = (Math.sqrt((this.boundingBox.width ** 2) + (this.boundingBox.height ** 2)) / 2);
        this.minRadius = (Math.min(this.boundingBox.width, this.boundingBox.height) / 2);
    }

    /*
        Basic (overridable) function to render current element
        When overriding this function, you should consider that (0, 0) is the final position as well as 0 is the final rotationZ
        Rotations and Translation both are done automatically.
    */
    public renderElementCanvas(context: CanvasRenderingContext2D) {}

    /*
        Basic (overridable) function to change the render process of the element
        The override of this function is optional as long as vertices of the element are defined
    */
    public renderElementWebGL(context: WebGLRenderingContext) {}
}
