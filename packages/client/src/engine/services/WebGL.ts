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

    public static createFragmentShader(context, source) {
        return this.createShader(context, context.FRAGMENT_SHADER, source);
    }
    
}