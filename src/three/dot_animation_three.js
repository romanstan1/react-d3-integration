import * as THREE from 'three'
import FOUR from './OrbitControls.js'
import {directionChange} from './sequence_functions.js'

var container, camera, controls, scene, renderer
// var shadowCameraHelper
var lightHelper, lightHelper2, spotLight, spotLight2
var counter = 0
var cubes = []

var numberOfCubes = 100;
var halfwayIndex = (numberOfCubes / 2) - 1

var cubesDefinitions

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

  init()
}

export function stop() {
  console.log("stop")
  start = false
}


export function startstop() {
  console.log("startstop")
  start = !start
  run()
}


function init() {
  cubesDefinitions = new Array(numberOfCubes).fill({}).map((item, i) => {
      const halfwayBoolean = i > halfwayIndex
      return {
        ...item,
        color: 'ff0000',
        size: { 'x': 4, 'y': 4,'z': 2 },
        direction: { x: 0, y: -1, z: 0},
        team: halfwayBoolean? 'right' : 'left',
        index: halfwayBoolean? i - halfwayIndex - 1  : i,
        position: {
          'x': halfwayBoolean? 2 : -2,
          'y': 300,
          'z': 0
        },
      }
    })

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

  var floorMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, dithering: true } );
	var floorGeometry = new THREE.BoxGeometry( 2000, 1, 2000 );
	var floor = new THREE.Mesh( floorGeometry, floorMaterial );
	floor.position.set( 0, -500, 0 );
	floor.receiveShadow = true;
	// scene.add( floor );

  function createCubes() {
    cubesDefinitions.forEach( (item, i) => {
      const cubeGeometry = new THREE.BoxGeometry(item.size.x, item.size.y, item.size.z)
      // const cubeMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, dithering: true } )
      const cubeMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff, dithering: true } )
      const cube= new THREE.Mesh( cubeGeometry, cubeMaterial )
      cube.position.set( item.position.x, item.position.y + (item.size.y * item.index), item.position.z)
      cube.userData = {direction: item.direction, team: item.team, index: item.index, size: item.size}
      // cube.castShadow = true;
      cubes.push(cube)

      scene.add(cube)
    })
  }
  createCubes()
  console.log("cubes",cubes)

  var light = new THREE.AmbientLight( 0xffffff, 0.5 );
  scene.add( light );

  spotLight = new THREE.SpotLight( 0xffffff, 1.0 );
  spotLight.position.set( 0, 0, 500 );
  spotLight.angle = 1;
  spotLight.penumbra = 0.95;
  spotLight.distance = 3085;

  spotLight.castShadow = true;
  // spotLight.AmbientLight = 0.5;
  spotLight.shadow.darkness = 0.5;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  spotLight.shadow.camera.near = 0.1;
  spotLight.shadow.camera.far = 2000;
  spotLight.shadow.camera.fov = 30;
  spotLight.decay = 0;

    scene.add( spotLight );

  spotLight2 = new THREE.SpotLight( 0xffffff, 1.0 );
  spotLight2.position.set( 0, 1000, 500 );
  spotLight2.angle = 1;
  spotLight2.penumbra = 0.95;
  spotLight2.distance = 3085;

  spotLight2.castShadow = true;
  // spotLight2.AmbientLight = 0.5;
  spotLight2.shadow.darkness = 0.5;
  spotLight2.shadow.mapSize.width = 1024;
  spotLight2.shadow.mapSize.height = 1024;

  spotLight2.shadow.camera.near = 0.1;
  spotLight2.shadow.camera.far = 2000;
  spotLight2.shadow.camera.fov = 30;
  spotLight2.decay = 0;

  scene.add( spotLight2 );
  //
  // lightHelper = new THREE.SpotLightHelper( spotLight );
	// scene.add( lightHelper );
  //
  // lightHelper2 = new THREE.SpotLightHelper( spotLight2 );
	// scene.add( lightHelper2 );

  // shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
	// scene.add( shadowCameraHelper );

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
      cube.userData.direction = directionChange(cube)
      cube.position.x = cube.position.x + (controls.animationSpeed * cube.userData.direction.x)
      cube.position.y = cube.position.y + (controls.animationSpeed * cube.userData.direction.y)
      cube.position.z = cube.position.z + (controls.animationSpeed * cube.userData.direction.z)
    })
    // console.log("cubes",cubes)
    render();
    requestAnimationFrame( move )
  }
}

function render() {
  // lightHelper.update();
  // lightHelper2.update();
	// shadowCameraHelper.update();
  renderer.render( scene, camera );
}
