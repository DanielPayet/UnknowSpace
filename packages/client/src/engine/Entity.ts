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
    
    public render(context:CanvasRenderingContext2D) {
        this.children.forEach((child) => {
           child.render(context); 
        });
    }
    
    // Base update function (do NOT override): take care of absolute positionning
    public update() {
        this.updateElement();
        if (this.parent != undefined) {
            let distanceFromParent = Math.sqrt(this.position.x * this.position.x + this.position.y * this.position.y);
            let radianTotalRotationZ = (this.parent.absoluteRotationZ * Math.PI / 180);
            
            let radianPositionInducedRotation = 0;
            if (this.position.x == 0) {
                radianPositionInducedRotation = (this.position.y < 0) ? Math.PI : 0;
            }
            else if (this.position.y == 0) {
                radianPositionInducedRotation = (this.position.x < 0) ? -Math.PI/2 : Math.PI/2;
            }
            else {
                radianPositionInducedRotation = Math.atan(this.position.y / this.position.x);
                if (this.position.y < 0) {
                    if (this.position.x < 0) {
                        radianPositionInducedRotation += Math.PI;
                    }
                    else {
                        
                        //radianPositionInducedRotation = Math.PI - (2 * radianPositionInducedRotation);
                    }
                }
            }

            console.log(radianTotalRotationZ * 180 / Math.PI + '  +  ' + radianPositionInducedRotation * 180 / Math.PI);
            
            radianTotalRotationZ += radianPositionInducedRotation;
            console.log('total: ' + radianTotalRotationZ * 180 / Math.PI);
            let radianRotationZ = this.parent.rotationZ * Math.PI / 180;
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
    
    public keyDown(keyCode:number) {}
    public keyUp(keyCode:number) {}
    public mouseMoved(position:any) {}

}