import React from "react";
import { Canvas } from "@react-three/fiber";

import Sidebar from "./cuisine/Sidebar";
import KitchenScene from "./cuisine/KitchenScene";
import DevisPanel from "./cuisine/DevisPanel";
import FloatingActionMenu from "./cuisine/FloatingActionMenu"; // Remplaçant de SelectionBottomBar
import RightToolbar from "./cuisine/RightToolBar"; // NOUVEAU

const Scene = () => {
    return (
        <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden", background: "#e2e8f0" }}>
            <Sidebar />
            <div style={{ flex: 1, position: "relative" }}>
                <DevisPanel />
                <RightToolbar />
                <FloatingActionMenu />
                <Canvas>
                    <KitchenScene />
                </Canvas>
            </div>
        </div>
    );
};

export default Scene;