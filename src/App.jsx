import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Center, ContactShadows } from "@react-three/drei";

import { Parent } from "./components/Parent";

export default function App() {
	return (
		<div style={{ width: "100vw", height: "100vh", background: "#e5e7eb" }}>
			<Canvas camera={{ position: [0, 0.5, 3], fov: 45 }}>
				{/* <ambientLight intensity={1} /> */}
					<Center bottom>
						<Parent />
					</Center>
					<Environment preset="city" />
				<OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} enablePan={true} maxAzimuthAngle={1.5} minAzimuthAngle={-1.5} />
			</Canvas>
		</div>
	);
}
