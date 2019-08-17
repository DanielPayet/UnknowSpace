export class WebGL {
    
    public static createProgram(context:WebGLRenderingContext, vertexShader, fragmentShader) {
        let program = context.createProgram();
        context.attachShader(program, vertexShader);
        context.attachShader(program, fragmentShader);
        context.linkProgram(program);
        if (context.getProgramParameter(program, context.LINK_STATUS)) {
            return program;
        }
        console.log(context.getProgramInfoLog(program));
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
        console.log(context.getShaderInfoLog(shader));
        context.deleteShader(shader);
    }
    
    public static createVertexShader(context, source) {
        return this.createShader(context, context.VERTEX_SHADER, source);
    }
    
    public static baseVertexShader(context) {
        return this.createShader(context, context.VERTEX_SHADER, "attribute vec2 vertices; uniform vec2 resolution; uniform vec2 position; uniform vec2 rotation; uniform vec2 scale; void main() { vec2 rotatedVertices = vec2(vertices.x * rotation.y + vertices.y * rotation.x, vertices.y * rotation.y - vertices.x * rotation.x); gl_Position = vec4(((2.0 * ((scale * rotatedVertices) + position) / resolution) - 1.0), 0, 1);}");
    }

    public static createFragmentShader(context, source) {
        return this.createShader(context, context.FRAGMENT_SHADER, source);
    }
    
}