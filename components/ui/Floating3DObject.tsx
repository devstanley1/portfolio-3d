'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Floating3DObjectProps {
  type: 'cube' | 'sphere' | 'pyramid' | 'torus';
  color: string;
  size?: number;
}

export function Floating3DObject({ type, color, size = 1 }: Floating3DObjectProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const W = 100, H = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
    camera.position.z = 3;

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(1, 1, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    let geo;
    if (type === 'cube') geo = new THREE.BoxGeometry(size, size, size);
    else if (type === 'sphere') geo = new THREE.SphereGeometry(size * 0.6, 32, 32);
    else if (type === 'pyramid') geo = new THREE.TetrahedronGeometry(size * 0.7);
    else geo = new THREE.TorusGeometry(size * 0.5, size * 0.15, 16, 100);

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.5,
      thickness: 1,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    let t = 0;
    renderer.setAnimationLoop(() => {
      t += 0.02;
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.015;
      mesh.position.y = Math.sin(t) * 0.1;
      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [type, color, size]);

  return <div ref={mountRef} className="w-[100px] h-[100px]" />;
}
