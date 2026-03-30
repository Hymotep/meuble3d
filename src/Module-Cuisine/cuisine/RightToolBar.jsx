import React from "react";
import { useStore } from "../store/store";
import { Icons } from "./Icons";

const RightToolbar = () => {
    const viewMode = useStore(s => s.viewMode);
    const setViewMode = useStore(s => s.setViewMode);
    const triggerCameraAction = useStore(s => s.triggerCameraAction);

    const btnStyle = {
        width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center",
        background: "transparent", border: "none", cursor: "pointer", color: "#111827", 
        borderRadius: "8px", transition: "background 0.2s"
    };

    return (
        <div style={{
            position: "absolute", right: "24px", top: "50%", transform: "translateY(-50%)",
            background: "#f8fafc", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            display: "flex", flexDirection: "column", padding: "8px 4px", border: "1px solid #e5e7eb", zIndex: 100
        }}>
            <button style={btnStyle} onClick={() => triggerCameraAction('center')} title="Centrer la vue" onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <Icons.CenterFocus />
            </button>
            <button style={btnStyle} onClick={() => setViewMode(viewMode === "2D" ? "3D" : "2D")} title="Vue 2D/3D" onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span style={{ fontWeight: "700", fontSize: "14px" }}>{viewMode === "2D" ? "3D" : "2D"}</span>
            </button>
            <div style={{ width: "24px", height: "1px", background: "#cbd5e1", margin: "8px auto" }} />
            <button style={btnStyle} onClick={() => triggerCameraAction('zoomIn')} title="Zoomer" onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <Icons.ZoomIn />
            </button>
            <button style={btnStyle} onClick={() => triggerCameraAction('zoomOut')} title="Dézoomer" onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <Icons.ZoomOut />
            </button>
        </div>
    );
};

export default RightToolbar;