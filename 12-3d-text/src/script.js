import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
// const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
// matcapTexture.colorSpace = THREE.SRGBColorSpace;

const donuts = [];
const matcapTextures = [];

const textureLoader = new THREE.TextureLoader();

for (let i = 1; i <= 8; i++) {
  const texture = textureLoader.load(`/textures/matcaps/${i}.png`);
  texture.colorSpace = THREE.SRGBColorSpace;
  matcapTextures.push(texture);
}

// Debug
const gui = new GUI()

const debugObject = {
  matcapTexture: 8,
  rotationEnabled: true,
  rotationSpeed: 3,
  fallingEnabled: true,
  fallingSpeed: 2,
  resetDonuts: () => {
    donuts.forEach((donut) => {
      donut.position.y = (Math.random() - 0.5) * 15;
      donut.position.x = (Math.random() - 0.5) * 15;
      donut.position.z = (Math.random() - 0.5) * 10;
    });
  },
};

const material = new THREE.MeshMatcapMaterial({
  matcap: matcapTextures[debugObject.matcapTexture - 1],
});

const donutFolder = gui.addFolder("Donuts");
donutFolder
  .add(debugObject, "matcapTexture")
  .min(1)
  .max(8)
  .step(1)
  .name("Textures")
  .onChange((value) => {
    material.matcap = matcapTextures[value - 1];
  });
donutFolder.add(debugObject, "rotationEnabled").name("Enable Rotation");
donutFolder
  .add(debugObject, "rotationSpeed")
  .min(0)
  .max(5)
  .step(0.1)
  .name("Rotation Speed");
donutFolder.add(debugObject, "fallingEnabled").name("Enable Falling");
donutFolder
  .add(debugObject, "fallingSpeed")
  .min(0)
  .max(5)
  .step(0.1)
  .name("Falling Speed");
donutFolder.add(debugObject, "resetDonuts").name("Reset Positions");

/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    const textGeometry = new TextGeometry("< djaydevs />", {
        font: font,
        size: 0.5,
        depth: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
    });

    // centers the text without using the center() method
    //   textGeometry.computeBoundingBox()
    //   textGeometry.translate(
    //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5, // Subtract bevel size
    //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5, // Subtract bevel size
    //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5 // Subtract bevel thickness
    //   );
    textGeometry.center()

    // const material = new THREE.MeshMatcapMaterial();
    // material.matcap = matcapTextures;
    //   textMaterial.wireframe = true
    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

    Array.from({ length: 100 }, () => {
      const donut = new THREE.Mesh(donutGeometry, material);
      donut.shouldFall = false;
      donut.fallDelay = Math.random() * 10;

      donut.position.x = (Math.random() - 0.5) * 15;
      donut.position.y = (Math.random() - 0.5) * 15;
      donut.position.z = (Math.random() - 0.5) * 10;

      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI;

      donut.scale.set(0, 0, 0);

      donut.rotationSpeed = {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      };

      scene.add(donut);
      donuts.push(donut);
    });
});

/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime();

    donuts.forEach((donut, index) => {
        if (debugObject.rotationEnabled) {
            donut.rotation.x +=
            donut.rotationSpeed.x * 0.01 * debugObject.rotationSpeed;
            donut.rotation.y +=
            donut.rotationSpeed.y * 0.01 * debugObject.rotationSpeed;
        }

        if (debugObject.fallingEnabled) {
          if (!donut.shouldFall && elapsedTime > donut.fallDelay) {
            donut.shouldFall = true;
          }

          if (donut.shouldFall) {
            donut.position.y -= 0.02 * debugObject.fallingSpeed;

            if (donut.position.y < -15) {
              donut.position.y = 15;
              donut.position.x = (Math.random() - 0.5) * 15;
              donut.position.z = (Math.random() - 0.5) * 10;
              donut.shouldFall = false;
              donut.fallDelay = elapsedTime + Math.random() * 5; // New random delay
            }
          }
        }

        const delay = index * 0.05;
        if (elapsedTime > delay) {
            const scale = Math.min((elapsedTime - delay) * 2, 1);
            donut.scale.set(scale, scale, scale);
        }
    });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
}

tick()
