import * as THREE from 'three'
import ImprovedNoise from './ImprovedNoise'


export function generateTexture( data, width, height ) {
  var canvas, canvasScaled, context, image, imageData, level, diff, vector3, sun, shade;

  vector3 = new THREE.Vector3( 0, 0, 0 );
  sun = new THREE.Vector3( 1, 1, 1 );
  sun.normalize();
  canvas = document.createElement( 'canvas' );
  canvas.width = width;
  canvas.height = height;
  context = canvas.getContext( '2d' );
  context.fillStyle = '#000';
  context.fillRect( 0, 0, width, height );
  image = context.getImageData( 0, 0, canvas.width, canvas.height );
  imageData = image.data;

  for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {
    vector3.x = data[ j - 2 ] - data[ j + 2 ];
    vector3.y = 2;
    vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
    vector3.normalize();
    shade = vector3.dot( sun );
    imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
    imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
    imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
  }

  context.putImageData( image, 0, 0 );
  // Scaled 4x
  canvasScaled = document.createElement( 'canvas' );
  canvasScaled.width = width * 4;
  canvasScaled.height = height * 4;
  context = canvasScaled.getContext( '2d' );
  context.scale( 4, 4 );
  context.drawImage( canvas, 0, 0 );
  image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
  imageData = image.data;
  for ( var i = 0, l = imageData.length; i < l; i += 4 ) {
    var v = ~~ ( Math.random() * 5 );
    imageData[ i ] += v;
    imageData[ i + 1 ] += v;
    imageData[ i + 2 ] += v;
  }
  context.putImageData( image, 0, 0 );
  return canvasScaled;
}


export function generateHeight( width, height ) {
  var size = width * height, data = new Uint8Array( size ),
  perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;
  for ( var j = 0; j < 4; j ++ ) {
    for ( var i = 0; i < size; i ++ ) {
      var x = i % width, y = ~~ ( i / width );
      data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
    }
    quality *= 5;
  }
  return data;
}

export class CreateLights {
  constructor(scene) {
  const light = new THREE.AmbientLight( 0xffffff, 0.2 );
  // var light = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
  scene.add( light );

  const followLight = new THREE.SpotLight( 0xffffff, 2.0 );
  followLight.position.set( 0, 3000, 2000 );
  followLight.angle = 0.25;
  followLight.penumbra = 0.95;
  followLight.distance = 5085;
  followLight.decay = 0;

  const spotLight = new THREE.SpotLight( 0xffffff, 0.4 );
  spotLight.position.set( 0, 5000, 1000 );
  spotLight.angle = 0.95;
  spotLight.penumbra = 0.95;
  spotLight.distance = 5085;


  // spotLight.castShadow = true;
  // spotLight.shadow.darkness = 0.9;
  // spotLight.shadow.mapSize.width = 1024;
  // spotLight.shadow.mapSize.height = 1024;
  //
  // spotLight.shadow.camera.near = 0.1;
  // spotLight.shadow.camera.far = 6000;
  // spotLight.shadow.camera.fov = 30;
  spotLight.decay = 0;

  scene.add( spotLight );
  scene.add( followLight );
  scene.add( followLight.target );

  var spotLightHelper = new THREE.SpotLightHelper( spotLight );
  scene.add( spotLightHelper );

  var followLightHelper = new THREE.SpotLightHelper( followLight );
  scene.add( followLightHelper );
  // scene.add( followLightHelper.target );

  this.light = followLight
  this.lightHelper = followLightHelper
  }
}

export class Cube {
  constructor(scene) {
    const geometry = new THREE.BoxGeometry(800,400,200)
    const material = new THREE.MeshPhongMaterial({color:'#ce08a3' })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(0, 2000, 0)
    // cube.castShadow = true;
    scene.add(cube)
    this.mesh = cube
  }
}
