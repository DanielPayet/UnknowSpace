export class Entity {
    public parent:Entity = null;
    public position:any = {x: 0, y: 0};
    public rotationZ:number = 0;
    public children:Array<Entity>= [];
    
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
        this.parent = null;
    }
    
    public render(context:CanvasRenderingContext2D) {
        this.children.forEach((child) => {
           child.render(context); 
        });
    };
}