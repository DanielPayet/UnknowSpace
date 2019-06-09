import {Renderable} from '../Renderable';
import {Camera} from '../Camera';

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
    
    public renderElement(context:CanvasRenderingContext2D) {
        context.globalCompositeOperation = this.blendMode;
        const width = this.image.width;
        const height = this.image.height;
        const destinationWidth = width * this.imageScale;
        const destinationHeight = height * this.imageScale;
        context.drawImage(this.image, 0, 0, width, height, -destinationWidth/2, -destinationHeight/2, destinationWidth, destinationHeight);
    }
    
    public updateElement() {
        this.rotationZ += 0.5;
    }
}