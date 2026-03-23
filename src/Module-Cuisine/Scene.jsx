/**
 * ============================================================================
 * KITCHEN CONFIGURATOR - MAIN ENTRY POINT
 * ============================================================================
 */

import React from "react";
import { Canvas } from "@react-three/fiber";

import Sidebar from "./cuisine/Sidebar";
import KitchenScene from "./cuisine/KitchenScene";
import DevisPanel from "./cuisine/DevisPanel";
import SelectionBottomBar from "./cuisine/SelectionBottomBar";

const KitchenConfigurator = () => {
	return (
		<div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden", background: "#e2e8f0" }}>
			<Sidebar />
			<div style={{ flex: 1, position: "relative" }}>
				<DevisPanel />
				<SelectionBottomBar />
				<Canvas>
					<KitchenScene />
				</Canvas>
			</div>
		</div>
	);
};

export default KitchenConfigurator;
