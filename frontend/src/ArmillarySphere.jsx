import { useEffect, useRef } from "react";
import * as THREE from "three";

function makeGlowTexture(){
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
}

function ArmillarySphere() {
    const mountRef = useRef(null);

    useEffect(() => {
        const currentMount = mountRef.current;

        // Scene setup (same as PulsarSphere, but with a transparent background)
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 4.2;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(560, 560);
        currentMount.appendChild(renderer.domElement);

        // Shared gold material
        const material = new THREE.MeshStandardMaterial({
            color: 0xc9a13b,
            metalness: 0.85,
            roughness: 0.3,
        });

        // Helper: one thin ring
        const geometries = [];
        function makeRing(radius, tube) {
            const geometry = new THREE.TorusGeometry(radius, tube, 16, 120);
            geometries.push(geometry);
            return new THREE.Mesh(geometry, material);
        }

        // Overall tilt for the whole instrument
        const armillary = new THREE.Group();
        armillary.rotation.z = 0.4;
        scene.add(armillary);
        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        const keyLight = new THREE.DirectionalLight(0xfff1cc, 2.5);
        keyLight.position.set(3, 4, 5);
        const rimLight = new THREE.PointLight(0x8844ff, 40, 20);
        rimLight.position.set(-4, -2, 3);
        scene.add(ambient, keyLight, rimLight);

        // Outer rings: the horizontal "equator" and a tilted "ecliptic"
        const outerGroup = new THREE.Group();
        const equator = makeRing(2.3, 0.03);
        equator.rotation.x = Math.PI / 2;
        const ecliptic = makeRing(2.0, 0.03);
        ecliptic.rotation.x = Math.PI / 2 + 0.41;
        outerGroup.add(equator, ecliptic);

        // Inner rings: two "meridians" crossing at right angles
        const innerGroup = new THREE.Group();
        const meridianA = makeRing(1.7, 0.025);
        const meridianB = makeRing(1.4, 0.025);
        meridianB.rotation.y = Math.PI / 2;
        innerGroup.add(meridianA, meridianB);

        // Small core at the center
        const coreGeometry = new THREE.SphereGeometry(0.3, 24, 16);
        const coreMaterial = new THREE.MeshStandardMaterial({
            color: 0xc9a13b,
            metalness: 0.85,
            roughness: 0.3,
            emissive: 0xbf932a,
            emissiveIntensity: 0.5,
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);

        armillary.add(outerGroup, innerGroup, core);

        const glowTexture = makeGlowTexture();
        const glowMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            color: 0xbf932a,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
            opacity: 0.8,
        });
        const glow = new THREE.Sprite(glowMaterial);
        glow.scale.set(4.5, 4.5, 1);
        armillary.add(glow);

        // Animation: the two groups spin in opposite directions
        let frameID;
        function animate() {
            const t = performance.now() * 0.001;
            const breath = Math.sin(t * 1.4);

            outerGroup.rotation.y += 0.003;
            innerGroup.rotation.y -= 0.006;

            glowMaterial.opacity = 0.65 + 0.2 * breath;
            const size = 4.5 + 0.35 * breath;
            glow.scale.set(size, size, 1);

            coreMaterial.emissiveIntensity = 0.6 + 0.4 * breath;

            rimLight.intensity = 40 + 12 * Math.sin(t * 0.9 + 1);

            renderer.render(scene, camera);
            frameID = requestAnimationFrame(animate);
        }
        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(frameID);
            currentMount.removeChild(renderer.domElement);
            geometries.forEach((g) => g.dispose());
            coreGeometry.dispose();
            material.dispose();
            renderer.dispose();
            glowTexture.dispose();
            glowMaterial.dispose();
            coreMaterial.dispose();

        };
    }, []);

    return <div ref={mountRef}></div>;
}

export default ArmillarySphere;