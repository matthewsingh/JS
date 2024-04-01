//console.log(THREE);

//import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
//import { OrbitControls } from './scripts/OrbitControls.js';
//import Stats from "./scripts/stats.js"
//import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js'
import { GUI } from './node_modules/dat.gui/build/dat.gui.module.js';

//var stats = new Stats();
//stats.showPanel(1);
//document.body.appendChild(stats.dom);

/////////////////////////


let scene, camera, renderer, controls, skybox;
let sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune;
let planet_sun_label;


let mercury_orbit_radius = 50
let venus_orbit_radius = 60
let earth_orbit_radius = 70
let mars_orbit_radius = 80
let jupiter_orbit_radius = 100
let saturn_orbit_radius = 120
let uranus_orbit_radius = 140
let neptune_orbit_radius = 160

const speed = {
mercury_revolution_speed : 2,
venus_revolution_speed : 1.5,
earth_revolution_speed : 1,
mars_revolution_speed : 0.8,
jupiter_revolution_speed : 0.7,
saturn_revolution_speed : 0.6,
uranus_revolution_speed : 0.5,
neptune_revolution_speed : 0.4,
}


/*let mercury_revolution_speed = 2
let venus_revolution_speed = 1.5
let earth_revolution_speed = 1
let mars_revolution_speed = 0.8
let jupiter_revolution_speed = 0.7
let saturn_revolution_speed = 0.6
let uranus_revolution_speed = 0.5
let neptune_revolution_speed = 0.4*/

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onClick() {

  Event.preventDefault();

  mouse.x = (Event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(Event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObject(scene, true);

  if (intersects.length > 0) {
	
		var object = intersects[0].object;

    object.material.color.set( Math.random() * 0xffffff );
    console.log("hello");

  }
  update();

}
function createMaterialArray() {
  const skyboxImagepaths = ['../img/skybox/space_ft.png', '../img/skybox/space_bk.png', '../img/skybox/space_up.png', '../img/skybox/space_dn.png', '../img/skybox/space_rt.png', '../img/skybox/space_lf.png']
  const materialArray = skyboxImagepaths.map((image) => {
    let texture = new THREE.TextureLoader().load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  });
  return materialArray;
}

function setSkyBox() {
  const materialArray = createMaterialArray();
  let skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
  skybox = new THREE.Mesh(skyboxGeo, materialArray);
  scene.add(skybox);
}

function loadPlanetTexture(texture, radius, widthSegments, heightSegments, meshType) {
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const loader = new THREE.TextureLoader();
  const planetTexture = loader.load(texture);
  const material = meshType == 'standard' ? new THREE.MeshStandardMaterial({ map: planetTexture }) : new THREE.MeshBasicMaterial({ map: planetTexture });

  const planet = new THREE.Mesh(geometry, material);

  return planet
}




function createOrbitRing(innerRadius) {
  let outerRadius = innerRadius - 0.1
  let thetaSegments = 100
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
  const material = new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh)
  mesh.rotation.x = Math.PI / 2
  return mesh;

}


function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  setSkyBox();
  earth = loadPlanetTexture("../img/earth_hd.jpg", 4, 100, 100, 'standard');
  sun = loadPlanetTexture("../img/sun_hd.jpg", 20, 100, 100, 'basic');
  mercury = loadPlanetTexture("../img/mercury_hd.jpg", 2, 100, 100, 'standard');
  venus = loadPlanetTexture("../img/venus_hd.jpg", 3, 100, 100, 'standard');
  mars = loadPlanetTexture("../img/mars_hd.jpg", 3.5, 100, 100, 'standard');
  jupiter = loadPlanetTexture("../img/jupiter_hd.jpg", 10, 100, 100, 'standard');
  saturn = loadPlanetTexture("../img/saturn_hd.jpg", 8, 100, 100, 'standard');
  uranus = loadPlanetTexture("../img/uranus_hd.jpg", 6, 100, 100, 'standard');
  neptune = loadPlanetTexture("../img/neptune_hd.jpg", 5, 100, 100, 'standard');

  // planet_earth_label = new THREE.TextGeometry( text, parameters );
  // planet_mercury_label = loadPlanetTexture("../img/mercury_hd.jpg", 2, 100, 100);
  // planet_venus_label = loadPlanetTexture("../img/venus_hd.jpg", 3, 100, 100);
  // planet_mars_label = loadPlanetTexture("../img/mars_hd.jpg", 3.5, 100, 100);
  // planet_jupiter_label = loadPlanetTexture("../img/jupiter_hd.jpg", 10, 100, 100);
  // planet_saturn_label = loadPlanetTexture("../img/saturn_hd.jpg", 8, 100, 100);
  // planet_uranus_label = loadPlanetTexture("../img/uranus_hd.jpg", 6, 100, 100);
  // planet_neptune_label = loadPlanetTexture("../img/neptune_hd.jpg", 5, 100, 100);

  // ADD PLANETS TO THE SCENE
  scene.add(earth);
  scene.add(sun);
  scene.add(mercury);
  scene.add(venus);
  scene.add(mars);
  scene.add(jupiter);
  scene.add(saturn);
  scene.add(uranus);
  scene.add(neptune);

  const sunLight = new THREE.PointLight(0xffffff, 2, 0); // White light, intensity 1, no distance attenuation
  sunLight.position.copy(sun.position); // Position the light at the Sun's position
  scene.add(sunLight);

  // Rotation orbit
  createOrbitRing(mercury_orbit_radius)
  createOrbitRing(venus_orbit_radius)
  createOrbitRing(earth_orbit_radius)
  createOrbitRing(mars_orbit_radius)
  createOrbitRing(jupiter_orbit_radius)
  createOrbitRing(saturn_orbit_radius)
  createOrbitRing(uranus_orbit_radius)
  createOrbitRing(neptune_orbit_radius)




  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.id = "c";
  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 12;
  controls.maxDistance = 1000;

  camera.position.z = 100;
}


function planetRevolver(time, speed, planet, orbitRadius, planetName) {

  let orbitSpeedMultiplier = 0.001;
  const planetAngle = time * orbitSpeedMultiplier * speed;
  planet.position.x = sun.position.x + orbitRadius * Math.cos(planetAngle);
  planet.position.z = sun.position.z + orbitRadius * Math.sin(planetAngle);
}




function animate(time) {
  requestAnimationFrame(animate);

  // Rotate the planets
  const rotationSpeed = 0.005;
  earth.rotation.y += rotationSpeed;
  sun.rotation.y += rotationSpeed;
  mercury.rotation.y += rotationSpeed;
  venus.rotation.y += rotationSpeed;      
  mars.rotation.y += rotationSpeed;
  jupiter.rotation.y += rotationSpeed;
  saturn.rotation.y += rotationSpeed;
  uranus.rotation.y += rotationSpeed;
  neptune.rotation.y += rotationSpeed;

  // Revolve planets around the sun
  // const orbitSpeedMultiplier = 0.001;
  // Earth
  // const earthOrbitAngle = time * orbitSpeedMultiplier;
  // planet_earth.position.x = planet_sun.position.x + earth_orbit_radius * Math.cos(earthOrbitAngle);
  // planet_earth.position.z = planet_sun.position.z + earth_orbit_radius * Math.sin(earthOrbitAngle);
  planetRevolver(time, speed.mercury_revolution_speed, mercury, mercury_orbit_radius, 'mercury')
  planetRevolver(time, speed.venus_revolution_speed, venus, venus_orbit_radius, 'venus')
  planetRevolver(time, speed.earth_revolution_speed, earth, earth_orbit_radius, 'earth')
  planetRevolver(time, speed.mars_revolution_speed, mars, mars_orbit_radius, 'mars')
  planetRevolver(time, speed.jupiter_revolution_speed, jupiter, jupiter_orbit_radius, 'jupiter')
  planetRevolver(time, speed.saturn_revolution_speed, saturn, saturn_orbit_radius, 'saturn')
  planetRevolver(time, speed.uranus_revolution_speed, uranus, uranus_orbit_radius, 'uranus')
  planetRevolver(time, speed.neptune_revolution_speed, neptune, neptune_orbit_radius, 'neptune')

  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

//add gui as controls
const gui = new GUI({autoplace: false, width: 350});

gui.domElement.id = 'gui';
gui_container.appendChild(gui.domElement);

const guiFolder = gui.addFolder('revolution speed') 
guiFolder.add(speed, 'mercury_revolution_speed', 0, 5).listen();
guiFolder.add(speed, 'venus_revolution_speed', 0, 5).listen();
guiFolder.add(speed, 'earth_revolution_speed', 0, 5).listen();
guiFolder.add(speed, 'mars_revolution_speed', 0, 5).listen();
guiFolder.add(speed, 'jupiter_revolution_speed', 0, 5).listen();
guiFolder.add(speed, 'saturn_revolution_speed', 0, 5).listen();
guiFolder.add(speed, 'uranus_revolution_speed', 0, 5).listen();
guiFolder.add(speed, 'neptune_revolution_speed', 0, 5).listen();

//function to add a button that will set all the planet revolution speed back to default
var obj = { 'Set Speed To Default':function(){ 
  speed.mercury_revolution_speed = 2;
  setInterval(() => speed.mercury_revolution_speed, 2);
  
  speed.venus_revolution_speed = 1.5;
  setInterval(() => speed.venus_revolution_speed, 1.5);
  
  speed.earth_revolution_speed = 1;
  setInterval(() => speed.earth_revolution_speed, 1);

  speed.mars_revolution_speed = 0.8;
  setInterval(() => speed.mars_revolution_speed, 0.8);

  speed.jupiter_revolution_speed = 0.7;
  setInterval(() => speed.jupiter_revolution_speed, 0.7);

  speed.saturn_revolution_speed = 0.6;
  setInterval(() => speed.saturn_revolution_speed, 0.6);

  speed.uranus_revolution_speed = 0.5;
  setInterval(() => speed.uranus_revolution_speed, 0.5);

  speed.neptune_revolution_speed = 0.4;
  setInterval(() => speed.neptune_revolution_speed, 0.4);
 }};

guiFolder.add(obj,'Set Speed To Default');
guiFolder.open();


const cameraFolder = gui.addFolder("camera");
//guiFolder.open();

init();
animate(0); // Initialize with time 0