import {Renderable} from '../Renderable';
import {Camera} from '../Camera';
import {WebGL} from '../services/WebGL';

export class SpritePrimitive extends Renderable {
    public imageScale:number = 1;
    public radius:number = 50;
    public blendMode:string = 'source-over';
    private image:any;
    private webglProgram:any = null;
    private webglVertices:Float32Array = null;
    private webglResolution:any = null;
    private webglPosition:any = null;
    private webglRotation:any = null;
    private webglScale:any = null;

    constructor(imagePath:string) {
        super();
        this.image = new Image();
        this.image.src = imagePath;
    }

    public renderElementCanva(context:CanvasRenderingContext2D) {
        context.globalCompositeOperation = this.blendMode;
        const width = this.image.width;
        const height = this.image.height;
        const destinationWidth = width * this.imageScale;
        const destinationHeight = height * this.imageScale;
        context.drawImage(this.image, 0, 0, width, height, -destinationWidth/2, -destinationHeight/2, destinationWidth, destinationHeight);
    }

    public renderElementWebGL(context:WebGLRenderingContext) {

        if (this.webglProgram === null) {
            let fragmentShaderSource = "precision mediump float; void main() {gl_FragColor = vec4("+Math.random()+", " + Math.random() + ", 0, 1);}";
            let vertexShader = WebGL.baseVertexShader(context);
            let fragmentShader = WebGL.createFragmentShader(context, fragmentShaderSource);
            this.webglProgram = WebGL.createProgram(context, vertexShader, fragmentShader);
            context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());

            let positionAttribute = context.getAttribLocation(this.webglProgram, "vertices");
            context.enableVertexAttribArray(positionAttribute);
            context.vertexAttribPointer(positionAttribute, 2, context.FLOAT, false, 0, 0);

            this.webglResolution = context.getUniformLocation(this.webglProgram, "resolution");
            this.webglPosition = context.getUniformLocation(this.webglProgram, "position");
            this.webglRotation = context.getUniformLocation(this.webglProgram, "rotation");
            this.webglScale = context.getUniformLocation(this.webglProgram, "scale");
            let demiWidth = (800 * this.imageScale) / 2;
            this.webglVertices = new Float32Array([
                -demiWidth, demiWidth,
                demiWidth, demiWidth,
                demiWidth, -demiWidth,
                -demiWidth, -demiWidth,
            ]);
            context.bufferData(context.ARRAY_BUFFER, this.webglVertices, context.STATIC_DRAW);
        }
        
        context.useProgram(this.webglProgram);
        context.uniform2f(this.webglResolution, context.canvas.clientWidth, context.canvas.clientHeight);
        context.uniform2f(this.webglPosition, this.renderPosition.x, this.renderPosition.y);
        context.uniform2fv(this.webglScale, [this.renderScale, this.renderScale]);
        
        const rotationRad = this.absoluteRotationZ * Math.PI / 180
        context.uniform2f(this.webglRotation, Math.sin(rotationRad), Math.cos(rotationRad));
        context.drawArrays(context.TRIANGLE_FAN, 0, (this.webglVertices.length / 2));
    }

    public updateElement() {
        this.rotationZ += 1;
    }
}