import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Mesh } from "@babylonjs/core/Meshes/mesh";

import { SimpleMaterial } from "@babylonjs/materials";

// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import "@babylonjs/core/Meshes/meshBuilder";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import Socket from "./socket";

const socket = new Socket();

// Get the canvas element from the DOM.
const canvas: HTMLCanvasElement = document.getElementById("renderCanvas") as HTMLCanvasElement;

// Associate a Babylon Engine to it.
const engine: Engine = new Engine(canvas);

// Create our first scene.
var scene: Scene = new Scene(engine);

// This creates and positions a free camera (non-mesh)
var camera: FreeCamera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

// This targets the camera to scene origin
camera.setTarget(Vector3.Zero());

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light: HemisphericLight = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;

// Create a grid material
var material: SimpleMaterial = new SimpleMaterial("text5", scene);

// Our built-in 'sphere' shape. Params: name, subdivs, size, scene
var sphere: Mesh = Mesh.CreateSphere("sphere1", 16, 2, scene);

// Move the sphere upward 1/2 its height
sphere.position.y = 2;

// Affect a material
material.diffuseTexture = new Texture("./textures/misc.jpg", scene);
material.diffuseTexture.hasAlpha = true;

sphere.material = material;

// Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
var ground: Mesh = Mesh.CreateGround("ground1", 6, 6, 2, scene);

// Render every frame
engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});