import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Center, ContactShadows } from "@react-three/drei";
// Importe le nouveau Chef d'orchestre

import { Parent } from "./components/Parent";

export default function App() {
	return (
		<div style={{ width: "100vw", height: "100vh", background: "#e5e7eb" }}>
			<Canvas camera={{ position: [0, 1.5, 3], fov: 45 }}>
				<ambientLight intensity={0.6} />
				<directionalLight position={[10, 20, 15]} intensity={1} castShadow />

				<Suspense fallback={null}>
					<Center bottom>
						<Parent />
					</Center>
					<Environment preset="city" />
				</Suspense>

				<OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} enablePan={true} />
			</Canvas>
		</div>
	);
}
