import * as THREE from 'three'
import THREEx from './THREEx.js'

export let halfRowLength = 5

export const numberOfCubes = (halfRowLength * 2) * (halfRowLength * 2)
let halfwayIndex = (numberOfCubes / 2) - 1

console.log("numberOfCubes",numberOfCubes)

export function CreateCubes(cubes, scene, camera, renderer) {
  var domEvents	= new THREEx.DomEvents(camera, renderer.domElement)
  const cubesDefinitions = new Array(numberOfCubes).fill({}).map((item, i) => {
      const halfwayBoolean = i > halfwayIndex
      const index = halfwayBoolean? i - halfwayIndex - 1  : i
      const rowIndex = Math.floor(index/halfRowLength)
      return {
        ...item,
        color: 'ff0000',
        size: { 'x': 4, 'y': 4,'z': 1 },
        direction: { x: 1, y: 0, z: 0},
        team: halfwayBoolean? 'right' : 'left',
        index: index,
        uniqueIndex: i,
        rowIndex: rowIndex,
        centralProximity: rowIndex < 5 ? halfRowLength - rowIndex : halfRowLength - rowIndex - 1,
        position: {
          'x': halfwayBoolean? 2 : -2,
          'y': 300,
          'z': 0
        },
      }
    })

  cubesDefinitions.forEach( (item, i) => {
    const cubeGeometry = new THREE.BoxGeometry(item.size.x, item.size.y, item.size.z)
    // const cubeMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, dithering: true } )
    const cubeMaterial = new THREE.MeshStandardMaterial( {
      // color: item.index%halfRowLength === 0? 0xffffff : 0x07ccc5,
      color: item.index%halfRowLength === (halfRowLength - 1)?
      0xb20059 : item.index%halfRowLength === 0? // b20059 is pink
      0xffffff : 0x07ccc5, // ffffff is white
      // wireframe: true,
      // wireframe_linewidth: 2,
      // color: 0xb20059,
      // color: 0x07ccc5,
      // color: 0xffffff,
      dithering: true } )
    const cube = new THREE.Mesh( cubeGeometry, cubeMaterial )
    cube.position.set( item.position.x, item.position.y + (item.size.y * item.index), item.position.z)
    cube.userData = {
      direction: item.direction,
      team: item.team,
      index: item.index,
      size: item.size,
      centralProximity: item.centralProximity,
      rowIndex: item.rowIndex,
      uniqueIndex: item.uniqueIndex,
      original: true
    }
    // cube.castShadow = true;

    domEvents.addEventListener(cube, 'click', function(event){
  		console.log('you clicked on cube', cube, item.index, cube.position)
  	}, false)

    cubes.push(cube)
    scene.add(cube)

    var geo = new THREE.EdgesGeometry( cube.geometry ); // or WireframeGeometry
    var mat = new THREE.LineBasicMaterial( {
      // color: 0xffffff,
      color: 0x07ccc5,
      linewidth: 1,
      blending: THREE.AdditiveBlending, transparent: true } );
    var wireframe = new THREE.LineSegments( geo, mat );
   cube.add( wireframe );
 })

  this.cubes = cubes
  this.scene = scene
}


export function CreateLights(scene, helper) {

  let light = new THREE.AmbientLight( 0xffffff, 0.5 );
  // var light = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
  scene.add( light );

  let spotLight = new THREE.SpotLight( 0xffffff, 1.0 );
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

  let spotLight2 = new THREE.SpotLight( 0xffffff, 1.0 );
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

  if(helper) {
    let lightHelper = new THREE.SpotLightHelper( spotLight );
    scene.add( lightHelper );

    let lightHelper2 = new THREE.SpotLightHelper( spotLight2 );
    scene.add( lightHelper2 );

    let shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
    scene.add( shadowCameraHelper );
  }

  this.scene = scene
}




// var floorMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, dithering: true } );
// var floorGeometry = new THREE.BoxGeometry( 2000, 1, 2000 );
// var floor = new THREE.Mesh( floorGeometry, floorMaterial );
// floor.position.set( 0, -500, 0 );
// floor.receiveShadow = true;
// // scene.add( floor );
