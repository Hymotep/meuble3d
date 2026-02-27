import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Cabinet } from './components/Cabinet'; 

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f5f5f5' }}>
      <Canvas camera={{ position: [150, 150, 200], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Cabinet />
        <OrbitControls />
        <Environment preset="city" />
      </Canvas>
      
    </div>
  );
}