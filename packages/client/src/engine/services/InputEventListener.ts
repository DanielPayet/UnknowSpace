import {Entity} from '../Entity';

export class InputEventListener {
    public static keyPressRegisteredEntities:Array<Entity> = [];
    public static keyDownRegisteredEntities:Array<Entity> = [];
    public static keyUpRegisteredEntities:Array<Entity> = [];
    private static keyPressCodes:Array<string> = [];
    
    public static init() {
        window.onkeydown = InputEventListener.notifyKeyDown;
        window.onkeyup = InputEventListener.notifyKeyUp;
    }
    
    // REGISTRATION
    
    public static registerForKeyPressEvent(entity:Entity) {
        InputEventListener.keyPressRegisteredEntities.push(entity);
    }   
    
    public static registerForKeyDownEvent(entity:Entity) {
        InputEventListener.keyDownRegisteredEntities.push(entity);
    }
    
    public static registerForKeyUpEvent(entity:Entity) {
        InputEventListener.keyUpRegisteredEntities.push(entity);
    }
    
    // NOTIFICATION
    
    public static notifyKeyPress() {
        InputEventListener.keyPressCodes.forEach((code:string) => {
            InputEventListener.keyPressRegisteredEntities.forEach((entity) => {
                entity.keyPress(code);
            });
        });
    }
    
    public static notifyKeyDown(event:KeyboardEvent) {
        if (!event.repeat) {
            const code = event.code;
            InputEventListener.keyPressCodes.push(code);
            InputEventListener.keyDownRegisteredEntities.forEach((entity) => {
                entity.keyDown(code);
            });
        }
    }
    
    public static notifyKeyUp(event:KeyboardEvent) {
        if (!event.repeat) {
            const code = event.code;
            const codeIndex:number = InputEventListener.keyPressCodes.findIndex((element) => {return element == code});
            InputEventListener.keyPressCodes.splice(codeIndex, 1);
            InputEventListener.keyUpRegisteredEntities.forEach((entity) => {
                entity.keyUp(code);
            });
        }
    }
}