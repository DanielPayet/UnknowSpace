import { Renderable } from '../Renderable';

export class CirclePrimitive extends Renderable {
    public radius: number = 50;
    public color: string = "powderblue";

    public renderElement(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        context.fill();
        context.closePath();
    }

    public updateElement() {
        this.rotationZ += 2;
    }
}
