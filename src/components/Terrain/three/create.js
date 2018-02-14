
import * as THREE from 'three'


export function createLights(scene) {
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
}

export class Cube {
  constructor(scene) {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({ color: '#433F81' })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    this.mesh = cube
  }
}
