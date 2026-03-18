import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Center } from "@react-three/drei";
import { Routes, Route, Link } from "react-router-dom";
import * as THREE from "three";

import { Parent } from "./components/Parent";
import KitchenConfigurator from "./Scene";

const CameraController = ({ items = [], roomDims = null }) => {
	const { camera, controls } = useThree();

	const targetPosition = useRef(new THREE.Vector3(0, 1.5, 4));
	const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

	useEffect(() => {
		if (!items || items.length === 0) {
			targetPosition.current.set(0, 1.5, 4);
			targetLookAt.current.set(0, 0, 0);
			return;
		}

		const boundingBox = new THREE.Box3();

		items.forEach((item) => {
			const w = item.dimensions?.width / 1000 || item.largeur / 1000;
			const h = item.dimensions?.height / 1000 || item.hauteur / 1000;
			const d = item.dimensions?.depth / 1000 || item.profondeur / 1000;

			const x = item.position[0] / 1000;
			const y = item.position[1] / 1000;
			const z = item.position[2] / 1000;

			const itemBox = new THREE.Box3();
			itemBox.min.set(x - w / 2, y, z - d / 2);
			itemBox.max.set(x + w / 2, y + h, z + d / 2);

			boundingBox.union(itemBox);
		});

		if (boundingBox.min.equals(boundingBox.max)) {
			targetPosition.current.set(0, 1.5, 4);
			targetLookAt.current.set(0, 0, 0);
			return;
		}

		const size = new THREE.Vector3();
		boundingBox.getSize(size);

		const center = new THREE.Vector3();
		boundingBox.getCenter(center);

		const maxDim = Math.max(size.x, size.z);
		const fov = camera.fov * (Math.PI / 180);
		const cameraDistance = maxDim / (2 * Math.tan(fov / 2));
		const padding = 2;
		const finalDistance = cameraDistance * padding + maxDim * 0.3;

		targetPosition.current.set(0, Math.max(size.y * 0.5, 1), finalDistance);
		targetLookAt.current.set(center.x, size.y * 0.3, center.z);

	}, [items, roomDims]); // eslint-disable-line react-hooks/exhaustive-deps

	useFrame(() => {
		const lerpFactor = 0.03;
		camera.position.lerp(targetPosition.current, lerpFactor);

		if (controls) {
			const currentTarget = controls.target || new THREE.Vector3(0, 0, 0);
			currentTarget.lerp(targetLookAt.current, lerpFactor);
			controls.target.copy(currentTarget);
			controls.update();
		}
	});

	return null;
};

const DressingScene = () => {
	return (
		<>

			<ambientLight intensity={0.6} />
			<directionalLight position={[5, 5, 5]} intensity={0.8} />
			<Center>
				<Parent />
			</Center>
		
			<OrbitControls
				makeDefault
				enableZoom={false}
				minPolarAngle={Math.PI * 0.1}
				maxPolarAngle={Math.PI / 2 - 0.1}
				minAzimuthAngle={-Math.PI / 4}
				maxAzimuthAngle={Math.PI / 4}
				enablePan={false}
			/>
		</>
	);
};

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
							<DressingScene />
						</Canvas>
					</>
				} />
				<Route path="/cuisine" element={<KitchenConfigurator />} />
			</Routes>
		</div>
	);
}
