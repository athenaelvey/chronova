import { useEffect, useRef } from "react";
import * as THREE from 'three';

function PulsarSphere({ duration }){

    const mountRef = useRef(null);

    useEffect(() => {

        const currentMount = mountRef.current;

        const increment = (2*Math.PI) / (duration*60);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(500, 500);
        currentMount.appendChild(renderer.domElement);
        camera.position.z = 5;
        
        const geometry = new THREE.SphereGeometry(2, 16, 12);
        const material = new THREE.MeshBasicMaterial({ color: 0xd90400, wireframe: true });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 8, 16, 1, true);
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: 0x773344,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending
        });
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.rotation.z = Math.PI/6;
        scene.add(beam);

        let frameID;

        function animate(){
            sphere.rotation.y += increment;
            sphere.rotation.x += 0.005;
            beam.rotation.y += increment;
            renderer.render(scene, camera);
            frameID = requestAnimationFrame(animate);
        }
        animate();

        return() =>
        {
            currentMount.removeChild(renderer.domElement);
            cancelAnimationFrame(frameID);
            renderer.dispose();
        }
    },[]);

    return(
        <div ref={mountRef}></div>
    )

}

export default PulsarSphere;