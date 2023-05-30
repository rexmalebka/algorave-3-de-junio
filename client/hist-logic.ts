import { io, Socket } from 'socket.io-client'
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import type { Font } from 'three/examples/jsm/loaders/FontLoader'


export function add_socket(scene: THREE.Scene, font: Font) {
    const s = io("ws://127.0.0.1:3030")

    s.on('connect', function () {
        console.info("connected to hist server")
    })

    s.on('hist', function (data: { [name: string]: string }) {
        console.debug(data)

        let text = ""

        for (let author in data) {
            text += `${author}: ${data[author]}\n`
        }

        if (scene.getObjectByName('hist')) {
            scene.getObjectByName('hist')?.traverse((obj) => {
                if ((obj as THREE.Mesh).isMesh) {
                    (obj as THREE.Mesh).geometry.dispose();
                    scene.getObjectByName('hist')?.remove(obj)
                }
            })

            scene.remove(scene.getObjectByName('hist')!)
        }

        const hist_group = new THREE.Group()
        hist_group.name = 'hist'

        const geom = new TextGeometry(text , {
            font: font,
            size: 8,
            height: 1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.5,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 5
        });

        const text_mesh = new THREE.Mesh(
            geom,
            new THREE.MeshStandardMaterial({color: 0xff0000})
            )
        hist_group.add(text_mesh)

        scene.add(hist_group)
    })
}