import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { add_socket } from './hist-logic'

import './css/style.css'


function add_scene() {
    // create scene, camera, renderer, controls
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000)
    const renderer = new THREE.WebGLRenderer()
    const controls = new OrbitControls(camera, renderer.domElement);

    // set renderer shadow and tone
    renderer.shadowMap.enabled = true
    renderer.toneMapping = THREE.ReinhardToneMapping

    // set camera position
    camera.position.z = 5;

    // set size of renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // on window resize
    window.onresize = function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    return {
        scene: scene,
        camera: camera,
        renderer: renderer,
        controls: controls
    }
}

function add_lights(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
    // ambient lights
    const ambient_light = new THREE.AmbientLight(0xffffff); // soft white light
    ambient_light.name = "Ambient light"
    ambient_light.intensity = 2

    scene.add(ambient_light);

    // point light
    const point_light = new THREE.PointLight(0xbfd188, 1, 100);
    point_light.name = "Point light"
    point_light.position.set(0, 5, 0);
    point_light.intensity = 4;

    scene.add(point_light)
}

function add_animate(
    controls: OrbitControls,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer) {
    // animate function
    console.debug("animate runnning")
    function animate() {
        requestAnimationFrame(animate)
        controls.update();
        renderer.render(
            scene,
            camera
        )
    }
    requestAnimationFrame(animate)
}

function load_font():Promise<Font>{
    const loader = new FontLoader()
    return new Promise(function(res, rej){
        loader.load("/fonts/Cimatics_Trash.json", function(font){
            res(font)
        }),
        undefined,
        function(err:string){
            rej(err)
        }
    })
}

const { scene, camera, renderer, controls } = add_scene()
console.debug("miau", scene)
add_lights(scene, camera, renderer)

const box = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial()
)

scene.add(box)
document.body.appendChild(renderer.domElement)
add_animate(controls, scene, camera, renderer)
load_font().then((font)=>{
    add_socket(scene, font)
})
