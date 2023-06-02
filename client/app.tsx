import * as React from 'react'
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { io, Socket } from 'socket.io-client'

import { Font } from 'three/examples/jsm/loaders/FontLoader'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import * as TWEEN from "@tweenjs/tween.js"

import WS from './ws'
import Hist from './history-text';
import Models from './models';
//import HydraCode from './hydra-code';

declare global {
    interface Window { scene: THREE.Scene; renderer: THREE.WebGLRenderer }
}

const App: React.FC = () => {
    const three_container = React.useRef() as React.MutableRefObject<HTMLDivElement>;

    const [scene, set_scene] = React.useState<THREE.Scene>()
    const [camera, set_camera] = React.useState<THREE.PerspectiveCamera>()
    const [renderer, set_renderer] = React.useState<THREE.WebGLRenderer>()
    const [controls, set_controls] = React.useState<OrbitControls>()
    const [loader, set_loader] = React.useState<GLTFLoader>()

    const [socket, set_socket] = React.useState<Socket>();

    const [font, set_font] = React.useState<Font>()
    const [hist, set_hist] = React.useState<{ [name: string]: string }>()

    const [analyser, set_analyser] = React.useState<AnalyserNode>()
    const [audio_data, set_audio_data] = React.useState<Uint8Array>()

    const ss_ref = React.useRef() as React.MutableRefObject<HTMLVideoElement>

    const load_animate = React.useCallback((
        scene: THREE.Scene,
        renderer: THREE.WebGLRenderer,
        camera: THREE.PerspectiveCamera,
        controls: OrbitControls,
        analyser: AnalyserNode,
        set_audio_data: React.Dispatch<React.SetStateAction<Uint8Array | undefined>>,
        background_texture: THREE.FramebufferTexture

    ) => {

        function animate() {
            requestAnimationFrame(animate);

            // update controls
            controls.update();

            // render scene
            renderer.render(scene, camera);

            // update tween movements
            TWEEN.update()

            // calculate audio array
            set_audio_data((arr) => {
                if (!arr) return arr
                analyser.getByteFrequencyData(arr)
                analyser.smoothingTimeConstant = 0.5;
                return arr
            })



            renderer.copyFramebufferToTexture(new THREE.Vector2(), background_texture)


        }

        return requestAnimationFrame(animate)

    }, [scene, renderer, camera, controls, AnalyserNode, set_audio_data])

    const add_lights = React.useCallback((scene: THREE.Scene) => {

        // ambient lights
        const ambient_light = new THREE.AmbientLight(0xffffff); // soft white light
        ambient_light.name = "Ambient light"
        ambient_light.intensity = 1

        scene.add(ambient_light);

        // point light
        const point_light = new THREE.PointLight(0xbfd188, 1, 100);
        point_light.name = "Point light"
        point_light.position.set(0, 50, 0);
        point_light.intensity = 1;

        scene.add(point_light)
    }, [scene])

    const load_font = React.useCallback(() => {
        const loader = new FontLoader()
        //loader.load("/fonts/Monomaniac One_Regular.json", function (font) {
        loader.load("/fonts/yunga.json", function (font) {
            console.info("font loaded")
            set_font(() => font)
        },
            undefined,
            function (err: ErrorEvent) {
                console.info("error loading font")
            }
        )
    }, [set_font])

    const change_scene_background = React.useCallback(async (scene: THREE.Scene, background_texture: THREE.FramebufferTexture) => {

        /*
        scene.background = new THREE.CubeTexture([
            background_texture,
            background_texture,
            background_texture,
            background_texture
        ]) 

        

*/
        return background_texture
    }, [scene])

    React.useEffect(() => {

        if (!three_container) return

        // three js container has already being loaded 
        // videos are also loaded



        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000)
        const renderer = new THREE.WebGLRenderer({ alpha: true })
        const controls = new OrbitControls(camera, renderer.domElement);

        // set renderer shadow and tone
        renderer.shadowMap.enabled = true
        renderer.toneMapping = THREE.ReinhardToneMapping
        renderer.toneMappingExposure = 0.5
        renderer.outputColorSpace = THREE.SRGBColorSpace; // optional with post-processing


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

        three_container.current.appendChild(renderer.domElement)

        set_scene(() => scene)
        set_camera(() => camera)
        set_controls(() => controls)
        set_renderer(() => renderer)

        console.info("scene loaded")

        window.scene = scene
        window.renderer = renderer

        // gltf loader with draco compression

        const loader = new GLTFLoader()
        const dracoLoader = new DRACOLoader();

        dracoLoader.setDecoderPath('/js/');
        loader.setDRACOLoader(dracoLoader);

        set_loader(() => loader)

        // socket creation

        const s = io("ws://127.0.0.1:3030")

        s.on('connect', function () {
            set_socket(() => s)
        })

        // audio analyser
        const context = new AudioContext()
        const an = context.createAnalyser()
        an.fftSize = 32

        const bufferLength = an.frequencyBinCount;
        const darr = new Uint8Array(bufferLength);

        // request for microphone to set analyser stuff
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then((stream: MediaStream) => {
                const source = context.createMediaStreamSource(stream);
                source.connect(an)
                context.resume()

                set_analyser(() => an)
                set_audio_data(() => darr)

            });

    }, [three_container])



    React.useEffect(() => {

        if (
            !scene ||
            !renderer ||
            !camera ||
            !controls ||
            !analyser ||
            !set_audio_data
        ) return

        add_lights(scene)
        load_font()

        const background_texture = new THREE.FramebufferTexture(
            window.innerWidth,
            window.innerHeight,
            THREE.RGBAFormat
        )

        background_texture.minFilter = THREE.LinearFilter;
        //change_scene_background(scene, background_texture)

        load_animate(
            scene,
            renderer,
            camera,
            controls,
            analyser,
            set_audio_data,
            background_texture
        )

    }, [scene, renderer, camera, controls, analyser, set_audio_data])

    React.useEffect(() => {
        if (!scene || !ss_ref) return

        const displayMediaOptions = {
            video: {
                cursor: "always",
                height: 1000,
                width: 1200
            },
            audio: false
        };

        navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
            .then((media) => {
                console.debug("mediaaa", media)
                ss_ref.current.srcObject = media

                scene.background = new THREE.VideoTexture(ss_ref.current)

                const scene_background_movements = new TWEEN.Tween(scene.background.offset)
                    .to({ x: 1.2, y: 1.2 }, 10000)
                    .repeat(Infinity)

                scene_background_movements.start()

                const scene_background_rotation = new TWEEN.Tween(scene.background)
                    .to({ rotation: Math.PI / 2 }, 10000)
                    .repeat(Infinity)

                scene_background_rotation.start()
            })
        /*
        video.srcObject = await

        const txt = new THREE.VideoTexture(video)
        scene.background = txt*/
    }, [scene, ss_ref])

    return (
        <>

            <video muted autoPlay loop ref={ss_ref}></video>
            <Models
                scene={scene}
                loader={loader}
                set_audio_data={set_audio_data}
            ></Models>
            <Hist
                scene={scene}
                font={font}
                hist={hist}
                set_audio_data={set_audio_data}
            />
            <WS
                socket={socket}
                scene={scene}
                set_hist={set_hist} />
            <div ref={three_container}></div>


        </>
    )
}

export default App