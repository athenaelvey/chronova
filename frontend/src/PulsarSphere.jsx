import { useEffect, useRef } from "react";
import * as THREE from 'three';

function PulsarSphere(){

    const mountRef = useRef(null);

    useEffect(() => {

        const currentMount = mountRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(500, 500);
        currentMount.appendChild(renderer.domElement);
        camera.position.z = 5;
        renderer.render(scene, camera);

        return() =>
        {
            currentMount.removeChild(renderer.domElement);
            renderer.dispose();
        }
    },[]);

    return(
        <div ref={mountRef}></div>
    )

}

export default PulsarSphere;