import * as THREE from 'three'
export let halfRowLength = 10

const numberOfCubes = (halfRowLength * 2) * (halfRowLength * 2)
let halfwayIndex = (numberOfCubes / 2) - 1

console.log("numberOfCubes",numberOfCubes)

export function CreateCubes(cubes, scene) {

  const cubesDefinitions = new Array(numberOfCubes).fill({}).map((item, i) => {
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

  cubesDefinitions.forEach( (item, i) => {
    const cubeGeometry = new THREE.BoxGeometry(item.size.x, item.size.y, item.size.z)
    // const cubeMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, dithering: true } )
    const cubeMaterial = new THREE.MeshStandardMaterial( {
      // color: item.index%10 === 0? 0xffffff : 0xff3855,
      // wireframe: true,
      // wireframe_linewidth: 2,
      // color: 0xb20059,
      color: 0x07ccc5,
      // color: 0xffffff,
      dithering: true } )
    const cube = new THREE.Mesh( cubeGeometry, cubeMaterial )
    cube.position.set( item.position.x, item.position.y + (item.size.y * item.index), item.position.z)
    cube.userData = {direction: item.direction, team: item.team, index: item.index, size: item.size}
    // cube.castShadow = true;
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


    // var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.5 } ) );
    // scene.add( line );

    // var material = new THREE.MeshPhongMaterial( {
    // color: 0xff0000,
    // polygonOffset: true,
    // polygonOffsetFactor: 1, // positive value pushes polygon further away
    // polygonOffsetUnits: 1
    // } );
    // var mesh = new THREE.Mesh( geometry, material );
    // scene.add( mesh )

    // wireframe
    // var geo = new THREE.EdgesGeometry( mesh.geometry ); // or WireframeGeometry
    // var mat = new THREE.LineBasicMaterial( {
    //   // color: 0xffffff,
    //   color: 0x07ccc5,
    //   linewidth: 1 } );
    // var wireframe = new THREE.LineSegments( geo, mat );
    // mesh.add( wireframe );
  })

  // const geometry = new THREE.BoxGeometry(20, 30, 30)
  // const material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true, wireframe_linewidth: 2 } );
  // const cube = new THREE.Mesh( geometry, material )
  // cube.position.set(0,0,0)
  // scene.add(cube)

  // const cubeGeometry2 = new THREE.BoxGeometry(1, 1, 3)
  // const cubeMaterial2 = new THREE.MeshStandardMaterial( {color: 0x1d15f2,dithering: true } )
  // const cube2 = new THREE.Mesh( cubeGeometry2, cubeMaterial2 )
  // cube2.position.set(0,0,5)
  // scene.add(cube2)

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
