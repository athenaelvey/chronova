import { useEffect, useRef } from "react";
import * as THREE from "three";

// additive blending makes dark colors nearly invisible, so push a color to
// full brightness while keeping its hue (e.g. maroon -> bright crimson)
function vivid(color) {
    const peak = Math.max(color.r, color.g, color.b) || 1;
    return color.clone().multiplyScalar(1 / peak);
}

// pull colors from the site's CSS variables so the sphere matches the app
function getPalette() {
    const css = getComputedStyle(document.documentElement);
    const read = (name, fallback) =>
        new THREE.Color(css.getPropertyValue(name).trim() || fallback);

    const accent = read("--accent", "#d4a84b");
    const secondary = read("--accent-secondary", "#d4a84b");
    const white = () => new THREE.Color(0xffffff);

    return {
        core: white().lerp(accent, 0.12),
        glow: white().lerp(accent, 0.4),
        beamCore: white().lerp(accent, 0.3),
        beam: vivid(accent),
        lines: white().lerp(secondary, 0.35),
        discInner: vivid(accent),
        discOuter: vivid(secondary),
        arcs: vivid(secondary).lerp(white(), 0.25),
    };
}

// soft round gradient; each sprite tints it through material.color
function makeGlowTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.25, "rgba(255,255,255,0.4)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
}

// neutral white falloff for the disc; tinted by material.color
function makeDiscTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, "rgba(255,255,255,0.8)");
    gradient.addColorStop(0.3, "rgba(255,255,255,0.6)");
    gradient.addColorStop(0.6, "rgba(255,255,255,0.25)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
}

// beam = three stacked cylinders (bright thin core + two wider, fainter layers)
function makeBeam(length, palette) {
    const beam = new THREE.Group();
    const layers = [
        { radius: 0.025, color: palette.beamCore, opacity: 1.0 },
        { radius: 0.07, color: palette.beam, opacity: 0.3 },
        { radius: 0.16, color: palette.beam, opacity: 0.12 },
    ];
    layers.forEach(({ radius, color, opacity }) => {
        beam.add(new THREE.Mesh(
            new THREE.CylinderGeometry(radius, radius, length, 24, 1, true),
            new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            })
        ));
    });
    return beam;
}

// dipole field lines: r = L * sin^2(theta), spun around the axis (y)
function makeFieldLines(starRadius, color) {
    const group = new THREE.Group();
    const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    // L = farthest distance of each loop from the star's center, in star radii
    const shells = [2.5, 3.5, 5, 6.5].map(m => m * starRadius);
    const lineCount = 12;
    const steps = 64;

    shells.forEach((L, s) => {
        // start and end each loop exactly on the star's surface
        const thetaMin = Math.asin(Math.sqrt(starRadius / L));
        for (let k = 0; k < lineCount; k++) {
            // stagger each shell so the rotation is visible
            const phi = (k / lineCount) * Math.PI * 2 + s * 0.35;
            const points = [];
            for (let i = 0; i <= steps; i++) {
                const theta = thetaMin + (i / steps) * (Math.PI - 2 * thetaMin);
                const r = L * Math.sin(theta) ** 2;
                points.push(new THREE.Vector3(
                    r * Math.sin(theta) * Math.cos(phi),
                    r * Math.cos(theta),
                    r * Math.sin(theta) * Math.sin(phi)
                ));
            }
            group.add(new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(points),
                material
            ));
        }
    });
    return group;
}

function PulsarSphere({ duration }) {

    const mountRef = useRef(null);

    useEffect(() => {

        const currentMount = mountRef.current;
        const increment = (2 * Math.PI) / (duration * 60);
        const STAR_RADIUS = 0.45;
        const palette = getPalette();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(500, 500);
        currentMount.appendChild(renderer.domElement);
        camera.position.z = 5;

        const glowTexture = makeGlowTexture();
        const discTexture = makeDiscTexture();

        // soft glow behind the star
        const starGlow = new THREE.Sprite(new THREE.SpriteMaterial({
            map: glowTexture,
            color: palette.glow,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
        }));
        starGlow.scale.setScalar(STAR_RADIUS * 4.5);
        scene.add(starGlow);

        // everything hangs off this group: its y axis is the beam / spin axis.
        // x tilts it toward the camera (opens the disc), z leans the beam diagonally
        const axisGroup = new THREE.Group();
        axisGroup.rotation.set(0.45, 0, 0.6);
        scene.add(axisGroup);

        // ---- static: star and beam ----
        axisGroup.add(new THREE.Mesh(
            new THREE.SphereGeometry(STAR_RADIUS, 48, 32),
            new THREE.MeshBasicMaterial({ color: palette.core })
        ));

        axisGroup.add(makeBeam(10, palette));

        const poleMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            color: palette.glow,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
        });
        [1, -1].forEach(dir => {
            const pole = new THREE.Sprite(poleMaterial);
            pole.scale.setScalar(STAR_RADIUS * 1.8);
            pole.position.y = dir * STAR_RADIUS * 1.15;
            axisGroup.add(pole);
        });

        // ---- rotating: field lines ----
        const spinGroup = new THREE.Group();
        spinGroup.add(makeFieldLines(STAR_RADIUS, palette.lines));
        axisGroup.add(spinGroup);

        // ---- disc: soft glow plus slowly swirling arcs ----
        const discGroup = new THREE.Group();
        discGroup.rotation.x = -Math.PI / 2; // lie flat, perpendicular to the axis
        axisGroup.add(discGroup);

        // two stacked glows: inner in the accent color, wider outer one in the secondary
        [
            { size: 3.4, color: palette.discInner, opacity: 0.6 },
            { size: 6.6, color: palette.discOuter, opacity: 0.4 },
        ].forEach(({ size, color, opacity }) => {
            discGroup.add(new THREE.Mesh(
                new THREE.PlaneGeometry(size, size),
                new THREE.MeshBasicMaterial({
                    map: discTexture,
                    color,
                    transparent: true,
                    opacity,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    side: THREE.DoubleSide,
                })
            ));
        });

        const rings = [];
        for (let i = 0; i < 7; i++) {
            const radius = 0.9 + i * 0.3;
            for (let arc = 0; arc < 2; arc++) {
                const start = i * 1.3 + arc * Math.PI;
                const length = 2.2 + ((i + arc) % 3) * 0.7;
                const mesh = new THREE.Mesh(
                    new THREE.RingGeometry(radius, radius + 0.03, 96, 1, start, length),
                    new THREE.MeshBasicMaterial({
                        color: palette.arcs,
                        transparent: true,
                        opacity: 0.65 - i * 0.07,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false,
                        side: THREE.DoubleSide,
                    })
                );
                discGroup.add(mesh);
                rings.push({ mesh, speed: 0.012 / Math.pow(radius, 1.5) }); // inner arcs move faster
            }
        }

        let frameID;

        function animate() {
            spinGroup.rotation.y += increment;
            rings.forEach(r => { r.mesh.rotation.z += r.speed; });
            renderer.render(scene, camera);
            frameID = requestAnimationFrame(animate);
        }
        animate();

        return () => {
            cancelAnimationFrame(frameID);
            currentMount.removeChild(renderer.domElement);
            scene.traverse(obj => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) obj.material.dispose();
            });
            glowTexture.dispose();
            discTexture.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={mountRef}></div>
    );
}

export default PulsarSphere;