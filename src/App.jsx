import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Center, ContactShadows } from "@react-three/drei";
import { Routes, Route, Link } from "react-router-dom";

import { Parent } from "./components/Parent";
import KitchenConfigurator from "./Scene";

export default function App() {
	return (
		<div style={{ width: "100vw", height: "100vh", background: "#e5e7eb" }}>
			<Routes>
				<Route path="/" element={
					<>
						<Link to="/cuisine" style={{ position: 'absolute', zIndex: 10, padding: '10px', background: 'white' }}>
							Go to Kitchen Configurator
						</Link>
						<Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
							<Center>
								<Parent />
							</Center>
							<Environment preset="city" />
							<OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} enablePan={true} maxAzimuthAngle={1.5} minAzimuthAngle={-1.5} />
						</Canvas>
					</>
				} />
				<Route path="/cuisine" element={<KitchenConfigurator />} />
			</Routes>
		</div>
	);
}
