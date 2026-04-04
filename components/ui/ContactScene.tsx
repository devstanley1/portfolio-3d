'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ContactScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const W = el.clientWidth, H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 6;

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const pl1 = new THREE.PointLight(0x6d28d9, 7, 25);
    pl1.position.set(3, 3, 3);
    scene.add(pl1);
    const pl2 = new THREE.PointLight(0x0891b2, 5, 20);
    pl2.position.set(-3, -2, 2);
    scene.add(pl2);

    // Central icosphere
    const geo = new THREE.IcosahedronGeometry(1.2, 4);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x6d28d9, metalness: 0.3, roughness: 0.05,
      transmission: 0.7, thickness: 1.5,
    });
    const sphere = new THREE.Mesh(geo, mat);
    scene.add(sphere);

    // Wireframe overlay
    const wGeo = new THREE.IcosahedronGeometry(1.22, 2);
    const wMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.2 });
    const wire = new THREE.Mesh(wGeo, wMat);
    scene.add(wire);

    // Orbiting rings
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.8 + i * 0.5, 0.02, 8, 80),
        new THREE.MeshPhysicalMaterial({ color: i % 2 === 0 ? 0x6d28d9 : 0x0891b2, metalness: 0.8, roughness: 0.1 })
      );
      ring.rotation.x = Math.PI * (0.3 + i * 0.25);
      ring.rotation.y = Math.PI * i * 0.4;
      scene.add(ring);
    }

    // Particle field
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500 * 3; i++) positions[i] = (Math.random() - 0.5) * 18;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pts = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x818cf8, size: 0.032, transparent: true, opacity: 0.6 }));
    scene.add(pts);

    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 0.8;
      ty = -(e.clientY / window.innerHeight - 0.5) * 0.8;
    };
    window.addEventListener('mousemove', onMove);

    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let t = 0;
    renderer.setAnimationLoop(() => {
      t += 0.008;
      cx += (tx - cx) * 0.04;
      cy += (ty - cy) * 0.04;

      sphere.rotation.y = t * 0.2 + cx;
      sphere.rotation.x = cy * 0.4;
      wire.rotation.y = sphere.rotation.y;
      wire.rotation.x = sphere.rotation.x;

      pts.rotation.y = t * 0.03;

      pl1.position.x = Math.sin(t * 0.6) * 5;
      pl1.position.z = Math.cos(t * 0.6) * 5;
      pl2.position.x = Math.sin(t * 0.4 + 2) * 4;
      pl2.position.z = Math.cos(t * 0.4 + 2) * 4;

      renderer.render(scene, camera);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      renderer.setAnimationLoop(null);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
