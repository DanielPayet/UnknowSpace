import {Renderable} from '../Renderable';
import {Camera} from '../Camera';
import {WebGL} from '../services/WebGL';

export class SpritePrimitive extends Renderable {
    public imageScale:number = 1;
    public radius:number = 50;
    public blendMode:string = 'source-over';
    private image:any;
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
            -10/2, 10/2,
            10/2, 10/2,
            10/2, -10/2,
            -10/2, -10/2,
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
            context.bindTexture(context.TEXTURE_2D, this.webglTexture);
            context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, this.image);
            context.generateMipmap(context.TEXTURE_2D);
        }
    }

    protected webglInit(context) {
        // This override add the image coordinate system and load a default color before loading of the image.
        this.webglProgram = WebGL.imageProgram(context);
        this.webglResolution = context.getUniformLocation(this.webglProgram, "resolution");
        this.webglPosition = context.getUniformLocation(this.webglProgram, "position");
        this.webglRotation = context.getUniformLocation(this.webglProgram, "rotation");
        this.webglScale = context.getUniformLocation(this.webglProgram, "scale");
        let webglTextureCoordinates = context.getUniformLocation(this.webglProgram, "textureCoordinates");
        context.enableVertexAttribArray(webglTextureCoordinates);
        context.vertexAttribPointer(webglTextureCoordinates, 2, context.FLOAT, false, 0, 0);
        context.bufferData(context.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 1, 1, 0]), context.STATIC_DRAW);
        this.webglTexture = context.createTexture();
        context.bindTexture(context.TEXTURE_2D, this.webglTexture);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
        context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, 1, 1, 0, context.RGBA, context.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
        this.updateWebglVertices(context);
    }

    public updateElement() {
        this.rotationZ += 1;
    }
}