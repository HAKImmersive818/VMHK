import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Doctor GLB Model Component
function DoctorModel({ isSpeaking }) {
  const modelRef = useRef();
  const time = useRef(0);
  
  // Load the GLB model
  const { scene } = useGLTF('/models/doctor.glb');
  
  // Fix materials to respond to lights and find arm bones
  const leftArm = useRef();
  const rightArm = useRef();
  const leftShoulder = useRef();
  const rightShoulder = useRef();
  
  React.useEffect(() => {
    if (scene) {
      console.log('=== SEARCHING FOR BONES IN GLB MODEL ===');
      scene.traverse((child) => {
        if (child.isMesh) {
          // Fix black materials
          if (child.material) {
            child.material.metalness = 0.1;
            child.material.roughness = 0.7;
            child.material.needsUpdate = true;
            child.material.toneMapped = true;
          }
          child.castShadow = true;
          child.receiveShadow = true;
        }
        
        // Log ALL bones and objects to find arm bones
        if (child.isBone || child.isObject3D) {
          console.log('Found bone/object:', child.name, 'Type:', child.type);
          const name = child.name.toLowerCase();
          
          // Try to find left arm/shoulder bones
          if (name.includes('left') && (name.includes('arm') || name.includes('shoulder') || name.includes('hand') || name.includes('upperarm'))) {
            console.log('✅ FOUND LEFT ARM:', child.name);
            leftArm.current = child;
          }
          if (name.includes('left') && name.includes('shoulder')) {
            leftShoulder.current = child;
          }
          
          // Try to find right arm/shoulder bones
          if (name.includes('right') && (name.includes('arm') || name.includes('shoulder') || name.includes('hand') || name.includes('upperarm'))) {
            console.log('✅ FOUND RIGHT ARM:', child.name);
            rightArm.current = child;
          }
          if (name.includes('right') && name.includes('shoulder')) {
            rightShoulder.current = child;
          }
        }
      });
      console.log('Left arm found:', !!leftArm.current);
      console.log('Right arm found:', !!rightArm.current);
      console.log('=== END BONE SEARCH ===');
    }
  }, [scene]);
  
  useFrame((state, delta) => {
    time.current += delta;

    if (modelRef.current) {
      // Friendly welcoming animation - whole body since arms don't animate
      
      // Gentle floating up and down
      modelRef.current.position.y = -2.5 + Math.sin(time.current * 0.8) * 0.2;
      
      // Gentle side-to-side rotation (like nodding hello)
      modelRef.current.rotation.y = Math.sin(time.current * 1.5) * 0.12;
      
      // Slight forward tilt (welcoming posture)
      modelRef.current.rotation.x = 0.05 + Math.sin(time.current * 1.2) * 0.04;
      
      // Slight side tilt for natural movement
      modelRef.current.rotation.z = Math.sin(time.current * 1.8) * 0.03;
      
      // When speaking - more energetic movement
      if (isSpeaking) {
        modelRef.current.rotation.y = Math.sin(time.current * 2.5) * 0.15;
        modelRef.current.position.y = -2.5 + Math.sin(time.current * 1.5) * 0.25;
      }
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={0.05}
      position={[0, -2.5, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

// Preload the model for better performance
useGLTF.preload('/models/doctor.glb');

function DoctorAvatar({ isSpeaking, isListening }) {
  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0, 18], fov: 45 }}>
        <color attach="background" args={['#f0f9ff']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-10, 10, -10]} intensity={0.6} color="#e0f2fe" />
        <pointLight position={[0, 5, 10]} intensity={0.5} color="#ffffff" />
        
        <DoctorModel isSpeaking={isSpeaking} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.7}
        />
      </Canvas>
      
      {/* Listening indicator - glowing ring */}
      {isListening && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full border-4 border-blue-400 animate-ping opacity-75"></div>
          <div className="absolute w-80 h-80 rounded-full border-4 border-blue-500 animate-pulse"></div>
        </div>
      )}
      
      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <span className="ml-2">Speaking...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorAvatar;
