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

function getTerrainPixelData() {
  var img = document.getElementById("heightmap");
  var canvas = document.getElementById("canvas");

  console.log("img",img)
  console.log("img.height",img.height)

  canvas.width = img.width;
  canvas.height = img.height;
  // canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
  //
  // var data = canvas.getContext('2d').getImageData(0,0, img.height, img.width).data;
  // var normPixels = []
  //
  // for (var i = 0, n = data.length; i < n; i += 4) {
  //   // get the average value of R, G and B.
  //   normPixels.push((data[i] + data[i+1] + data[i+2]) / 3);
  // }
  //
  // return normPixels;
}

function addGround() {
  var numSegments = 100;

  var geometry = new THREE.PlaneGeometry(2400, 2400, numSegments, numSegments);
  var material = new THREE.MeshLambertMaterial({
    color: 0xccccff,
    wireframe: false
  });

  // terrain = getTerrainPixelData();

  // keep in mind, that the plane has more vertices than segments. If there's one segment, there's two vertices, if
  // there's 10 segments, there's 11 vertices, and so forth.
  // The simplest is, if like here you have 100 segments, the image to have 101 pixels. You don't have to worry about
  // "skewing the landscape" then..

  // to check uncomment the next line, numbers should be equal
  // console.log("length: " + terrain.length + ", vertices length: " + geometry.vertices.length);
  //
  // for (var i = 0, l = geometry.vertices.length; i < l; i++) {
  //   var terrainValue = terrain[i] / 255;
  //   geometry.vertices[i].z = geometry.vertices[i].z + terrainValue * 200 ;
  // }
  //
  // geometry.computeFaceNormals();
  // geometry.computeVertexNormals();
  //
  // var plane = new THREE.Mesh(geometry, material);
  //
  // plane.position = new THREE.Vector3(0,0,0);
  // // rotate the plane so up is where y is growing..
  //
  // var q = new THREE.Quaternion();
  // q.setFromAxisAngle( new THREE.Vector3(-1,0,0), 90 * Math.PI / 180 );
  // plane.quaternion.multiplyQuaternions( q, plane.quaternion );
  //
  // scene.add(plane)
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


  addGround()


  //
  // var texture = THREE.ImageUtils.loadTexture(heightmap, null);
  //
  // var geometryTerrain = new THREE.PlaneGeometry(2000, 4000, 256, 256);
  //
  // geometryTerrain.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
  // geometryTerrain.computeFaceNormals();
  // geometryTerrain.computeVertexNormals();
  // geometryTerrain.computeTangents();
  //
  //
  // var material = new THREE.ShaderMaterial({
  //   // uniforms:uniformsTerrain,
  //   // vertexShader:terrainShader.vertexShader,
  //   // fragmentShader:terrainShader.fragmentShader,
  //   lights:true,
  //   fog:false
  // });
  //
  // // create a 3D object to add
  // var terrain = new THREE.Mesh(geometryTerrain, material);
  // terrain.position.set(0, -125, 0);
  // terrain.rotation.x = -Math.PI / 2;
  //
  // // add the terrain
  // scene.add(terrain);

  // console.log("texture",texture)


  // createHeightMap(heightmap,element)

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
