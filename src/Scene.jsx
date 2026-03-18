/**
 * ============================================================================
 * KITCHEN CONFIGURATOR - MAIN ENTRY POINT
 * ============================================================================
 */

import React from "react";
import { Canvas } from "@react-three/fiber";

import Sidebar from "./components/cuisine/Sidebar";
import KitchenScene from "./components/cuisine/KitchenScene";
import DevisPanel from "./components/cuisine/DevisPanel";
import SelectionBottomBar from "./components/cuisine/SelectionBottomBar";

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
