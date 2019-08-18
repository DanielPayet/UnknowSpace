export class WebGL {
    
    private static baseProgramInstance = null;
    private static imageProgramInstance = null;

    public static createProgram(context:WebGLRenderingContext, vertexShader, fragmentShader) {
        let program = context.createProgram();
        context.attachShader(program, vertexShader);
        context.attachShader(program, fragmentShader);
        context.linkProgram(program);
        if (context.getProgramParameter(program, context.LINK_STATUS)) {
            return program;
        }
        context.deleteProgram(program);
        return null;
    }

    private static createShader(context, type, source) {
        let shader = context.createShader(type);
        context.shaderSource(shader, source);
        context.compileShader(shader);
        if (context.getShaderParameter(shader, context.COMPILE_STATUS)) {
            return shader;
        }
        context.deleteShader(shader);
    }

    public static createVertexShader(context, source) {
        return this.createShader(context, context.VERTEX_SHADER, source);
    }

    public static createFragmentShader(context, source) {
        return this.createShader(context, context.FRAGMENT_SHADER, source);
    }

    public static baseVertexShader(context) {
        return this.createShader(context, context.VERTEX_SHADER, "attribute vec2 vertices; uniform vec2 resolution; uniform vec2 position; uniform vec2 rotation; uniform vec2 scale; void main() { vec2 rotatedVertices = vec2(vertices.x * rotation.y + vertices.y * rotation.x, vertices.y * rotation.y - vertices.x * rotation.x); gl_Position = vec4(((2.0 * ((scale * rotatedVertices) + position) / resolution) - 1.0), 0, 1);}");
    }

    public static baseFragmentShader(context) {
        return this.createShader(context, context.FRAGMENT_SHADER, "precision mediump float; uniform sampler2D texture; void main() {gl_FragColor = vec4("+Math.random()+", " + Math.random() + ", 0, 1);}");
    }
    
    public static imageVertexShader(context) {
        return this.createShader(context, context.VERTEX_SHADER, "attribute vec2 vertices; attribute vec2 textureCoordinatesAttribute; uniform vec2 resolution; uniform vec2 position; uniform vec2 rotation; uniform vec2 scale; varying vec2 textureCoordinates; void main() { textureCoordinates = textureCoordinatesAttribute; vec2 rotatedVertices = vec2(vertices.x * rotation.y + vertices.y * rotation.x, vertices.y * rotation.y - vertices.x * rotation.x); gl_Position = vec4(((2.0 * ((scale * rotatedVertices) + position) / resolution) - 1.0), 0, 1);}");
    }

    public static imageFragmentShader(context) {
        return this.createShader(context, context.FRAGMENT_SHADER, "precision mediump float; varying vec2 textureCoordinates; uniform sampler2D texture; void main() {gl_FragColor = texture2D(texture, textureCoordinates);}");
    }

    public static baseProgram(context) {
        if (this.baseProgramInstance === null) {
            this.baseProgramInstance = this.createProgram(context, this.baseVertexShader(context), this.baseFragmentShader(context));
        }
        return this.baseProgramInstance;
    }

    public static imageProgram(context) {
        if (this.imageProgramInstance === null) {
            this.imageProgramInstance = this.createProgram(context, this.imageVertexShader(context), this.imageFragmentShader(context));
        }
        return this.imageProgramInstance;
    }

}