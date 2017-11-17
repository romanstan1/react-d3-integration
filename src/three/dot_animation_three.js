import * as THREE from 'three'
import FOUR from './OrbitControls.js'

var container, camera, controls, scene, renderer, cube, cubes, start;
var shadowCameraHelper, lightHelper, spotLight;
var tick = 0
var counter = 0

start = false;

function run() {
  animate()
  move()
}

export function reinit () {
  start = false
  console.log("reinit")
  const element = document.getElementById( 'dot-canvas' )
  const parent = element.parentNode
  parent.removeChild(element)
  const node = document.createElement("div");
  node.id = 'dot-canvas'
  parent.appendChild(node)

  tick = 0
  counter = 0

  init()
}


export function startstop() {
  console.log("startstop")
  start = !start
  run()
}


export function init() {

  camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 50000 );
  camera.position.z = 500;
  camera.position.y = 50;
  camera.position.x = 0;

  controls = new FOUR.OrbitControls( camera );
  controls.addEventListener( 'change', render );

  scene = new THREE.Scene();

  var floorMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, dithering: true } );
	var floorGeometry = new THREE.BoxGeometry( 2000, 1, 2000 );
	var floor = new THREE.Mesh( floorGeometry, floorMaterial );
	floor.position.set( 0, 0, -500 );
	floor.receiveShadow = true;
	scene.add( floor );



  // const
  //
  //
  // {
  //
  // }

  var cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
  var cubeMaterial = new THREE.MeshStandardMaterial( { color:0xffffff } );
  cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
  cube.position.set(0,300,0);
  cube.castShadow = true;
  scene.add(cube);






  var light = new THREE.AmbientLight( 0xffffff, 0.3 );
  scene.add( light );

  spotLight = new THREE.SpotLight( 0xffffff, 0.8 );
  spotLight.position.set( 200, 300, 500 );
  spotLight.angle = 0.75;
  spotLight.penumbra = 0.35;
  spotLight.distance = 2085;


  spotLight.castShadow = true;
  // spotLight.AmbientLight = 0.5;
  spotLight.shadow.darkness = 0.5;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  spotLight.shadow.camera.near = 0.1;
  spotLight.shadow.camera.far = 2000;
  spotLight.shadow.camera.fov = 30;
  spotLight.decay = 2;

  scene.add( spotLight );
  //
  lightHelper = new THREE.SpotLightHelper( spotLight );
	scene.add( lightHelper );
  //
  shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
	scene.add( shadowCameraHelper );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor( 0x000000 );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;


  container = document.getElementById( 'dot-canvas' );
  container.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize( window.innerWidth, window.innerHeight );
  render();
}

function animate() {
  requestAnimationFrame( animate );
  controls.update();
}

function move() {
  // spotLight.rotation.x += 0.01;
  // spotLight.rotation.y += 0.01;
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  // if(counter % )console.log("counter",counter)
  if (start)  {
    counter++
    console.log("counter",counter)
    cube.position.y -= 0.8
    render();
    requestAnimationFrame( move )
  }
}

function render() {
  lightHelper.update();
	shadowCameraHelper.update();
  renderer.render( scene, camera );
}
