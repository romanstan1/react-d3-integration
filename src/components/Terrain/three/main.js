import * as THREE from 'three'
import {Cube, createLights} from './create'
import WindowResize from 'three-window-resize'

var camera, scene, renderer, cube, frameRequest, width, height, ratio, loop, mouse
var THREEx = window.THREEx


function move(delta){
    // console.log('move')
    // cube.rotation.x += 0.1
    // cube.rotation.y += 0.001
}



export function start() {
  loop = new THREEx.PhysicsLoop(1000)

  loop.add(move)
  loop.start()
  console.log("THREEx",THREEx)
  animate()
}
export function stop() {
  loop.stop()
  cancelAnimationFrame(frameRequest)
}


function onMouseMove( event ) {
	mouse.x = ( event.clientX / width ) * 2 - 1;
	mouse.y = - ( event.clientY / height ) * 2 + 1;
  // console.log("mouse.x: ",mouse.x)
  // console.log("mouse.y: ",mouse.y)
  //
  // console.log("camera: ",camera)

  camera.rotation.x = mouse.x
  camera.rotation.y = mouse.y

  // cube.rotation.x += 0.1
  // cube.rotation.y += 0.001
}

export default function init() {
  console.log("THREEx",THREEx)
  // set up
  windowDimensions()
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(100,ratio,0.1,1000)
  renderer = new THREE.WebGLRenderer({ antialias: true })

  cube = new Cube(scene).mesh
  createLights(scene)

  camera.position.z = 4
  renderer.setClearColor('#000000')
  renderer.setSize(width, height)

  const element = document.getElementById('terrain')
  new WindowResize(renderer, camera)
  element.appendChild(renderer.domElement)


  window.addEventListener( 'mousemove', onMouseMove, false );
  mouse = new THREE.Vector2();


  start()
}





function windowDimensions() {
  width = window.innerWidth
  height = window.innerHeight
  ratio = width / height
}



function animate() {
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01
  // cube.position.x += 0.01

  render()
  frameRequest = requestAnimationFrame( animate );
  // controls.update();
}

function render() {
  renderer.render( scene, camera );
}
