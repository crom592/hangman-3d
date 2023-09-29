// src/Hangman3D.js
import * as THREE from "three";
import React, { useEffect, useRef } from "react";

const Hangman3D = ({ mistakes }) => {
  const hangmanDiv = useRef(null);
  
  useEffect(() => {
    // hangmanDiv.current가 존재하는지 검사
    if (hangmanDiv.current) {
      console.log("Initializing Three.js objects");  // 로그 추가  
      const scene = new THREE.Scene();
      console.log("Scene:", scene);  // 로그 추가
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(hangmanDiv.current.clientWidth, hangmanDiv.current.clientHeight);
      hangmanDiv.current.appendChild(renderer.domElement);

      const objects = [];

      const addObject = (geometry, material, position, visible) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.visible = visible;
        scene.add(mesh);
        objects.push(mesh);
      };

      const parts = [
        { geometry: new THREE.BoxGeometry(5, 0.5, 5), material: new THREE.MeshBasicMaterial({ color: 0x8B4513 }), position: new THREE.Vector3(0, 0, 0), visible: false }, // Base
        { geometry: new THREE.CylinderGeometry(0.1, 0.1, 4, 32), material: new THREE.MeshBasicMaterial({ color: 0x8B4513 }), position: new THREE.Vector3(0, 2, 0), visible: false }, // Rope
        { geometry: new THREE.SphereGeometry(0.5, 32, 32), material: new THREE.MeshBasicMaterial({ color: 0xFFFFFF }), position: new THREE.Vector3(0, 1.5, 0), visible: false }, // Head
        { geometry: new THREE.BoxGeometry(1, 3, 1), material: new THREE.MeshBasicMaterial({ color: 0xFF0000 }), position: new THREE.Vector3(0, 0.5, 0), visible: false }, // Body
        { geometry: new THREE.BoxGeometry(1, 0.2, 1), material: new THREE.MeshBasicMaterial({ color: 0x000000 }), position: new THREE.Vector3(0, -1, 0), visible: false }, // Left Leg
        { geometry: new THREE.BoxGeometry(1, 0.2, 1), material: new THREE.MeshBasicMaterial({ color: 0x000000 }), position: new THREE.Vector3(0, -1, 0), visible: false }, // Right Leg
        { geometry: new THREE.BoxGeometry(0.5, 1, 0.2), material: new THREE.MeshBasicMaterial({ color: 0xFF0000 }), position: new THREE.Vector3(-0.75, 0.5, 0), visible: false }, // Left Arm
        { geometry: new THREE.BoxGeometry(0.5, 1, 0.2), material: new THREE.MeshBasicMaterial({ color: 0xFF0000 }), position: new THREE.Vector3(0.75, 0.5, 0), visible: false },  // Right Arm
        { geometry: new THREE.BoxGeometry(0.5, 1, 0.2), material: new THREE.MeshBasicMaterial({ color: 0x000000 }), position: new THREE.Vector3(0, -1, 0), visible: false }, // Left Hand
        { geometry: new THREE.BoxGeometry(0.5, 1, 0.2), material: new THREE.MeshBasicMaterial({ color: 0x000000 }), position: new THREE.Vector3(0, -1, 0), visible: false }, // Right Hand
        { geometry: new THREE.BoxGeometry(0.5, 1, 0.2), material: new THREE.MeshBasicMaterial({ color: 0x000000 }), position: new THREE.Vector3(0, -1, 0), visible: false }, // Left Foot
        { geometry: new THREE.BoxGeometry(0.5, 1, 0.2), material: new THREE.MeshBasicMaterial({ color: 0x000000 }), position: new THREE.Vector3(0, -1, 0), visible: false }, // Right Foot
        // Add more parts here...
      ];
      parts[0].visible = true;
      const addParts = (numParts) => {
        for (let i = 0; i < numParts; i++) {
          const part = parts[i];
          addObject(part.geometry, part.material, part.position, part.visible);
        }
      };

      camera.position.z = 20;


      const animate = () => {
        const numPartsToShow = Math.min(mistakes, parts.length);
        for (let i = 0; i < numPartsToShow; i++) {
          objects[i].visible = true;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      addParts(parts.length);
      animate();

      return () => {
        // Clean-up
        for (const object of objects) {
          scene.remove(object);
          object.geometry.dispose();
          object.material.dispose();
        }
        renderer.dispose();
      };
    }
  }, [mistakes]);  // 의존성 배열에서 hangmanDiv.current를 제거

  return <div ref={hangmanDiv}></div>;
};

export default Hangman3D;
// 주요 변경 사항:

// useEffect에서 hangmanDiv.current가 존재하는지 검사합니다. 존재하지 않으면 그 이후의 코드는 실행되지 않습니다.
// useEffect의 의존성 배열에서 hangmanDiv.current를 제거했습니다. 이제 mistakes 값에만 의존하게 됩니다.
// 이렇게 수정하면 이전에 발생했던 Cannot read properties of null (reading 'appendChild') 오류는 해결될 가능성이 높습니다.





