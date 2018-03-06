import * as THREE from 'three'
import {generateTexture, generateHeight, CreateLights, Cube} from './modules'
import WindowResize from 'three-window-resize'
import _ from 'lodash'
var terrainData = require('../../../assets/terrainData.json');

var Stats = window.Stats
var container, stats
var camera, scene, renderer, mouse, width, height,cube, light
var mesh, texture
var vertices, data, geometry
var worldWidth = 200
var worldDepth = 200
var worldHalfWidth = worldWidth / 2
var worldHalfDepth = worldDepth / 2

export function init() {

  // init

  windowDimensions()
  container = document.getElementById( 'terrain' )
  camera = new THREE.PerspectiveCamera( 60, width / height, 1, 20000 )
  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize( width, height );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  container.appendChild( renderer.domElement );
  // scene.background = new THREE.Color( 0x09131e )


  // lights -------------------
  light = new CreateLights(scene).light

  // console.log("light",light)

  // var targetObject = new THREE.Object3D();
  // console.log("targetObject",targetObject)
  // scene.add(targetObject);
  //
  // light.target = targetObject;

  // data = generateHeight( worldWidth, worldDepth )
  // camera.position.y = data[ worldHalfWidth + worldHalfDepth * worldWidth ] * 10 + 600;
  // camera.position.y = 200
  // console.log("camera.position.z",camera.position.z)
  camera.position.x = -600
  camera.position.y = 1000
  camera.position.z = 6000




  // console.log("camera.position.y",camera.position.y)
  geometry = new THREE.PlaneBufferGeometry( 7500, 7500, worldWidth - 1, worldDepth - 1 );
  geometry.rotateX( - Math.PI / 2 );

  animateLandscape(geometry.attributes.position.array)

  // texture = new THREE.CanvasTexture( generateTexture( data, worldWidth, worldDepth ) );
  // texture.wrapS = THREE.ClampToEdgeWrapping;
  // texture.wrapT = THREE.ClampToEdgeWrapping;

  // mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
  mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color:'#433F81'}))
  scene.add( new THREE.AxesHelper( 5000 ) );

  scene.add( mesh );
  stats = new Stats();
  cube = new Cube(scene).mesh

  mouse = new THREE.Vector2();
  window.addEventListener( 'keydown', keydown, false );
  window.addEventListener( 'mousemove', onMouseMove, false );
  new WindowResize(renderer, camera)
}


function animateLandscape(vertices) {
  for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
    vertices[ j + 1 ] = terrainData[ i ] * 10;
  }
}

function keydown(event) {
  // change the snake direction

  // zoom
  if (event.key === 'w') {
    camera.position.x -= Math.sin(camera.rotation.y) * 100
    camera.position.z -= Math.cos(camera.rotation.y) * 100
  }
  else if (event.key === 's'){
    camera.position.x += Math.sin(camera.rotation.y) * 100
    camera.position.z += Math.cos(camera.rotation.y) * 100
  }
  else if (event.key === 'd'){
    camera.position.x += Math.sin(camera.rotation.y + (Math.PI/2)) * 100
    camera.position.z += Math.cos(camera.rotation.y + (Math.PI/2)) * 100
  }
  else if (event.key === 'a'){
    camera.position.x -= Math.sin(camera.rotation.y + (Math.PI/2)) * 100
    camera.position.z -= Math.cos(camera.rotation.y + (Math.PI/2)) * 100
  }
  else if (event.key === 'p') {
    console.log("vertices: ",JSON.stringify(data))
  }
}

function windowDimensions() {
  width = window.innerWidth
  height = window.innerHeight
}

function onMouseMove( event ) {
	mouse.x = ( event.clientX / width ) * 2 - 1;
	mouse.y = - ( event.clientY / height ) * 2 + 1;
  camera.rotation.x = mouse.y * 0.1
  camera.rotation.y = mouse.x * -0.1
  light.target.position.x = mouse.x * 7000
  light.target.position.y = mouse.y * 15000
}

export function animate() {
  // animateLandscape()
  requestAnimationFrame( animate )
  render()
  // stats.update();
}

function render() {
  renderer.render( scene, camera );
}
