'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    // === Floating torus knot (main shape) ===
    const knotGeo = new THREE.TorusKnotGeometry(1.4, 0.38, 180, 24);
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: 0x7c3aed,
      metalness: 0.6,
      roughness: 0.15,
      transmission: 0.3,
      thickness: 0.5,
      envMapIntensity: 1.5,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    scene.add(knot);

    // === Wireframe overlay ===
    const wireGeo = new THREE.TorusKnotGeometry(1.42, 0.39, 100, 16);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xa78bfa,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireKnot = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireKnot);

    // === Particle field ===
    const particleCount = 350;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 14;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.035,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // === Lighting ===
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const pLight1 = new THREE.PointLight(0x7c3aed, 6, 20);
    pLight1.position.set(4, 4, 4);
    scene.add(pLight1);
    const pLight2 = new THREE.PointLight(0x06b6d4, 4, 20);
    pLight2.position.set(-4, -3, 2);
    scene.add(pLight2);
    const pLight3 = new THREE.PointLight(0x10b981, 3, 15);
    pLight3.position.set(0, -4, -3);
    scene.add(pLight3);

    // === Mouse tracking ===
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 1.5;
      targetY = -(e.clientY / window.innerHeight - 0.5) * 1.5;
    };
    window.addEventListener('mousemove', onMouseMove);

    // === Resize ===
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // === Animation ===
    let t = 0;
    renderer.setAnimationLoop(() => {
      t += 0.008;
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;

      knot.rotation.x = currentY + t * 0.3;
      knot.rotation.y = currentX + t * 0.5;
      wireKnot.rotation.x = knot.rotation.x;
      wireKnot.rotation.y = knot.rotation.y;

      particles.rotation.y = t * 0.04;
      particles.rotation.x = Math.sin(t * 0.2) * 0.1;

      // Animate point lights in orbit
      pLight1.position.x = Math.sin(t * 0.7) * 5;
      pLight1.position.z = Math.cos(t * 0.7) * 5;
      pLight2.position.x = Math.sin(t * 0.5 + 2) * 5;
      pLight2.position.z = Math.cos(t * 0.5 + 2) * 5;

      renderer.render(scene, camera);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.setAnimationLoop(null);
      el.removeChild(renderer.domElement);
      knotGeo.dispose(); knotMat.dispose();
      wireGeo.dispose(); wireMat.dispose();
      particleGeo.dispose(); particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
