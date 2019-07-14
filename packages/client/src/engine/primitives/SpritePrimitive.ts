import {Renderable} from '../Renderable';
import {Camera} from '../Camera';

export class SpritePrimitive extends Renderable {
    public imageScale:number = 1;
    public radius:number = 50;
    public blendMode:string = 'source-over';
    private image:any;
    private webglProgram:any = null;

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

    public createShader(gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    public createProgram(gl, vertexShader, fragmentShader) {
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    public renderElementWebGL(context:WebGLRenderingContext) {

        if (this.webglProgram === null) {
            // Get the strings for our GLSL shaders
            var vertexShaderSource = "attribute vec4 a_position; void main() {gl_Position = a_position;}";
            var fragmentShaderSource = "precision mediump float; void main() {gl_FragColor = vec4(1, 0, 0.5, 1);}";

            // create GLSL shaders, upload the GLSL source, compile the shaders
            var vertexShader = this.createShader(context, context.VERTEX_SHADER, vertexShaderSource);
            var fragmentShader = this.createShader(context, context.FRAGMENT_SHADER, fragmentShaderSource);

            // Link the two shaders into a program
            this.webglProgram = this.createProgram(context, vertexShader, fragmentShader);
        }
        
        // look up where the vertex data needs to go.
        var positionAttributeLocation = context.getAttribLocation(this.webglProgram, "a_position");

        // Create a buffer and put three 2d clip space points in it
        var positionBuffer = context.createBuffer();
        context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);

        var positions = [
            -0.5, 1,
            0.5, 1,
            1, 0.5,
            1, -0.5,
            0.5, -1,
            -0.5, -1,
            -1, -0.5,
            -1, 0.5,
        ];
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.STATIC_DRAW);

        // Tell WebGL how to convert from clip space to pixels
//        context.viewport(100, 10, 100, 100);

        context.useProgram(this.webglProgram);
        context.enableVertexAttribArray(positionAttributeLocation);
        context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
        context.vertexAttribPointer(positionAttributeLocation, 2, context.FLOAT, false, 0, 0);
        context.drawArrays(context.TRIANGLE_FAN, 0, (positions.length / 2));
    }

    public updateElement() {

    }
}