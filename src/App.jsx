import React, { useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
// NOUVEAU : Ajout de Environment et ContactShadows
import { OrbitControls, Center, Environment, ContactShadows } from "@react-three/drei";
import { Routes, Route, Link } from "react-router-dom";
import * as THREE from "three";

import DressingConfigurator from "./Module-dressing/dressing/DressingConfigurator";
import KitchenConfigurator from "./Module-Cuisine/Scene";

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

// --- NOUVELLE SCÈNE DRESSING PHOTORÉALISTE ---
const DressingScene = () => {
	return (
		<>
			{/* 1. Éclairage doux (teinte légèrement chaude) */}
			<ambientLight intensity={0.4} />
			<directionalLight position={[5, 10, 5]} intensity={0.8} color="#fffbeb" />

			{/* 2. Réflexions HDRI pour faire briller le bois et le métal */}
			<Environment preset="apartment" blur={0.5} />

			{/* 3. Ombres de contact pour ancrer le dressing au sol */}
			<ContactShadows
				position={[0, 0, 0]} // Posé au niveau 0
				opacity={0.65}
				scale={20}
				blur={2.5}
				far={2}
				resolution={1024}
				color="#1e293b"
			/>

			{/* 4. Le Dressing */}
			{/* "bottom" aligne la base du meuble sur Y=0 pour coller à l'ombre */}
			<Center bottom>
				<DressingConfigurator />
			</Center>

			{/* 5. Contrôles fluides */}
			<OrbitControls
				makeDefault
				enableZoom={true} // Permet au client de s'approcher des détails
				minPolarAngle={0}
				maxPolarAngle={Math.PI / 2} // Empêche de passer sous le sol
				enableDamping
				dampingFactor={0.05} // Effet de glissement "luxe"
			/>
		</>
	);
};

export default function App() {
	return (
		<div style={{ width: "100vw", height: "100vh", background: "#f8fafc" }}>
			<Routes>
				<Route
					path="/"
					element={
						<>
							{/* On appelle juste le composant, il s'occupe du reste (UI + Canvas) ! */}
							<DressingConfigurator />
						</>
					}
				/>
				<Route path="/cuisine" element={<KitchenConfigurator />} />
			</Routes>
		</div>
	);
}
