import * as React from 'react'
//import { Hydra } from 'hydra-ts'
import * as THREE from 'three';
import type { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import * as TWEEN from "@tweenjs/tween.js"


interface Models_args {
    scene: THREE.Scene | undefined
    loader: GLTFLoader | undefined
    set_audio_data: React.Dispatch<React.SetStateAction<Uint8Array | undefined>>
}

const Models: React.FC<Models_args> = ({ scene, loader, set_audio_data }) => {
    const ref_oaxaca1 = React.useRef() as React.MutableRefObject<HTMLVideoElement>;
    const ref_oaxaca2 = React.useRef() as React.MutableRefObject<HTMLVideoElement>;
    const ref_oaxaca3 = React.useRef() as React.MutableRefObject<HTMLVideoElement>;

    const waste_distort = React.useCallback((mesh: THREE.Group, set_audio_data: React.Dispatch<React.SetStateAction<Uint8Array | undefined>>) => {
        function animate() {
            requestAnimationFrame(animate)

            set_audio_data((arr) => {
                if (!arr) return
                mesh.scale.y = 50 + (arr[0] * 50 / 255)

                mesh.rotation.x = arr[1] / 255
                mesh.rotation.y = arr[2] / 255
                return arr
            })
        }
        requestAnimationFrame(animate)
    }, [scene, set_audio_data])

    const load_waste = React.useCallback((loader: GLTFLoader, scene: THREE.Scene) => {
        // load waste
        loader.load('models/ewaste.glb', function (glb) {
            glb.scene.scale.setScalar(50)
            glb.scene.name = "ewaste"
            scene.add(glb.scene)

            let waste_movements = new TWEEN.Tween(glb.scene.rotation)
                .to({ y: Math.PI * 2 }, 20000)
                .repeat(Infinity)

            waste_movements.start()

            waste_distort(glb.scene, set_audio_data)

        })
    }, [scene, loader, set_audio_data])

    const oaxaca_distort = React.useCallback((oaxaca_mesh: THREE.Mesh) => {

        let oaxaca_movements = new TWEEN.Tween(oaxaca_mesh.rotation)
            .to({ y: Math.PI * 2 * (Math.random() >= 0.5 ? -1 : 1) }, 10000)
            .repeat(Infinity)

        oaxaca_movements.start()
        /*
                setInterval(function () {
                    const geom = [
                        new THREE.SphereGeometry(
                            oaxaca_mesh.userData.size,
                            200, 200),
                        new THREE.BoxGeometry(
                            oaxaca_mesh.userData.size,
                            oaxaca_mesh.userData.size,
                            oaxaca_mesh.userData.size,
                            200, 200),
                        new THREE.TorusKnotGeometry(
                            oaxaca_mesh.userData.size,
                            1, 200, 200, 2+Math.random()*8, 2+Math.random()*6),
        
                    ]
                    oaxaca_mesh.geometry.dispose()
                    oaxaca_mesh.geometry = geom[Math.floor( Math.random() * geom.length)]
        
                }, 2000)*/

    }, [scene, loader, set_audio_data])

    React.useEffect(() => {
        if (!scene || !loader) return

        // load gltf models
        //load_waste(loader, scene)

    }, [scene, loader])

    React.useEffect(() => {
        if (!scene || !ref_oaxaca1 || !ref_oaxaca2 || !ref_oaxaca3) return

        // create textures
        const oaxaca1_texture = new THREE.VideoTexture(ref_oaxaca1.current)
        const oaxaca2_texture = new THREE.VideoTexture(ref_oaxaca2.current)
        const oaxaca3_texture = new THREE.VideoTexture(ref_oaxaca3.current)

        // create mesh

        const oaxaca1 = new THREE.Mesh(
            new THREE.SphereGeometry(100, 1, 100, 100, 3, 6),
            new THREE.MeshStandardMaterial({
                map: oaxaca1_texture,
                displacementMap: oaxaca1_texture,
                displacementScale: 100,
                side: THREE.DoubleSide,
                transparent: true
            })
        )

        const oaxaca2 = new THREE.Mesh(
            new THREE.SphereGeometry(150, 1, 100, 100, 1, 6),
            new THREE.MeshStandardMaterial({
                map: oaxaca2_texture,
                displacementMap: oaxaca2_texture,
                displacementScale: 100,
                side: THREE.DoubleSide,
                transparent: true

            })
        )

        const oaxaca3 = new THREE.Mesh(
            new THREE.SphereGeometry(200, 1, 100, 100, 2, 6),
            new THREE.MeshStandardMaterial({
                map: oaxaca3_texture,
                displacementMap: oaxaca3_texture,
                displacementScale: 100,
                side: THREE.DoubleSide,
                transparent: true
            })
        )

        oaxaca1.name = "oaxaca1"
        oaxaca2.name = "oaxaca2"
        oaxaca3.name = "oaxaca3"

        oaxaca1.userData.size = 100 - 50
        oaxaca2.userData.size = 150 - 50
        oaxaca3.userData.size = 200 - 50

        // change rotation a bit

        oaxaca1.rotation.set(
            Math.random() * 2,
            Math.random() * 2,
            Math.random() * 2
        )

        oaxaca2.rotation.set(
            1 + Math.random() * 2,
            1 + Math.random() * 2,
            1 + Math.random() * 2
        )

        oaxaca3.rotation.set(
            -1 + Math.random() * 2,
            -1 + Math.random() * 2,
            -1 + Math.random() * 2
        )


        oaxaca1.material.opacity = 0.25
        oaxaca2.material.opacity = 0.25
        oaxaca3.material.opacity = 0.25
        scene.add(oaxaca1, oaxaca2, oaxaca3)

        /*

        // oaxaca distortions
        oaxaca_distort(oaxaca1)
        oaxaca_distort(oaxaca2)
        oaxaca_distort(oaxaca3)
*/

    }, [scene, ref_oaxaca1, ref_oaxaca2, ref_oaxaca3])

    return (
        <>
            <video ref={ref_oaxaca1} src="video/oaxaca1.mp4" autoPlay muted loop id="oaxaca1"></video>
            <video ref={ref_oaxaca2} src="video/oaxaca2.mp4" autoPlay muted loop id="oaxaca2"></video>
            <video ref={ref_oaxaca3} src="video/oaxaca3.mp4" autoPlay muted loop id="oaxaca3"></video>
        </>
    )
}

export default Models