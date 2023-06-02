import * as React from 'react'

import * as THREE from 'three';
import type { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import type { Font } from 'three/examples/jsm/loaders/FontLoader.js'
import * as TWEEN from "@tweenjs/tween.js"


interface History_args {
    scene: THREE.Scene | undefined
    font: Font | undefined
    hist: { [name: string]: string } | undefined
    set_audio_data: React.Dispatch<React.SetStateAction<Uint8Array | undefined>>
}

const Hist: React.FC<History_args> = ({ scene, font, hist, set_audio_data }) => {

    const mesh_distortions = React.useCallback((mesh: THREE.Mesh, set_audio_data: React.Dispatch<React.SetStateAction<Uint8Array | undefined>>) => {

        let b = 0
        mesh.userData.animate_id = 0//requestAnimationFrame(animate)
    }, [scene])

    React.useEffect(() => {
        if (!hist || !scene || !font || scene.background == null) return

        console.debug("HIIST", hist)

        for (let author in hist) {
            if (scene.getObjectByName(`hist-${author}`)) {
                // check if text is the same, dont recreate it again

                const mesh = scene.getObjectByName(`hist-${author}`) as THREE.Mesh
                if (mesh?.userData.text == hist[author]) {
                    continue
                } else {
                    clearInterval(mesh.userData.animate_id)
                    mesh.geometry.dispose()
                    scene.remove(mesh)
                }
            }

            const geom = new TextGeometry(hist[author], {
                font: font,
                size: 40,
                height: 2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.05,
                bevelOffset: 0,
                bevelSegments: 2
            });


            const text_mesh = new THREE.Mesh(
                geom,
                new THREE.MeshStandardMaterial({
                    
                })
            )
            console.debug(text_mesh,'asdfsdf')

            text_mesh.name = `hist-${author}`
            text_mesh.userData.text = hist[author]

            mesh_distortions(text_mesh, set_audio_data)


            const bbox = new THREE.Box3().setFromObject(text_mesh);

            const dx = bbox.max.x - bbox.min.x
            const dy = bbox.max.y - bbox.min.y

            text_mesh.position.x = -dx / 2
            text_mesh.position.y = dy / 2

            text_mesh.rotation.y = Math.random() / 2
            scene.add(text_mesh)

        }
    }, [hist, scene, font])


    return null
}

export default Hist