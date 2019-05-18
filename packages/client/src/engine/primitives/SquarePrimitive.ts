import {Renderable} from '../Renderable';

export class SquarePrimitive extends Renderable {
    private width:number = 100;
    private height:number = 100;
    
    public renderElement(context:CanvasRenderingContext2D) {
        this.rotationZ += 0.5;
        context.fillStyle = "powderblue";
        context.fillRect(-(this.width/2), -(this.height/2), this.width, this.height);
    }
}      
