import {Camera} from './Camera';
import {InputEventListener} from './services/InputEventListener';

export class Entity {
    public parent:Entity;
    public children:Array<Entity>= [];

    // Position and rotation relative to the parent
    public position:any = {x: 0, y: 0, z: 0};
    public rotationZ:number = 0;
    
    // Position and rotation relative to the scene (automatic set)
    public absolutePosition:any = {x: 0, y: 0, z: 0};
    public absoluteRotationZ:number = 0;
    
    public addChild(child:Entity) {
        this.children.push(child);
        child.parent = this;
    }
    
    public removeAllChildren() {
        this.children.forEach((child) => {
           child.removeFromParent(); 
        });
    }
    
    public removeFromParent() {
        let index = this.parent.children.indexOf(this);
        this.parent.children.splice(index, 1);
        this.parent = undefined;
    }
    
    public prepareRenderStack(camera:Camera) {
        this.children.forEach((child) => {
           child.prepareRenderStack(camera); 
        });
    }
    
    public render(camera:Camera) {}
    
    // Base update function (do NOT override): take care of absolute positionning
    public update() {
        this.updateElement();
        if (this.parent != undefined) {
            const distanceFromParent = Math.sqrt(this.position.x * this.position.x + this.position.y * this.position.y);
            let radianTotalRotationZ = (this.parent.absoluteRotationZ * Math.PI / 180);
            let radianPositionInducedRotation = 0;

            if (this.position.x == 0) {
                radianPositionInducedRotation = (this.position.y < 0) ? Math.PI : 0;
            }
            else if (this.position.y == 0) {
                radianPositionInducedRotation = (this.position.x < 0) ? -Math.PI/2 : Math.PI/2;
            }
            else {
                radianPositionInducedRotation = Math.atan(this.position.x / this.position.y);
                if (this.position.y < 0) {
                    radianPositionInducedRotation += Math.PI;
                }
            }
            
            radianTotalRotationZ += radianPositionInducedRotation;
            //let radianRotationZ = this.parent.rotationZ * Math.PI / 180;
            this.absoluteRotationZ += this.rotationZ;
            this.absolutePosition.x += Math.cos(Math.PI/2 - radianTotalRotationZ) * distanceFromParent;
            this.absolutePosition.y += Math.sin(Math.PI/2 - radianTotalRotationZ) * distanceFromParent;
            this.absolutePosition.z += this.position.z;
        }
        else {
            this.absolutePosition.x = this.position.x;
            this.absolutePosition.y = this.position.y;
            this.absolutePosition.z = this.position.z;
            this.absoluteRotationZ = this.rotationZ;
        }
        
        this.children.forEach((child) => {
            child.absolutePosition.x = this.absolutePosition.x;
            child.absolutePosition.y = this.absolutePosition.y;
            child.absolutePosition.z = this.absolutePosition.z;
            child.absoluteRotationZ = this.absoluteRotationZ;
            child.update(); 
        });
    };
    
    public updateElement() {}
    
    // EVENT LISTENER
    
    protected registerForKeyPressEvent() {
        InputEventListener.registerForKeyPressEvent(this);
    }
    
    protected registerForKeyDownEvent() {
        InputEventListener.registerForKeyDownEvent(this);
    }
    
    protected registerForKeyUpEvent() {
        InputEventListener.registerForKeyUpEvent(this);
    }
    
    protected registerForScrollEvent() {
        InputEventListener.registerForScrollEvent(this);
    }

    public scrollUp() {}
    public scrollDown() {}
    public keyPress(code:string) {}
    public keyDown(code:string) {}
    public keyUp(code:string) {}
    public mouseMoved(position:any) {}

}