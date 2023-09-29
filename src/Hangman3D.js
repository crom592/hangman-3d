
import * as THREE from "three";
import React, { useEffect, useRef } from "react";

const Hangman3D = ({ mistakes }) => {
  const hangmanDiv = useRef(null);

  useEffect(() => {
    if (hangmanDiv.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, hangmanDiv.current.clientWidth / 400, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(hangmanDiv.current.clientWidth, 400);
      renderer.shadowMap.enabled = true;
      hangmanDiv.current.innerHTML = '';  // Clear the div
      hangmanDiv.current.appendChild(renderer.domElement);

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      // Add lighting with shadow
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(0, 10, 10);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 512;  // default is 512
      directionalLight.shadow.mapSize.height = 512; // default is 512
      scene.add(directionalLight);      
      scene.add(ambientLight);
      

      // 1. Adjusted the Gallows' Position
      const gallowsGeometry = new THREE.BoxGeometry(1, 5, 1);
      const gallowsMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
      const gallows = new THREE.Mesh(gallowsGeometry, gallowsMaterial);
      gallows.position.set(-2, 2.5, 0);

      const plankGeometry = new THREE.BoxGeometry(4, 0.2, 1);
      const plankMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
      const plank = new THREE.Mesh(plankGeometry, plankMaterial);
      plank.position.set(0, 4.9, 0);

      const gallowsGroup = new THREE.Object3D();
      gallowsGroup.add(gallows, plank);

      scene.add(gallowsGroup);

      // 2. Creating and Positioning Hangman's Parts
      const hangmanFigure = new THREE.Object3D();

      const ropeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
      const ropeMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
      const rope = new THREE.Mesh(ropeGeometry, ropeMaterial);
      rope.position.set(0, 3.5, 0); // Adjusted position

      const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const headMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.set(0, 3, 0);  // Adjusted position

      // The body
      const bodyGeometry = new THREE.BoxGeometry(1, 3, 1);
      const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.set(0, 0.5, 0);

      // The limbs (arms and legs together)
      const limbsGeometry = new THREE.BoxGeometry(1, 0.2, 1);
      const limbsMaterial = new THREE.MeshPhongMaterial({ color: 0x8A2BE2 });

      const leftArm = new THREE.Mesh(limbsGeometry, limbsMaterial);
      leftArm.position.set(-1, 1.2, 0); 

      const rightArm = new THREE.Mesh(limbsGeometry, limbsMaterial);
      rightArm.position.set(1, 1.2, 0); 
      
      // Group Arms together
      const arms = new THREE.Object3D();
      arms.add(leftArm, rightArm);

      const leftHand = new THREE.Mesh(limbsGeometry, limbsMaterial);
      leftHand.position.set(-1.3, 1.2, 0);

      const rightHand = new THREE.Mesh(limbsGeometry, limbsMaterial);
      rightHand.position.set(1.3, 1.2, 0);
      
      // Group Hands together
      const hands = new THREE.Object3D();
      hands.add(leftHand,rightHand );

      const leftLeg = new THREE.Mesh(limbsGeometry, limbsMaterial);
      leftLeg.position.set(-0.6, -1.5, 0);

      const rightLeg = new THREE.Mesh(limbsGeometry, limbsMaterial);
      rightLeg.position.set(0.6, -1.5, 0);

      // Group Leg together
      const legs = new THREE.Object3D();
      legs.add(leftLeg, rightLeg);
      
      const leftFoot = new THREE.Mesh(limbsGeometry, limbsMaterial);
      leftFoot.position.set(-0.6, -1.8, 0);

      const rightFoot = new THREE.Mesh(limbsGeometry, limbsMaterial);
      rightFoot.position.set(0.6, -1.8, 0);

      // Group Feet together
      const feet = new THREE.Object3D();
      feet.add(leftFoot, rightFoot);
      
      // Enable shadow for objects
      gallows.castShadow = true;
      gallows.receiveShadow = true;
      plank.receiveShadow = true;
      rope.castShadow = true;
      head.castShadow = true;
      body.castShadow = true;
      arms.castShadow = true;
      hands.castShadow = true;
      legs.castShadow = true;
      feet.castShadow = true;

      // Add all parts to the hangman figure
      hangmanFigure.add(rope, head, body, arms, hands, legs, feet);

      hangmanFigure.children.forEach(child => {
        child.visible = false;
      });

      scene.add(hangmanFigure);

      // 3. Camera Position Adjusted
      // camera.position.set(0, 2, 10);  // Adjusted position
      camera.position.set(0, 2, 8);

      const parts = [rope, head, body, arms, hands, legs, feet];

      const addParts = (numParts) => {
        for (let i = 0; i < Math.min(numParts, parts.length); i++) {
          if (parts[i]) {
            parts[i].visible = true;
          }
        }
      };
      

      // camera.position.z = 10;

      addParts(mistakes);

      const animate = () => {
        requestAnimationFrame(animate);
        hangmanFigure.rotation.y += 0.03;
        renderer.render(scene, camera);
      };

      animate();
    }
  }, [mistakes]);

  return <div ref={hangmanDiv}></div>;
};

export default Hangman3D;
