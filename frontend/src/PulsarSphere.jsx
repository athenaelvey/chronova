import { useEffect, useRef } from "react";
import * as THREE from 'three';

function makeGlowTexture(){
    const canvas =
    document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = 
    ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);


}

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

        const starGroup = new THREE.Group();
        starGroup.rotation.z = 0.05;
        scene.add(starGroup);
        
        const geometry = new THREE.SphereGeometry(2, 16, 12);
        const material = new THREE.MeshBasicMaterial({ color: 0xd90400, wireframe: true });
        const sphere = new THREE.Mesh(geometry, material);
        starGroup.add(sphere);

        const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 8, 16, 1, true);
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);

        const beamPivot = new THREE.Group();

        beamPivot.rotation.z = Math.PI/6;
        beamPivot.add(beam)
        starGroup.add(beamPivot);

        
        const glowTexture = makeGlowTexture();
        const glowSpriteMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        const glowTop = new THREE.Sprite(glowSpriteMaterial);
        glowTop.scale.set(0.6,0.6,1);
        glowTop.position.y = 4;
        beam.add(glowTop);

        const glowBottom = glowTop.clone();
        glowBottom.position.y= -4;
        beam.add(glowBottom);

        let frameID;

        function animate(){
            starGroup.rotation.y += increment;
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