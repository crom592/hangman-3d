
import * as THREE from "three";
import React, { useEffect, useRef ,useState} from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Hangman3D = ({ mistakes }) => {
  const hangmanDiv = useRef(null);
  const sceneRef = useRef(null); // useRef를 사용하여 scene 저장
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  // const [swayAngle, setSwayAngle] = useState(0);

  useEffect(() => {
    if (hangmanDiv.current) {
      sceneRef.current = new THREE.Scene();
      
      // const scene = new THREE.Scene();

      const scene = sceneRef.current; // sceneRef에서 scene을 가져옴
        // TextureLoader를 사용하여 배경 이미지 로드
      const textureLoader = new THREE.TextureLoader();
      const backgroundTexture = textureLoader.load(process.env.PUBLIC_URL + '/hangman_background.jpg'); // 여기에 이미지의 경로를 설정하세요.
      
      // scene의 배경으로 설정
      sceneRef.current.background = backgroundTexture;

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      // Add lighting with shadow
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
      directionalLight.position.set(20, 20, 0);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 512;  // default is 512
      directionalLight.shadow.mapSize.height = 512; // default is 512
      scene.add(directionalLight);      
      scene.add(ambientLight);
      
      let height = window.innerHeight;
      let width = window.innerWidth;
      if (window.innerWidth <= 800) { // 화면의 너비가 800px 이하인 경우 모바일 환경으로 간주
        height /= 2; // 높이를 반으로 조정        
      }else{
        width /=2; //넓이를 반으로 조정
      }

      const camera = new THREE.PerspectiveCamera(65, (window.innerWidth / 2) / height, 0.1, 100);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true;
      rendererRef.current = renderer;
      
      // Optionally, configure the controls
      const controls = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
      controls.enableDamping = true; // Smooth camera movement
      controls.dampingFactor = 0.05; // Adjust the damping factor as needed
      controls.rotateSpeed = 0.5;   // Adjust the rotation speed as needed
      controlsRef.current=controls
      
      // 1. Adjusted the Gallows' Position
      const gallowsGeometry = new THREE.CylinderGeometry(0.4, 0.5, 5.3, 32);  // Changed to Cylinder
      const normalTexture = new THREE.TextureLoader().load(
        process.env.PUBLIC_URL + '/34503018.jpeg'
      )
      const gallowsMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
      gallowsMaterial.normalMap = normalTexture
      gallowsMaterial.normalScale.set(1, 4)
      const gallows = new THREE.Mesh(gallowsGeometry, gallowsMaterial);
      gallows.position.set(-2, 0, 0);

      const plankGeometry = new THREE.BoxGeometry(4, 0.2, 0.5);  // Reduced depth
      const plank = new THREE.Mesh(plankGeometry, gallowsMaterial);
      plank.position.set(0, 2, 0);

      const boxGeometry = new THREE.BoxGeometry(5, 0.5, 2);  // Reduced depth
      const box = new THREE.Mesh(boxGeometry, gallowsMaterial);
      box.position.set(-0.5, -2.7, 0);
      
      gallows.castShadow = true;
      gallows.receiveShadow = true;
      plank.receiveShadow = true;
      
      const gallowsGroup = new THREE.Object3D();
      gallowsGroup.add(gallows, plank,box);

      scene.add(gallowsGroup);

      // 3. Camera Position Adjusted
      // camera.position.set(0, 2, 10);  // Adjusted position
      cameraRef.current.position.set(6, 3, 8);
      
    }
  }, []); // 빈 dependency array로 설정하여 한 번만 실행되게 함

  useEffect(() => {
    if (hangmanDiv.current) {

      // const scene = new THREE.Scene();
      if (!sceneRef.current) return; // sceneRef가 없다면 return
      const scene = sceneRef.current; // sceneRef에서 scene을 가져옴

      
      hangmanDiv.current.innerHTML = '';  // Clear the div
      hangmanDiv.current.appendChild(rendererRef.current.domElement);

      // 2. Creating and Positioning Hangman's Parts
      const hangmanFigure = new THREE.Object3D();

      const ropeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 32);  // Reduced radius
      const ropeMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
      const rope = new THREE.Mesh(ropeGeometry, ropeMaterial);
      rope.position.set(0, 1.5, 0);
      
      const headNormalTexture = new THREE.TextureLoader().load(
        process.env.PUBLIC_URL + '/smile.png'
      )
      const headGeometry = new THREE.SphereGeometry(0.4, 6, 8,199.8);  // Reduced radius
      const headMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFF00 });
      headMaterial.normalMap = headNormalTexture
      headMaterial.normalScale.set(100, 100)
      headMaterial.color.set(0xFFFF00)
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.set(0, 0.7, 0);

      // The body
      const bodyGeometry = new THREE.CapsuleGeometry(0.5, 0.8, 3, 32);  
      const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xA08265 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.set(0, -0.5, 0);

      // arms
      const armsGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.2);
      const armsMaterial = new THREE.MeshPhongMaterial({ color: 0xA08265 });

      const leftArm = new THREE.Mesh(armsGeometry, armsMaterial);
      leftArm.position.set(-0.65,-0.3, 0); 
      leftArm.rotation.z = 12
      const rightArm = new THREE.Mesh(armsGeometry, armsMaterial);
      rightArm.position.set(0.65, -0.3, 0); 
      rightArm.rotation.z = -12
      
      // Group Arms together
      const arms = new THREE.Object3D();
      arms.add(leftArm, rightArm);

      //hands
      const handGeometry = new THREE.CapsuleGeometry(0.2, 0.1 , 0.5);
      const handMaterial = new THREE.MeshPhongMaterial({ color: 0xA08265 });
      
      const leftHand = new THREE.Mesh(handGeometry, handMaterial);
      leftHand.position.set(-1,-0.8, 0);

      const rightHand = new THREE.Mesh(handGeometry, handMaterial);
      rightHand.position.set(1, -0.8, 0);
    
      // Group Hands together
      const hands = new THREE.Object3D();
      hands.add(leftHand,rightHand );

      //legs
      const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1);
      const legMaterial = new THREE.MeshPhongMaterial({ color: 0xA08265 });

      const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
      leftLeg.position.set(-0.3, -1.6, 0);

      const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
      rightLeg.position.set(0.3, -1.6, 0);

      // Group Leg together
      const legs = new THREE.Object3D();
      legs.add(leftLeg, rightLeg);
      
      // feet
      const feetGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.8);
      const feetMaterial = new THREE.MeshPhongMaterial({ color: 0xA08265 });

      const leftFoot = new THREE.Mesh(feetGeometry, feetMaterial);
      leftFoot.position.set(-0.3, -2.1, 0);

      const rightFoot = new THREE.Mesh(feetGeometry, feetMaterial);
      rightFoot.position.set(0.3, -2.1, 0);

      // Group Feet together
      const feet = new THREE.Object3D();
      feet.add(leftFoot, rightFoot);
      
      // Enable shadow for objects     
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
      const parts = [rope, head, body, arms, hands, legs, feet];
      

      const animate = () => {
        requestAnimationFrame(animate);                
        // Update the camera controls
        controlsRef.current.update();
        // setSwayAngle(Math.sin(Date.now() * 0.0015) * 0.015); // Adjust the amplitude and speed as needed
        // if(mistakes === 7){
        //   hangmanFigure.rotation.y +=0.05
        // }
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        // hangmanFigure.rotation.y += swayAngle;
      };
      
      animate();
      const handleResize = () => {
        const width = hangmanDiv.current.clientWidth;
        const height = hangmanDiv.current.clientHeight;
        
        rendererRef.current.setSize(width, height);
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      };

    window.addEventListener('resize', handleResize);
    const addParts = (numParts) => {
      for (let i = 0; i < Math.min(numParts, parts.length); i++) {
        if (parts[i]) {
          parts[i].visible = true;
        }
      }
    };      

    addParts(mistakes);

    return () => {
        window.removeEventListener('resize', handleResize);
    };
    }
  }, [mistakes]);

  return <div ref={hangmanDiv} style={{ width: '100%', height: '100%' }}></div>;
};

export default Hangman3D;
