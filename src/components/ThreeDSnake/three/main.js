import * as THREE from 'three'
import {Cube,Boundary, createLights} from './create'
import {snakeDirection} from './modules'
import WindowResize from 'three-window-resize'
import _ from 'lodash'

var camera, scene, renderer, frameRequest, width, height, ratio, loop, mouse, boundary = null
var counter = 0
var THREEx = window.THREEx
var snake = [ 0,-1,-2,-3,-4 ]

var snakeAbsoluteDirection = 'ArrowRight'

function move(delta){
  counter++
  // console.log("counter: ",counter)
  // console.log("")
    _.forEachRight(snake,cube => {
    const direction = snakeDirection(snakeAbsoluteDirection)
    // console.log("cube.userData.index: ",cube.userData.index, cube)
    if(cube.userData.index === 0) {
      cube.position.x += direction.x * 2
      cube.position.y += direction.y * 2
      cube.position.z += direction.z * 2
    } else {
      const precedecingCube = snake[cube.userData.index - 1]
      cube.position.x = precedecingCube.position.x
      cube.position.y = precedecingCube.position.y
      cube.position.z = precedecingCube.position.z
    }
  })
}

export function start() {
  loop = new THREEx.PhysicsLoop(5)
  loop.add(move)
  loop.start()
  animate()
}

export function uninitAndStop() {
  stop()
  cancelAnimationFrame(frameRequest)
  window.removeEventListener( 'mousemove', onMouseMove, false );
  window.removeEventListener( 'keydown', keydown, false );
  camera, scene, renderer, frameRequest, width, height, ratio, loop, mouse, boundary = null
  counter = 0
  snake = [ 0,-1,-2,-3,-4 ]
}

export function stop() {
  loop.stop()
}

function onMouseMove( event ) {
	mouse.x = ( event.clientX / width ) * 2 - 1;
	mouse.y = - ( event.clientY / height ) * 2 + 1;

  camera.rotation.x = mouse.y * 0.5
  camera.rotation.y = mouse.x * -0.5
}

function keydown(event) {
  // change the snake direction

  // zoom
  if (event.key === 'w') {
    camera.position.x -= Math.sin(camera.rotation.y)
    camera.position.z -= Math.cos(camera.rotation.y)
  }
  else if (event.key === 's'){
    camera.position.x += Math.sin(camera.rotation.y)
    camera.position.z += Math.cos(camera.rotation.y)
  }
  else if (event.key === 'd'){
    camera.position.x += Math.sin(camera.rotation.y + (Math.PI/2))
    camera.position.z += Math.cos(camera.rotation.y + (Math.PI/2))
  }
  else if (event.key === 'a'){
    camera.position.x -= Math.sin(camera.rotation.y + (Math.PI/2))
    camera.position.z -= Math.cos(camera.rotation.y + (Math.PI/2))
  }
  else if (
    event.key === 'ArrowRight' ||
    event.key === 'ArrowLeft'  ||
    event.key === 'ArrowUp'    ||
    event.key === 'ArrowDown'  ||
    event.key === 'r'          ||
    event.key === 'f' ) {
    snakeAbsoluteDirection = event.key
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
  window.addEventListener( 'keydown', keydown, false );
  mouse = new THREE.Vector2();

  snake = snake.map((value)=>value = new Cube(scene,camera,renderer,value).mesh )
  boundary = new Boundary(scene).mesh

  console.log("snake",snake)
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
