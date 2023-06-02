import * as React from 'react'
//import { Hydra } from 'hydra-ts'
import * as THREE from 'three';
import { io, Socket } from 'socket.io-client'

interface ws_args{
    socket: Socket| undefined
    scene: THREE.Scene | undefined
    set_hist: React.Dispatch<React.SetStateAction<{ [name: string]: string; } | undefined>>
}

const ws: React.FC<ws_args> = ({socket, scene, set_hist}) => {
   

    React.useEffect(()=>{
        if(!socket || !scene) return

        socket.on('hist',function(data:{[name:string]: string}){
            set_hist(()=> data)
        })
    },[socket, scene])

    return(
    null
    )
}

export default ws