// IMPORTS

import { Camera } from './engine/base/Camera';
import { Scene } from './engine/base/Scene';
import { Emitter } from './engine/effect/Emitter';
import { ConstantForce } from './engine/physic/ConstantForce';
import { Force } from './engine/physic/Force';
import { RadialForce } from './engine/physic/RadialForce';
import { CirclePrimitive } from './engine/primitives/CirclePrimitive';
import { SpritePrimitive } from './engine/primitives/SpritePrimitive';
import { SquarePrimitive } from './engine/primitives/SquarePrimitive';

// INIT SCENE

const canvas: HTMLCanvasElement = document.getElementById("renderCanvas") as HTMLCanvasElement;
const scene = new Scene(canvas);
const camera = new Camera(scene);
scene.addChild(camera);
camera.startRender();

// SCENE EXAMPLE

const gravity = new ConstantForce();
gravity.component.y = -10;
scene.addChild(gravity);

const radial = new RadialForce();
radial.force = 50;
radial.position.x = 100;
scene.addChild(radial);

for (let i = 0; i < 20; i++) {
    const physical = new CirclePrimitive();
    physical.radius = 10;
    physical.setColorHSL(((i * 638) % 100), 50, 50);
    physical.velocity.x = 0;
    physical.position.z = 0;
    physical.position.x = (i * 638) % 200;
    physical.position.y = (i * 92) % 200;
    physical.rotationZ = 0;
    physical.mass = 10;
    physical.isPhysical = true;
    scene.addChild(physical);
}

//let box = new SpritePrimitive('textures/box.jpg');
//box.position.z = 0;
//box.position.x = -260;
//box.position.y = -269;
//box.rotationZ = 0;
//box.imageScale = 0.05;
//this.addChild(box);
//box = new SpritePrimitive('textures/box.jpg');
//box.position.z = 0;
//box.position.x = -200;
//box.position.y = -269;
//box.rotationZ = 0;
//box.imageScale = 0.05;
//this.addChild(box);
//box = new SpritePrimitive('textures/box.jpg');
//box.position.z = 0;
//box.position.x = -240;
//box.position.y = -219;
//box.rotationZ = 0;
//box.imageScale = 0.05;
//this.addChild(box);

const plan = new SquarePrimitive();
plan.position.z = 0;
plan.position.x = 0;
plan.position.y = 0;
plan.rotationZ = 0;
plan.width = 800;
plan.height = 10;
plan.isPhysical = true;
scene.addChild(plan);

//DUMMY
//square = new SquarePrimitive();
//square.position.z = 0;
//square.position.x = 100;
//square.position.y = 0;
//square.rotationZ = 45;
//square.width = 5;
//square.height = 5;
//this.addChild(square);

// END OF INDEX
