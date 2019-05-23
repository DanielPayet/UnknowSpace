import {Renderable} from '../Renderable';
import {Entity} from '../Entity';

export class SpritePrimitive extends Renderable {
    public imageScale:number = 1;
    public radius:number = 50;
    public blendMode:string = 'source-over';
    private image:any;
    
    constructor(imagePath:string) {
        super();
        this.image = new Image();
        this.image.src = imagePath;
    }
    
    public preRenderTransformation(context:CanvasRenderingContext2D) {
        context.transform(1, 0, 0, 1, (context.canvas.width / 2), (context.canvas.height / 2));
        context.translate(this.absolutePosition.x, this.absolutePosition.y);
        context.rotate(this.absoluteRotationZ * Math.PI / 180);
    }
    
    public renderElement(context:CanvasRenderingContext2D) {
        context.globalCompositeOperation = this.blendMode;
        let width = this.image.width;
        let height = this.image.height;
        let destinationWidth = width * this.imageScale;
        let destinationHeight = height * this.imageScale;
        context.drawImage(this.image, 0, 0, width, height, -destinationWidth/2, -destinationHeight/2, destinationWidth, destinationHeight);
    }
    
    public updateElement() {
        this.rotationZ += 1;
    }
}