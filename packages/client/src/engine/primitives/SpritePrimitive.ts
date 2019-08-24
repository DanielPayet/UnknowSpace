import {Solid} from '../base/Solid';
import {Camera} from '../base/Camera';
import {WebGL} from '../services/WebGL';

export class SpritePrimitive extends Solid {
    public imageScale:number = 1;
    public blendMode:string = 'source-over';
    private image:any;
    private webglTextureCoordinatesBuffer:any = null;
    private webglTextureCoordinates:any = null;
    private webglTextureLocation:any = null;
    private webglTexture:any = null;
    private updateTexture = false;

    constructor(imagePath:string) {
        super();
        this.image = new Image();
        this.image.src = imagePath;
        this.image.addEventListener('load', () => {
            this.updateTexture = true;
        });
        this.webglVertices = new Float32Array([
            -100, -100,
            -100, 100,
            100, 100,
            100, -100,
        ]);
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
        if (this.updateTexture) {
            this.updateTexture = false;
            let midWidth = this.imageScale * this.image.width / 2;
            let midHeight = this.imageScale * this.image.height / 2;
            this.webglVertices = new Float32Array([
                -midWidth, -midHeight,
                -midWidth, midHeight,
                midWidth, midHeight,
                midWidth, -midHeight,
            ]);
            context.bindTexture(context.TEXTURE_2D, this.webglTexture);
            // Si dimensions puissance de 2
            if (false && ((this.image.height & (this.image.height - 1)) == 0) && ((this.image.width & (this.image.width - 1)) == 0)) {
                context.generateMipmap(context.TEXTURE_2D);
            } else {
                context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
                context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
                context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
                context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
            }
            context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, this.image);
        }
        if (this.image.complete) {
            context.activeTexture(context.TEXTURE0);
            context.bindTexture(context.TEXTURE_2D, this.webglTexture);
            context.uniform1i(this.webglTextureLocation, 0);
        }
        context.enableVertexAttribArray(this.webglTextureCoordinates);
        context.bindBuffer(context.ARRAY_BUFFER, this.webglTextureCoordinatesBuffer);
        context.vertexAttribPointer(this.webglTextureCoordinates, 2, context.FLOAT, false, 0, 0);
    }

    protected webglInit(context) {        
        // This override add the image coordinate system and load a default color before loading the image.
        this.webglProgram = WebGL.imageProgram(context);
        context.useProgram(this.webglProgram);
        this.webglVerticesAttribute = context.getAttribLocation(this.webglProgram, 'vertices');
        this.webglResolution = context.getUniformLocation(this.webglProgram, 'resolution');
        this.webglPosition = context.getUniformLocation(this.webglProgram, 'position');
        this.webglRotation = context.getUniformLocation(this.webglProgram, 'rotation');
        this.webglScale = context.getUniformLocation(this.webglProgram, 'scale');

        this.webglTextureCoordinates = context.getAttribLocation(this.webglProgram, 'textureCoordinatesAttribute');
        this.webglTextureLocation = context.getUniformLocation(this.webglProgram, 'texture');

        this.webglTextureCoordinatesBuffer = context.createBuffer();
        context.bindBuffer(context.ARRAY_BUFFER, this.webglTextureCoordinatesBuffer);
        this.updateTexturePosition(context);
        //context.enableVertexAttribArray(this.webglTextureCoordinates);
        //context.vertexAttribPointer(this.webglTextureCoordinates, 2, context.FLOAT, false, 0, 0);

        this.webglTexture = context.createTexture();
        //context.bindTexture(context.TEXTURE_2D, this.webglTexture);
        //context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
        //context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, 1, 1, 0, context.RGBA, context.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

        this.updateWebglVertices(context);
    }

    private updateTexturePosition(context) {
        context.bindBuffer(context.ARRAY_BUFFER, this.webglTextureCoordinatesBuffer);
        context.bufferData(context.ARRAY_BUFFER, new Float32Array([0,1,0,0,1,0,1,1]), context.STATIC_DRAW);
    }

    public updateElement() {
        this.rotationZ += 0.2;
    }
}