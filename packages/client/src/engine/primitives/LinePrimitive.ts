import {Renderable} from '../Renderable';

export class LinePrimitive extends Renderable {
    public width:number = 1;
    public color:string = "white";
    
    public startPosition:any = { x: 0, y: 0 };
    public endPosition:any = { x: 0, y: 0 };
    
    public renderElementCanva(context:CanvasRenderingContext2D) {
        context.beginPath();
        context.moveTo(this.startPosition.x, this.startPosition.y);
        context.lineTo(this.endPosition.x, this.endPosition.y);
        context.strokeStyle = this.color;
        context.stroke();
        context.closePath();
    }
    
    public updateElement() {
        //this.rotationZ += 2;
    }
}