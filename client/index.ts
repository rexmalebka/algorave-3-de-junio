/*import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import type { Font } from 'three/examples/jsm/loaders/FontLoader'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

import { add_socket } from './hist-logic'
import { add_video_textures } from './video-textures';
import './css/style.css'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';


import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {add_audio} from './audio_analysis'

//import Hydra from 'hydra-synth'


function add_scene() {
    // create scene, camera, renderer, controls
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000)
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    const controls = new OrbitControls(camera, renderer.domElement);

    console.debug("renderer", renderer)
    console.debug("scene", scene)

    // set renderer shadow and tone
    renderer.shadowMap.enabled = true
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 2

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

function add_feedback(scene: THREE.Scene, texture: THREE.Texture) {
    /*
        document.addEventListener("hydra-ready", function (event: CustomEvent<HTMLCanvasElement>) {
    
            console.debug("hydra ready")
            const fback_texture = new THREE.CanvasTexture(event.detail)
            fback_texture.wrapS = THREE.MirroredRepeatWrapping
            fback_texture.wrapT = THREE.MirroredRepeatWrapping
            fback_texture.repeat.x = 2
            fback_texture.repeat.y = 2
    
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(500, 500, 500, 100, 100, 100),
                new THREE.MeshStandardMaterial({
                    map: fback_texture,
                    displacementScale: 4,
                    side: THREE.DoubleSide,
                })
            )
            mesh.name = "feedback"
            scene.add(mesh)
            scene.background = fback_texture
        } as EventListener)
    

    document.addEventListener("fboffset", function (ev: CustomEvent<number[]>) {
        texture.offset.x = ev.detail[0]
        texture.offset.y = ev.detail[1]
    } as EventListener)

    document.addEventListener("fbrotation", function (ev: CustomEvent<number>) {
        texture.rotation = ev.detail
    } as EventListener)

    scene.background = texture

}

function add_animate(
    controls: OrbitControls,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    texture: THREE.Texture,
    composer: EffectComposer
) {

    // animate function
    function animate() {
        requestAnimationFrame(animate)
        controls.update();
        /*
                renderer.render(
                    scene,
                    camera
                )
        

        composer.render()
        renderer.copyFramebufferToTexture(new THREE.Vector2(), texture)
    }
    requestAnimationFrame(animate)
}

function load_font(): Promise<Font> {

    return new Promise(function (res, rej) {
        const loader = new FontLoader()
        loader.load("/fonts/Monomaniac One_Regular.json", function (font) {
            console.info("font loaded")
            res(font as Font)
        }),
            undefined,
            function (err: string) {
                console.info("error loading font")
                rej(err)
            }
    })
}

function add_postprocessing(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera
) {
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.05, 0.4, 0.2
    );

    document.addEventListener("bloom", function (ev: CustomEvent<number>) {
        bloomPass.strength = ev.detail
    } as EventListener)

    //composer.addPass(bloomPass);

    return composer

}

function add_waste(scene: THREE.Scene) {
    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath('/js/');
    loader.setDRACOLoader(dracoLoader);

    loader.load('models/ewaste.glb', function (glb) {
        glb.scene.scale.setScalar(50)
        glb.scene.name = "ewaste"
        scene.add(glb.scene)

        setInterval(function () {
            glb.scene.rotation.y += 0.02

        }, 100)
    })
}


/// run everything



const { scene, camera, renderer, controls } = add_scene()

const composer = add_postprocessing(renderer, scene, camera)

add_lights(scene, camera, renderer)
add_waste(scene)

renderer.domElement.id = "three"

add_audio(scene)

document.body.appendChild(renderer.domElement)

const texture = new THREE.FramebufferTexture(
    window.innerWidth,
    window.innerHeight,
    THREE.RGBAFormat
)

add_animate(controls, scene, camera, renderer, texture, composer)

add_video_textures(scene,)
add_feedback(scene, texture)

load_font().then((font) => {
    add_socket(camera, scene, font, texture)
})
const event = new Event("three-ready", { bubbles: true })
document.body.dispatchEvent(event)
*/
