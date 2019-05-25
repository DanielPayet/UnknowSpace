import {Renderable} from '../Renderable';

export class CirclePrimitive extends Renderable {
    public radius:number = 50;
    public color:string = "powderblue";
    
    constructor() {
        super();
        this.registerForKeyPressEvent();
    }
    
    public renderElement(context:CanvasRenderingContext2D) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        context.fill();
        context.closePath();
    }
    
    public updateElement() {
        this.rotationZ += 2;
    }
    
    public keyPress(code:string) {
        const speed:number = 3;
        if (code == 'ArrowUp') {
            this.position.y += speed;
        }
        else if (code == 'ArrowDown') {
            this.position.y -= speed;
        }
        else if (code == 'ArrowLeft') {
            this.position.x -= speed;
        }
        else if (code == 'ArrowRight') {
            this.position.x += speed;
        }
    }
}