import { Renderable } from '../Renderable';

export class SpritePrimitive extends Renderable {
    public imageScale: number = 1;
    public radius: number = 50;
    public blendMode: string = 'source-over';
    private image: any;

    constructor(imagePath: string) {
        super();
        this.image = new Image();
        this.image.src = imagePath;
    }

    public preRenderTransformation(context: CanvasRenderingContext2D) {
        context.transform(1, 0, 0, 1, (context.canvas.width / 2), (context.canvas.height / 2));
        context.translate(this.absolutePosition.x, this.absolutePosition.y);
        context.rotate(this.absoluteRotationZ * Math.PI / 180);
        context['imageSmoothingEnabled'] = true;
        context['mozImageSmoothingEnabled'] = true;
        context['oImageSmoothingEnabled'] = true;
        context['webkitImageSmoothingEnabled'] = true;
        context['msImageSmoothingEnabled'] = true;
    }

    public renderElement(context: CanvasRenderingContext2D) {
        context.globalCompositeOperation = this.blendMode;
        const width = this.image.width;
        const height = this.image.height;
        const destinationWidth = width * this.imageScale;
        const destinationHeight = height * this.imageScale;
        context.drawImage(this.image, 0, 0, width, height, -destinationWidth / 2, -destinationHeight / 2, destinationWidth, destinationHeight);
    }

    public updateElement() {
        this.rotationZ++;
    }
}
