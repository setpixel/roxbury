import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let canvas, renderer;

const scenes = [];

init();
animate();

function init() {

  canvas = document.getElementById("c");


  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setClearColor(0xff0000, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.autoClear = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .3;


  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  // make each scene: house, workshop, land

  const files = ['house', 'workshop', 'land'];

  files.forEach(function (file) {

    const scene = new THREE.Scene();



    new RGBELoader()
      .setDataType(THREE.UnsignedByteType)
      .setPath('models/')
      .load('river_walk_1_1k.hdr', function (texture) {
        const envmap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();
        scene.environment = envmap;
      });

    // new EXRLoader()
    // .setDataType( THREE.UnsignedByteType )
    // .load( 'models/lauter_waterfall_1k.exr', function ( texture ) {

    //   const envmap = pmremGenerator.fromEquirectangular( texture ).texture;
    //   pmremGenerator.dispose();
    //   scene.environment = envmap;

    //   texture.dispose();

    // } );

    scene.rotation.y = Math.PI / 2;
    // const pmremGenerator = new THREE.PMREMGenerator( renderer );
    // const environment = new RoomEnvironment();
    // scene.environment = pmremGenerator.fromScene( environment ).texture;


    const element = document.getElementById('three-' + file);
    scene.userData.element = element;

    const camera = new THREE.PerspectiveCamera(35, 1, 0.25, 3050);
    camera.position.set(2, 5, 10);




    if (file == 'house') {
      camera.position.set(-34.739720817258195, 9.372662522451744, 31.40068733255596);
    } else if (file == 'workshop') {
      camera.position.set(33.25308157435134, 14.115172909416785, 22.4285379119101);
    } else if (file == 'land') {
      camera.position.set(-501, 251, -630);

    }

    scene.userData.camera = camera;



    const controls = new OrbitControls(scene.userData.camera, scene.userData.element);
    controls.addEventListener('change', render); // use if there is no animation loop
    controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.1;
    controls.autoRotate = false;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.screenSpacePanning = true;
    controls.maxPolarAngle = Math.PI / 1.5;
    controls.target.set(0, 0, 0);
    controls.update();



    if (file == 'house') {
      controls.minDistance = 30
      controls.maxDistance = 60
    } else if (file == 'workshop') {
      controls.minDistance = 30
      controls.maxDistance = 60
    } else if (file == 'land') {
      controls.minDistance = 200
      controls.maxDistance = 1160
    }


    scene.userData.controls = controls;

    const globalPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 999);
    const globalPlanes = [globalPlane];
    scene.userData.globalPlanes = globalPlanes;
    scene.userData.sliceDestination = 10;
    if (file == 'land') {
      scene.userData.sliceDestination = 50;
    }
    const loader = new GLTFLoader().setPath('models/');
    loader.load(file + '.glb', function (gltf) {
      scene.add(gltf.scene);
    });

    // const light = new THREE.HemisphereLight( 0xff0000, 0x00ffff, 1);
    // scene.add( light );

    // // scene.add(new THREE.AmbientLight(0xffffff, 1));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(15, 5, 3);
    scene.add(dirLight);

    scenes.push(scene);
  });


  document.getElementById("house-whole").addEventListener('mousedown', e=> {
    scenes[0].userData.sliceDestination = 10;
  })
  document.getElementById("house-basement").addEventListener('mousedown', e=> {
    scenes[0].userData.sliceDestination = -.15;
  })
  document.getElementById("house-floor-1").addEventListener('mousedown', e=> {
    scenes[0].userData.sliceDestination = 3.3;
  })
  document.getElementById("house-floor-2").addEventListener('mousedown', e=> {
    scenes[0].userData.sliceDestination = 6.5;
  })

  document.getElementById("workshop-whole").addEventListener('mousedown', e=> {
    scenes[1].userData.sliceDestination = 10;
  })
  document.getElementById("workshop-floor-1").addEventListener('mousedown', e=> {
    scenes[1].userData.sliceDestination = 2.5;
  })
  document.getElementById("workshop-floor-2").addEventListener('mousedown', e=> {
    scenes[1].userData.sliceDestination = 5.5;
  })
}

function updateSize() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width !== width || canvas.height !== height) {
    renderer.setSize(width, height, false);
  }
}

function animate() {
  render();
  requestAnimationFrame(animate);
}

function render() {
  updateSize();

  canvas.style.transform = `translateY(${window.scrollY}px)`;

  renderer.setClearColor(0x312e81);
  renderer.setScissorTest(false);
  renderer.clear();

  renderer.setClearColor(0x312e81);
  renderer.setScissorTest(true);

  scenes.forEach(function (scene) {

    scene.userData.globalPlanes[0].constant = scene.userData.globalPlanes[0].constant + ((scene.userData.sliceDestination-scene.userData.globalPlanes[0].constant)*.1)

    // scene.userData.sliceDestination = 999;

    //scenes[0].userData.globalPlanes[0].constant = 999;

    // console.log(scene.userData.camera.position)

   // console.log(scene.userData.controls)

    const element = scene.userData.element;
    const rect = element.getBoundingClientRect();

    if (rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
      rect.right < 0 || rect.left > renderer.domElement.clientWidth) {
      return; // it's off screen
    }

    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    const left = rect.left;
    const bottom = renderer.domElement.clientHeight - rect.bottom;

    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);

    const camera = scene.userData.camera;

    camera.aspect = width / height; // not changing in this example
    camera.updateProjectionMatrix();

    //scene.userData.controls.update();

    renderer.clippingPlanes = scene.userData.globalPlanes;



    renderer.render(scene, camera);

  });



}