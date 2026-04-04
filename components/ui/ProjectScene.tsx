'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type SceneType = 'helix' | 'sphere-cluster' | 'cube-grid' | 'rings' | 'diamond' | 'vortex';

interface ProjectSceneProps {
  scene: SceneType;
  primaryColor: string;   // hex like '#6d28d9'
  secondaryColor: string;
  className?: string;
  interactive?: boolean;
}

function hexToThreeColor(hex: string) {
  return new THREE.Color(hex);
}

function oklchToHex(oklch: string): string {
  // Map our oklch primaries to approximate hex values
  const map: Record<string, string> = {
    'oklch(0.62 0.268 270)': '#6d28d9',
    'oklch(0.72 0.18 200)': '#0ea5e9',
    'oklch(0.68 0.22 330)': '#be185d',
    'oklch(0.72 0.2 10)':   '#f97316',
    'oklch(0.72 0.2 162)':  '#059669',
    'oklch(0.75 0.18 140)': '#14b8a6',
    'oklch(0.75 0.18 55)':  '#d97706',
    'oklch(0.78 0.16 75)':  '#ef4444',
    'oklch(0.65 0.22 25)':  '#ef4444',
    'oklch(0.7 0.2 340)':   '#a855f7',
    'oklch(0.62 0.18 230)': '#0891b2',
    'oklch(0.72 0.2 200)':  '#6366f1',
  };
  return map[oklch] ?? oklch;
}

export function ProjectScene({ scene, primaryColor, secondaryColor, className = '', interactive = true }: ProjectSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Convert oklch → hex if needed
  const pc = primaryColor.startsWith('oklch') ? oklchToHex(primaryColor) : primaryColor;
  const sc = secondaryColor.startsWith('oklch') ? oklchToHex(secondaryColor) : secondaryColor;

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const W = el.clientWidth;
    const H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const sceneObj = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
    camera.position.z = 5;

    // Lights
    sceneObj.add(new THREE.AmbientLight(0xffffff, 0.3));
    const pl1 = new THREE.PointLight(hexToThreeColor(pc), 8, 30);
    pl1.position.set(3, 3, 3);
    sceneObj.add(pl1);
    const pl2 = new THREE.PointLight(hexToThreeColor(sc), 5, 20);
    pl2.position.set(-3, -2, 2);
    sceneObj.add(pl2);

    // ─── Build scene ───────────────────────────────────────────────────────────
    const meshes: THREE.Object3D[] = [];

    if (scene === 'helix') {
      // DNA-like double helix from instanced spheres
      const geoBead = new THREE.SphereGeometry(0.1, 12, 12);
      const mat1 = new THREE.MeshPhysicalMaterial({ color: hexToThreeColor(pc), metalness: 0.7, roughness: 0.1 });
      const mat2 = new THREE.MeshPhysicalMaterial({ color: hexToThreeColor(sc), metalness: 0.7, roughness: 0.1 });
      for (let i = 0; i < 60; i++) {
        const t = (i / 60) * Math.PI * 4 - Math.PI * 2;
        const r = 1.2;
        const b1 = new THREE.Mesh(geoBead, mat1);
        b1.position.set(Math.cos(t) * r, i * 0.12 - 3.6, Math.sin(t) * r);
        const b2 = new THREE.Mesh(geoBead, mat2);
        b2.position.set(Math.cos(t + Math.PI) * r, i * 0.12 - 3.6, Math.sin(t + Math.PI) * r);
        sceneObj.add(b1, b2);
        meshes.push(b1, b2);
        if (i % 5 === 0) {
          const rod = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, r * 2, 6),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 })
          );
          rod.position.lerp(b1.position.clone().add(b2.position).multiplyScalar(0.5), 1);
          rod.lookAt(b2.position);
          sceneObj.add(rod);
        }
      }
    }

    if (scene === 'sphere-cluster') {
      const count = 22;
      const geoBig = new THREE.SphereGeometry(1, 48, 48);
      const matBig = new THREE.MeshPhysicalMaterial({
        color: hexToThreeColor(pc), metalness: 0.4, roughness: 0.05, transmission: 0.6, thickness: 2,
      });
      const big = new THREE.Mesh(geoBig, matBig);
      sceneObj.add(big); meshes.push(big);

      const geoSmall = new THREE.SphereGeometry(0.22, 20, 20);
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 1.8 + Math.random() * 0.8;
        const sm = new THREE.Mesh(geoSmall, new THREE.MeshPhysicalMaterial({
          color: i % 2 === 0 ? hexToThreeColor(pc) : hexToThreeColor(sc),
          metalness: 0.8, roughness: 0.1,
        }));
        sm.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
        sceneObj.add(sm); meshes.push(sm);
      }
    }

    if (scene === 'cube-grid') {
      const geoBox = new THREE.BoxGeometry(0.3, 0.3, 0.3);
      for (let x = -2; x <= 2; x++) {
        for (let y = -2; y <= 2; y++) {
          const dist = Math.sqrt(x * x + y * y);
          const mat = new THREE.MeshPhysicalMaterial({
            color: dist < 1.5 ? hexToThreeColor(pc) : hexToThreeColor(sc),
            metalness: 0.6, roughness: 0.15,
            transparent: true, opacity: 0.7 + dist * 0.06,
          });
          const box = new THREE.Mesh(geoBox, mat);
          box.position.set(x * 0.75, y * 0.75, 0);
          sceneObj.add(box); meshes.push(box);
        }
      }
    }

    if (scene === 'rings') {
      for (let i = 0; i < 6; i++) {
        const r = 0.6 + i * 0.45;
        const geo = new THREE.TorusGeometry(r, 0.05 - i * 0.004, 16, 100);
        const mat = new THREE.MeshPhysicalMaterial({
          color: i % 2 === 0 ? hexToThreeColor(pc) : hexToThreeColor(sc),
          metalness: 0.8, roughness: 0.1,
        });
        const torus = new THREE.Mesh(geo, mat);
        torus.rotation.x = Math.random() * Math.PI;
        torus.rotation.y = Math.random() * Math.PI;
        sceneObj.add(torus); meshes.push(torus);
      }
    }

    if (scene === 'diamond') {
      const geoOcta = new THREE.OctahedronGeometry(1.5, 0);
      const matOcta = new THREE.MeshPhysicalMaterial({
        color: hexToThreeColor(pc), metalness: 0.3, roughness: 0.0,
        transmission: 0.9, thickness: 1.5, ior: 2.4,
      });
      const diamond = new THREE.Mesh(geoOcta, matOcta);
      sceneObj.add(diamond); meshes.push(diamond);

      const geoWire = new THREE.OctahedronGeometry(1.52, 0);
      const wire = new THREE.Mesh(geoWire, new THREE.MeshBasicMaterial({ color: hexToThreeColor(sc), wireframe: true, transparent: true, opacity: 0.4 }));
      sceneObj.add(wire); meshes.push(wire);

      // Floating shards
      for (let i = 0; i < 12; i++) {
        const shard = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.12 + Math.random() * 0.12),
          new THREE.MeshPhysicalMaterial({ color: hexToThreeColor(sc), metalness: 0.6, roughness: 0.1 })
        );
        shard.position.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2);
        sceneObj.add(shard); meshes.push(shard);
      }
    }

    if (scene === 'vortex') {
      const count = 300;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 12;
        const r = (i / count) * 2.2;
        const y = (i / count) * 5 - 2.5;
        positions[i * 3] = Math.cos(angle) * r;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = Math.sin(angle) * r;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: hexToThreeColor(pc), size: 0.06, transparent: true, opacity: 0.9 }));
      sceneObj.add(pts); meshes.push(pts);

      // Tube following the same spiral
      const curve = new THREE.CatmullRomCurve3(
        Array.from({ length: 60 }, (_, i) => {
          const angle = (i / 60) * Math.PI * 12;
          const r = (i / 60) * 2.2;
          return new THREE.Vector3(Math.cos(angle) * r, (i / 60) * 5 - 2.5, Math.sin(angle) * r);
        })
      );
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 200, 0.02, 8),
        new THREE.MeshPhysicalMaterial({ color: hexToThreeColor(sc), metalness: 0.8, roughness: 0.1 })
      );
      sceneObj.add(tube); meshes.push(tube);
    }

    // Mouse parallax
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = interactive ? (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 1.2;
      ty = -(e.clientY / window.innerHeight - 0.5) * 1.2;
    } : null;
    if (onMove) window.addEventListener('mousemove', onMove);

    // Resize
    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let t = 0;
    renderer.setAnimationLoop(() => {
      t += 0.01;
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;

      // Rotate lights
      pl1.position.x = Math.sin(t * 0.7) * 5;
      pl1.position.z = Math.cos(t * 0.7) * 5;
      pl2.position.x = Math.sin(t * 0.5 + 2) * 4;
      pl2.position.z = Math.cos(t * 0.5 + 2) * 4;

      // Animate meshes
      meshes.forEach((m, i) => {
        if (scene === 'helix') {
          m.rotation.y = t * 0.4 + cx;
          sceneObj.rotation.y = t * 0.18 + cx;
          sceneObj.rotation.x = cy * 0.3;
        } else if (scene === 'sphere-cluster') {
          if (i === 0) { m.rotation.y = t * 0.2; m.rotation.x = cx * 0.3; }
          else { m.position.y += Math.sin(t * 0.8 + i) * 0.002; }
          sceneObj.rotation.y = cx * 0.5;
          sceneObj.rotation.x = cy * 0.3;
        } else if (scene === 'cube-grid') {
          m.rotation.x = t * 0.3 + i * 0.1;
          m.rotation.y = t * 0.4 + i * 0.1;
          m.position.z = Math.sin(t + i * 0.4) * 0.3;
          sceneObj.rotation.y = cx * 0.5;
          sceneObj.rotation.x = cy * 0.3;
        } else if (scene === 'rings') {
          m.rotation.x = t * (0.2 + i * 0.08) + cx * 0.3;
          m.rotation.y = t * (0.15 + i * 0.06) + cy * 0.2;
        } else if (scene === 'diamond') {
          m.rotation.y = t * 0.3 + cx;
          m.rotation.x = t * 0.15 + cy * 0.5;
          if (i > 1) {
            m.position.y += Math.sin(t * 0.7 + i) * 0.003;
            m.rotation.z = t * 0.5 + i;
          }
        } else if (scene === 'vortex') {
          sceneObj.rotation.y = t * 0.3 + cx;
          sceneObj.rotation.x = Math.sin(t * 0.3) * 0.2 + cy * 0.3;
        }
      });

      renderer.render(sceneObj, camera);
    });

    return () => {
      if (onMove) window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      renderer.setAnimationLoop(null);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, pc, sc]);

  return <div ref={mountRef} className={`w-full h-full ${className}`} />;
}
