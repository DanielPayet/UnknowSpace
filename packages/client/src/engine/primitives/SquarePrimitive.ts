import {Renderable} from '../Renderable';

export class SquarePrimitive extends Renderable {
    public width:number = 100;
    public height:number = 100;
    public color:string = "powderblue";
    
    public renderElementCanva(context:CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.fillRect(-(this.width/2), -(this.height/2), this.width, this.height);
    }
    
    public updateElement() {
        //this.rotationZ += 0.5;
    }
}      
