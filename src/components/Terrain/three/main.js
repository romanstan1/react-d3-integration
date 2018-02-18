import * as THREE from 'three'
import {Cube,Boundary, createLights} from './create'
import WindowResize from 'three-window-resize'

var camera, scene, renderer, cube, frameRequest, width, height, ratio, loop, mouse,boundary
var THREEx = window.THREEx
var snake = [0,1,2,3,4]


function move(delta){
    // console.log('move')
    // cube.rotation.x += 0.1
    // cube.rotation.y += 0.001
}



export function start() {
  loop = new THREEx.PhysicsLoop(1000)
  loop.add(move)
  loop.start()
  animate()
}
export function stop() {
  loop.stop()
  cancelAnimationFrame(frameRequest)
}


function onMouseMove( event ) {
	mouse.x = ( event.clientX / width ) * 2 - 1;
	mouse.y = - ( event.clientY / height ) * 2 + 1;

  camera.rotation.x = mouse.y * 3
  camera.rotation.y = mouse.x * -3
}

function zoom(event) {
  if(event.key === 'w') {
    camera.position.x -= Math.sin(camera.rotation.y)
    camera.position.z -= Math.cos(camera.rotation.y)
  }
  else if(event.key === 's'){
    camera.position.x += Math.sin(camera.rotation.y)
    camera.position.z += Math.cos(camera.rotation.y)
  }
  else if(event.key === 'd'){
    camera.position.x += Math.sin(camera.rotation.y + (Math.PI/2))
    camera.position.z += Math.cos(camera.rotation.y + (Math.PI/2))
  }
  else if(event.key === 'a'){
    camera.position.x -= Math.sin(camera.rotation.y + (Math.PI/2))
    camera.position.z -= Math.cos(camera.rotation.y + (Math.PI/2))
  }
}

export default function init() {
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
  window.addEventListener( 'keydown', zoom, false );
  mouse = new THREE.Vector2();

  snake.forEach((value)=>{
    new Cube(scene,camera,renderer,value).mesh
  })
  new Boundary(scene).mesh


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
  frameRequest = requestAnimationFrame(animate)
}

function render() {
  renderer.render( scene, camera )
}
