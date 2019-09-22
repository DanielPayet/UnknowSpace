import {Solid} from '../base/Solid';

export class SquarePrimitive extends Solid {
    public color:string = "powderblue";
    
    private _width:number = 100;
    get width(): number { return this._width; }
    set width(value: number) { this._width = value; this.updateVertices(); }
    
    private _height:number = 100;
    get height(): number { return this._height; }
    set height(value: number) { this._height = value; this.updateVertices(); }    

    constructor() {
        super();
        this.updateVertices();
    }
    
    private updateVertices() {
        this.webglVertices = new Float32Array([
            -this.width/2, this.height/2,
            this.width/2, this.height/2,
            this.width/2, -this.height/2,
            -this.width/2, -this.height/2,
        ]);
    }
    
    public renderElementCanvas(context:CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.fillRect(-(this.width/2), -(this.height/2), this.width, this.height);
    }
    
    public updateElement() {
        //this.rotationZ += 0.5;
    }
}      
