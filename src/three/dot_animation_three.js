import * as THREE from 'three'
import FOUR from './OrbitControls.js'
import {CreateCubes, CreateLights} from './modules.js'
import {positionChange} from './sequence_functions.js'
import THREEx from './THREEx.js'


var container, camera, controls, scene, renderer
// var shadowCameraHelper
// var lightHelper, lightHelper2, spotLight, spotLight2
var cubes = []
var frameRequest
var helperBoolean = false
var start = false;
let act = 1

function run() {
  animate()
  move()
}

export function reinit () {
  start = false
  const element = document.getElementById( 'dot-canvas' )
  const parent = element.parentNode
  parent.removeChild(element)
  const node = document.createElement("div");
  node.id = 'dot-canvas'
  parent.appendChild(node)

  stop()
  cubes = []
  init()
}

export function nextAct(incomingAct) {
  act = incomingAct
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
  camera.position.y = 0;
  camera.position.x = 0;

  // camera.useTarget = false;
  // camera.rotation.x = 0;
  // camera.rotation.y = 30;
  // camera.rotation.x = 0;
  // camera.lookAt(new THREE.Vector3(200,200,0));

  THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

	// var domEvents	= new THREEx.DomEvents(camera, renderer.domElement)

  controls = new FOUR.OrbitControls( camera );
  controls.addEventListener( 'change', render );
  scene = new THREE.Scene();


  const instantiateLights = new CreateLights(scene, helperBoolean)
  scene = instantiateLights.scene
  // renderer = new THREE.CanvasRenderer( { alpha: true }); // gradient
  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  // renderer.setClearColor( 0x000000 );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const instantiateCubes = new CreateCubes(cubes, scene, camera, renderer)
  cubes = instantiateCubes.cubes
  scene = instantiateCubes.scene

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

    cubes.forEach((cube, i) => {
      const newPosition = positionChange(cube, controls.animationSpeed, act)
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
