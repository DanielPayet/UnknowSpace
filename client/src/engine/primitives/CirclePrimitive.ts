import {Solid, SolidBodyType} from '../base/Solid';

export class CirclePrimitive extends Solid {
    public _radius: number = 50;
    get radius(): number { return this._radius; }
    set radius(value: number) { this._radius = value; this.updateVertices(); }

    constructor() {
        super();
        this.updateVertices();
        this.solidBodyType = SolidBodyType.circle;
    }

    protected updateVertices() {
        const coordinates = [];
        for (let angle = 0; angle < 360; angle += 5) {
            const rad = (angle * Math.PI) / 180;
            coordinates.push(Math.cos(rad) * this.radius);
            coordinates.push(Math.sin(rad) * this.radius);
        }
        this.webglVertices = new Float32Array(coordinates);
        this.boundingBox.width = (this._radius * 2);
        this.boundingBox.height = (this._radius * 2);
        this.maxRadius = this._radius;
        this.minRadius = this._radius;
    }

    public renderElementCanvas(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        context.fill();
        context.closePath();
    }

    public updateElement() {}
}
