import * as THREE from 'three'
import {createLights} from './create'
import WindowResize from 'three-window-resize'
import _ from 'lodash'
// import heightmap from "../../../assets/heightmap.png";

var camera, scene, renderer, frameRequest, width, height, ratio, mouse
var terrain, texture
var THREEx = window.THREEx

export function start() {
  animate()
}

export function uninitAndStop() {
  cancelAnimationFrame(frameRequest)
  window.removeEventListener( 'mousemove', onMouseMove, false );
  camera, scene, renderer, frameRequest, width, height, ratio, mouse = null
}

function onMouseMove( event ) {
	mouse.x = ( event.clientX / width ) * 2 - 1;
	mouse.y = - ( event.clientY / height ) * 2 + 1;

  camera.rotation.x = mouse.y * 0.1
  camera.rotation.y = mouse.x * -0.1
}


export default function init() {
  // default initialization
  windowDimensions()
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75,ratio,0.1,1000)
  renderer = new THREE.WebGLRenderer({ antialias: true })

  createLights(scene)
  scene.add( new THREE.AxesHelper( 1000 ) );

  camera.position.z = 33
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
  render()
  frameRequest = requestAnimationFrame(animate)
}

function render() {
  renderer.render( scene, camera )
}
