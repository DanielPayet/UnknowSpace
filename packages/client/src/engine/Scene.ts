import { Entity } from './Entity';
import { SquarePrimitive } from './primitives/SquarePrimitive';
import { SpritePrimitive } from './primitives/SpritePrimitive';
import { CirclePrimitive } from './primitives/CirclePrimitive';

export class Scene {
    private canva: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private rootEntity: Entity;
    private backgroundColor: string = '#050508';

    constructor(canva: HTMLCanvasElement) {
        this.canva = canva;
        this.context = canva.getContext('2d');
        this.rootEntity = new Entity();

        const planet = new SpritePrimitive('planet/MeridaOne.png');
        planet.imageScale = 0.1;

        const planetEffect = new SpritePrimitive('effect/MeridaOneEffect.png');
        planetEffect.imageScale = 0.28;
        planetEffect.blendMode = 'hard-light';

        planet.addChild(planetEffect);

        this.rootEntity.addChild(planet);

        let circle1 = new CirclePrimitive();
        circle1.position.x = 200;
        circle1.position.y = 0;
        circle1.radius = 10;
        circle1.color = "red";

        let circle2 = new CirclePrimitive();
        circle2.position.x = 50;
        circle2.radius = 10;

        let circle3 = new CirclePrimitive();
        circle3.position.x = 20;
        circle3.radius = 5;

        let s1 = new SquarePrimitive();
        s1.position.x = 150;
        s1.position.y = 150;

        let s2 = new SquarePrimitive();
        s2.position.x = -200;
        s2.position.y = 200;

        let s3 = new SquarePrimitive();
        s3.position.x = 200;
        s3.position.y = -200;

        let s4 = new SquarePrimitive();
        s4.position.x = -200;
        s4.position.y = -200;

        planet.addChild(circle1);
        circle1.addChild(circle2);
        circle2.addChild(circle3);

        //circle1.addChild(s1);
        //circle1.addChild(s2);
        //circle1.addChild(s3);
        //circle1.addChild(s4);
    }

    public update() {
        this.rootEntity.update();
    }

    public render() {
        this.context.clearRect(0, 0, this.canva.width, this.canva.height);
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.canva.width, this.canva.height);
        this.rootEntity.render(this.context);
    }
}