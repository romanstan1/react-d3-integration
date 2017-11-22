import * as THREE from 'three'
import FOUR from './OrbitControls.js'
import {CreateCubes, CreateLights} from './modules.js'
import {positionChange} from './sequence_functions.js'

var container, camera, controls, scene, renderer
// var shadowCameraHelper
// var lightHelper, lightHelper2, spotLight, spotLight2
var counter = 0
var cubes = []
var frameRequest
var helperBoolean = true
var start = false;

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

  counter = 0
  stop()
  cubes = []
  init()
}

export function stop() {
  cancelAnimationFrame(frameRequest);
}
export function helper() {
  helperBoolean = !helperBoolean
}


export function startstop() {
  start = !start
  if(start) run()
  else cancelAnimationFrame(frameRequest)
}


function init() {
  camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 50000 );
  camera.position.z = 960;
  camera.position.y = 50;
  camera.position.x = 0;

  // camera.useTarget = false;
  // camera.rotation.x = 0;
  // camera.rotation.y = 30;
  // camera.rotation.x = 0;
  // camera.lookAt(new THREE.Vector3(200,200,0));

  controls = new FOUR.OrbitControls( camera );
  controls.addEventListener( 'change', render );
  scene = new THREE.Scene();

  const instantiateCubes = new CreateCubes(cubes, scene)
  cubes = instantiateCubes.cubes
  scene = instantiateCubes.scene

  const instantiateLights = new CreateLights(scene, helperBoolean)
  scene = instantiateLights.scene

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor( 0x000000 );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container = document.getElementById( 'dot-canvas' );
  container.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );
  run()
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
  if (start)  {
    counter++

    cubes.forEach((cube, i) => {
      const newPosition = positionChange('x', cube, counter, controls.animationSpeed)
      cube.position.set(newPosition.x, newPosition.y, newPosition.z)
    })

    render();
    frameRequest = requestAnimationFrame( move )
  }
}

function render() {
  // lightHelper.update();
  // lightHelper2.update();
	// shadowCameraHelper.update();
  renderer.render( scene, camera );
}
