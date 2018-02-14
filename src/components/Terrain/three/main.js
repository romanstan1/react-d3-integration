import * as THREE from 'three'
import {Cube, createLights} from './create'
var camera, scene, renderer, cube, frameRequest, width, height, ratio


export function start() {
  animate()
}
export function stop() {
  cancelAnimationFrame(frameRequest)
}


export default function init() {
  windowDimensions()
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75,ratio,0.1,1000)
  renderer = new THREE.WebGLRenderer({ antialias: true })

  cube = new Cube(scene).mesh

  createLights(scene)

  camera.position.z = 4
  // scene.add(cube)
  renderer.setClearColor('#000000')
  renderer.setSize(width, height)

  const element = document.getElementById('terrain')
  window.addEventListener( 'resize', onWindowResize, false );
  element.appendChild(renderer.domElement)
  animate()
}

function windowDimensions() {
  width = window.innerWidth
  height = window.innerHeight
  ratio = width / height
}

function onWindowResize() {
  windowDimensions()
  camera.aspect = ratio
  renderer.setSize(width, height );
  render();
}

function animate() {
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  // cube.position.x += 0.01
  render()
  frameRequest = requestAnimationFrame( animate );
  // controls.update();
}

function render() {
  renderer.render( scene, camera );
}
