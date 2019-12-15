import {Solid, SolidBodyType} from '../base/Solid';

export class SquarePrimitive extends Solid {
    private _width: number = 100;
    get width(): number { return this._width; }
    set width(value: number) { this._width = value; this.updateVertices(); }

    private _height: number = 100;
    get height(): number { return this._height; }
    set height(value: number) { this._height = value; this.updateVertices(); }

    constructor() {
        super();
        this.updateVertices();
        this.solidBodyType = SolidBodyType.box;
    }

    private updateVertices() {
        const midWidth = (this.width / 2);
        const midHeight = (this.height / 2);
        this.vertices = [
            {x: -midWidth, y: midHeight},
            {x: midWidth, y: midHeight},
            {x: midWidth, y: -midHeight},
            {x: -midWidth, y: -midHeight},
        ];
        this.pushVerticesUpdate();
        this.boundingBox.width = this.width;
        this.boundingBox.height = this.height;
        this.maxRadius = Math.sqrt((midWidth ** 2) + (midHeight ** 2));
        this.minRadius = Math.min(midWidth, midHeight);
    }

    public renderElementCanvas(context: CanvasRenderingContext2D) {
        context.fillRect(-(this.width / 2), -(this.height / 2), this.width, this.height);
    }

    public updateElement() {
        //this.rotationZ += 0.5;
    }
}
