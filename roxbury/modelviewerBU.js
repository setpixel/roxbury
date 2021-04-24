import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer;
let controls;

init();
animate();

function init() {
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  var container = document.getElementById('canvas');
  var w = container.offsetWidth;
  var h = container.offsetHeight;
  renderer.setSize(w, h);
  container.appendChild(renderer.domElement);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.autoClear = true;

  camera = new THREE.PerspectiveCamera( 35, w / h, 0.25, 150 );
  camera.position.set( 2,5, 10 );

  const environment = new RoomEnvironment();
  const pmremGenerator = new THREE.PMREMGenerator( renderer );

  const globalPlane = new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), 5.6 );
  const globalPlanes = [ globalPlane ];
  renderer.clippingPlanes = globalPlanes;

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x312e81 );
  scene.environment = pmremGenerator.fromScene( environment ).texture;
  const loader = new GLTFLoader().setPath( 'models/' );
  loader.load( 'house.glb', function ( gltf ) {
    scene.add( gltf.scene );
    render();
  } );

  scene.add( new THREE.AmbientLight( 0x505050 ) );


  const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
  dirLight.position.set( 5, 5, 0 );
  scene.add( dirLight );

  controls = new OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render ); // use if there is no animation loop
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.screenSpacePanning = true;
  controls.maxPolarAngle = Math.PI / 1.5;
  controls.minDistance = 50;
  controls.maxDistance = 50;
  controls.target.set( 0, 0, 0 );
  controls.update();

  window.addEventListener( 'resize', onWindowResize );


 setTimeout(onWindowResize, 100);

}

function onWindowResize() {
  var container = document.getElementById('canvas');
  var w = container.offsetWidth;
  var h = container.offsetHeight;
  renderer.setSize(w, h);
  camera.aspect = w /h;
  camera.updateProjectionMatrix();
  render();
}

function animate() {
  // requestAnimationFrame( animate );
  // controls.update();
  // //renderer.clippingPlanes[0].constant += 0.01
  render();
}

function render() {
  renderer.render( scene, camera );
}