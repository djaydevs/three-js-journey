import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);


// mesh.position.set(0.7, -0.6, 1);
// mesh.scale.set(2, 0.5, 0.5);

// mesh.rotation.reorder("YXZ");
// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.25;

// mesh.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 0.25);
// mesh.quaternion.multiply(
//   new THREE.Quaternion().setFromAxisAngle(
//     new THREE.Vector3(1, 0, 0),
//     Math.PI * 0.25
//   )
// );

// // Add after existing mesh setup
// const targetQuaternion = new THREE.Quaternion();
// targetQuaternion.setFromEuler(new THREE.Euler(Math.PI * 0.25, Math.PI * 0.25, 0));

// scene.add(mesh);

const group = new THREE.Group();
group.position.y = 1;
group.scale.y = 2;
group.rotation.y = 1;
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
cube2.position.x = -2;
group.add(cube2);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
cube3.position.x = 2;
group.add(cube3);

// mesh.position.normalize();
// console.log(mesh.position.length());

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height);
camera.position.z = 4;
scene.add(camera);

// camera.lookAt(mesh.position);

// console.log(mesh.position.distanceTo(camera.position));

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
