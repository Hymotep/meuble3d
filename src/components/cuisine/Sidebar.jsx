/**
 * ============================================================================
 * SIDEBAR COMPONENT
 * ============================================================================
 * 
 * Left panel containing:
 * - View mode toggle (2D/3D)
 * - Export/Import buttons
 * - Kitchen preset buttons (Linear, L, U, Island, etc.)
 * - Room configuration (dimensions, wall count, color)
 * - Cabinet catalog (add new cabinets)
 */

import React, { useRef } from "react";
import { useStore } from "../../store/store";
import { DEFAULT_CABINET_CONFIG } from "../../config/pricing";
import { STANDARD_DIMENSIONS } from "../../config/constants";
import { theme } from "../../config/theme";
import { Icons } from "./Icons";

const PRESETS = {
    lineaire: {
        room: { wallCount: 1 },
        items: (defaultConfig) => [
            { id: crypto.randomUUID(), type: "window", position: [900, 900, -1450], dimensions: { width: 1000, height: 1000, depth: 100 }, rotation: 0, config: defaultConfig },
            { id: crypto.randomUUID(), type: "tall_cabinet", position: [-900, 0, -1200], dimensions: { width: 600, height: 2100, depth: 600 }, rotation: 0, config: { ...defaultConfig, equipement: "oven_microwave" } },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [-300, 0, -1200], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 0, config: { ...defaultConfig, isTiroirsInterieurs: true } },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [300, 0, -1200], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 0, config: { ...defaultConfig, equipement: "cooktop" } },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [900, 0, -1200], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 0, config: { ...defaultConfig, equipement: "sink" } },
            { id: crypto.randomUUID(), type: "wall_cabinet", position: [-300, 1400, -1325], dimensions: { width: 600, height: 700, depth: 350 }, rotation: 0, config: defaultConfig },
            { id: crypto.randomUUID(), type: "wall_cabinet", position: [300, 1400, -1325], dimensions: { width: 600, height: 700, depth: 350 }, rotation: 0, config: defaultConfig },
        ]
    },
    L: {
        room: { wallCount: 2 },
        items: (defaultConfig) => [
            { id: crypto.randomUUID(), type: "window", position: [-1950, 900, -600], dimensions: { width: 1000, height: 1000, depth: 100 }, rotation: 90, config: defaultConfig },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [-1700, 0, -600], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 270, config: { ...defaultConfig, equipement: "sink" } },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [-1700, 0, 0], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 270, config: { ...defaultConfig, isTiroirsInterieurs: true } },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [-1100, 0, -1200], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 0, config: { ...defaultConfig, equipement: "cooktop" } },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [-500, 0, -1200], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 0, config: defaultConfig },
            { id: crypto.randomUUID(), type: "tall_cabinet", position: [100, 0, -1200], dimensions: { width: 600, height: 2100, depth: 600 }, rotation: 0, config: { ...defaultConfig, equipement: "oven_microwave" } },
        ]
    },
    U: {
        room: { wallCount: 3 },
        items: (defaultConfig) => [
            { id: crypto.randomUUID(), type: "window", position: [100, 900, -1450], dimensions: { width: 1000, height: 1000, depth: 100 }, rotation: 0, config: defaultConfig },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [-1700, 0, 0], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 270, config: defaultConfig },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [-1700, 0, 600], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 270, config: { ...defaultConfig, equipement: "sink" } },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [-1100, 0, -1200], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 0, config: { ...defaultConfig, isTiroirsInterieurs: true } },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [-500, 0, -1200], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 0, config: defaultConfig },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [100, 0, -1200], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 0, config: defaultConfig },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [700, 0, -1200], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 0, config: { ...defaultConfig, equipement: "cooktop" } },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [1700, 0, 0], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 90, config: defaultConfig },
            { id: crypto.randomUUID(), type: "tall_cabinet", position: [1700, 0, 600], dimensions: { width: 600, height: 2100, depth: 600 }, rotation: 90, config: { ...defaultConfig, equipement: "oven_microwave" } },
        ]
    },
    ilot: {
        room: { wallCount: 1 },
        items: (defaultConfig) => [
            { id: crypto.randomUUID(), type: "window", position: [600, 900, -1450], dimensions: { width: 1000, height: 1000, depth: 100 }, rotation: 0, config: defaultConfig },
            { id: crypto.randomUUID(), type: "tall_cabinet", position: [-1200, 0, -1200], dimensions: { width: 600, height: 2100, depth: 600 }, rotation: 0, config: { ...defaultConfig, equipement: "oven_microwave" } },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [-600, 0, -1200], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 0, config: { ...defaultConfig, isTiroirsInterieurs: true } },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [0, 0, -1200], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 0, config: { ...defaultConfig, equipement: "cooktop" } },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [600, 0, -1200], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 0, config: defaultConfig },
            { id: crypto.randomUUID(), type: "tall_cabinet", position: [1200, 0, -1200], dimensions: { width: 600, height: 2100, depth: 600 }, rotation: 0, config: defaultConfig },
            { id: crypto.randomUUID(), type: "island", position: [0, 0, 200], dimensions: { width: 1800, height: 900, depth: 900 }, rotation: 0, config: { ...defaultConfig, equipement: "sink" } },
        ]
    },
    parallele: {
        room: { wallCount: 1 },
        items: (defaultConfig) => [
            { id: crypto.randomUUID(), type: "window", position: [0, 900, -1450], dimensions: { width: 1000, height: 1000, depth: 100 }, rotation: 0, config: defaultConfig },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [-600, 0, -1200], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 0, config: { ...defaultConfig, isTiroirsInterieurs: true } },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [0, 0, -1200], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 0, config: { ...defaultConfig, equipement: "cooktop" } },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [600, 0, -1200], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 0, config: defaultConfig },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [-600, 0, 0], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 180, config: defaultConfig },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [0, 0, 0], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 180, config: { ...defaultConfig, equipement: "sink" } },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [600, 0, 0], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 180, config: { ...defaultConfig, isTiroirsInterieurs: true } },
        ]
    },
    studio: {
        room: { wallCount: 2 },
        items: (defaultConfig) => [
            { id: crypto.randomUUID(), type: "tall_cabinet", position: [-600, 0, -1200], dimensions: { width: 600, height: 2100, depth: 600 }, rotation: 0, config: { ...defaultConfig, equipement: "oven_microwave" } },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [0, 0, -1200], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 0, config: { ...defaultConfig, equipement: "sink" } },
            { id: crypto.randomUUID(), type: "base_cabinet", position: [600, 0, -1200], dimensions: { width: 600, height: 812, depth: 600 }, rotation: 0, config: { ...defaultConfig, equipement: "cooktop" } },
            { id: crypto.randomUUID(), type: "wall_cabinet", position: [0, 1400, -1325], dimensions: { width: 600, height: 700, depth: 350 }, rotation: 0, config: defaultConfig },
            { id: crypto.randomUUID(), type: "wall_cabinet", position: [600, 1400, -1325], dimensions: { width: 600, height: 700, depth: 350 }, rotation: 0, config: defaultConfig },
        ]
    }
};

const Sidebar = () => {
    const room = useStore((state) => state.room);
    const updateRoom = useStore((state) => state.updateRoom);
    const viewMode = useStore((state) => state.viewMode);
    const setViewMode = useStore((state) => state.setViewMode);
    const addItem = useStore((state) => state.addItem);
    const loadState = useStore((state) => state.loadState);

    const fileInputRef = useRef(null);

    const loadPreset = (presetName) => {
        const preset = PRESETS[presetName];
        if (!preset) return;

        const presetRoom = {
            width: 4000,
            depth: 3000,
            height: 2500,
            wallCount: preset.room.wallCount,
            wallColor: "#f3f4f6"
        };
        const presetItems = preset.items(DEFAULT_CABINET_CONFIG);

        loadState({ room: presetRoom, items: presetItems });
    };

    const handleExport = () => {
        const items = useStore.getState().items;
        const dataToSave = { room, items };
        const jsonString = JSON.stringify(dataToSave, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "cuisine_projet.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsedData = JSON.parse(e.target.result);
                if (parsedData.room && parsedData.items) {
                    loadState(parsedData);
                } else {
                    alert("Fichier de cuisine non valide !");
                }
            } catch {
                alert("Erreur de lecture.");
            }
        };
        reader.readAsText(file);
        event.target.value = null;
    };

    const generateCabinet = (type, dimensions) => {
        let posY = 0;
        let posZ = 0;
        if (type === "wall_cabinet") posY = 1400;
        if (type === "window") posY = 900;
        if (type === "window") posZ = -room.depth / 2 + dimensions.depth / 2;

        addItem({
            id: crypto.randomUUID(),
            type,
            position: [0, posY, posZ],
            dimensions,
            config: DEFAULT_CABINET_CONFIG,
        });
    };

    const handleAddIsland = () => {
        addItem({
            id: crypto.randomUUID(),
            type: "island",
            position: [0, 0, 0],
            dimensions: { width: 1800, height: 900, depth: 900 },
            config: { ...DEFAULT_CABINET_CONFIG, couleurExt: "#1e3a8a", couleurPoignees: "#ffffff" },
        });
    };

    return (
        <div style={theme.panel}>
            <div style={theme.header}>
                <h1 style={theme.titleH1}>Studio Design 3D</h1>
                <p style={theme.subtitle}>Configurez votre espace sur mesure</p>
            </div>

            <div style={theme.scrollArea}>
                <div style={{ display: "flex", background: "#f3f4f6", padding: "4px", borderRadius: "8px" }}>
                    <button
                        onClick={() => setViewMode("2D")}
                        style={{
                            flex: 1, padding: "6px", borderRadius: "6px", border: "none",
                            background: viewMode === "2D" ? "#ffffff" : "transparent",
                            boxShadow: viewMode === "2D" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                            fontWeight: 600, fontSize: "12px", cursor: "pointer",
                            color: viewMode === "2D" ? "#111827" : "#6b7280", transition: "all 0.2s"
                        }}
                    >
                        Plan 2D
                    </button>
                    <button
                        onClick={() => setViewMode("3D")}
                        style={{
                            flex: 1, padding: "6px", borderRadius: "6px", border: "none",
                            background: viewMode === "3D" ? "#ffffff" : "transparent",
                            boxShadow: viewMode === "3D" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                            fontWeight: 600, fontSize: "12px", cursor: "pointer",
                            color: viewMode === "3D" ? "#111827" : "#6b7280", transition: "all 0.2s"
                        }}
                    >
                        Vue 3D
                    </button>
                </div>

                <div style={theme.buttonRow}>
                    <button onClick={handleExport} style={theme.btnOutline}>
                        <Icons.Save /> Exporter
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} style={theme.btnOutline}>
                        <Icons.Folder /> Importer
                    </button>
                    <input type="file" accept=".json" ref={fileInputRef} style={{ display: "none" }} onChange={handleImport} />
                </div>

                <div style={theme.section}>
                    <div style={theme.sectionHeader}>
                        <Icons.Star />
                        <h3 style={theme.sectionTitle}>Modèles Prédéfinis</h3>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        <button onClick={() => loadPreset("lineaire")} style={theme.btnSecondary}>Linéaire</button>
                        <button onClick={() => loadPreset("L")} style={theme.btnSecondary}>Cuisine en L</button>
                        <button onClick={() => loadPreset("U")} style={theme.btnSecondary}>Cuisine en U</button>
                        <button onClick={() => loadPreset("ilot")} style={theme.btnSecondary}>Avec Îlot</button>
                        <button onClick={() => loadPreset("parallele")} style={theme.btnSecondary}>Parallèle</button>
                        <button onClick={() => loadPreset("studio")} style={theme.btnSecondary}>Studio Compact</button>
                    </div>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: 0 }} />

                <div style={theme.section}>
                    <div style={theme.sectionHeader}>
                        <Icons.Layout />
                        <h3 style={theme.sectionTitle}>Pièce & Murs</h3>
                    </div>
                    <div style={theme.grid2}>
                        <div style={theme.inputGroup}>
                            <label style={theme.label}>Largeur (mm)</label>
                            <input type="number" value={room.width} onChange={(e) => updateRoom({ width: Number(e.target.value) })} style={theme.input} />
                        </div>
                        <div style={theme.inputGroup}>
                            <label style={theme.label}>Profondeur (mm)</label>
                            <input type="number" value={room.depth} onChange={(e) => updateRoom({ depth: Number(e.target.value) })} style={theme.input} />
                        </div>
                    </div>
                    <div style={theme.grid2}>
                        <div style={theme.inputGroup}>
                            <label style={theme.label}>Forme de pièce</label>
                            <select value={room.wallCount} onChange={(e) => updateRoom({ wallCount: Number(e.target.value) })} style={theme.select}>
                                <option value={1}>1 (Linéaire)</option>
                                <option value={2}>2 (Angle)</option>
                                <option value={3}>3 (En U)</option>
                            </select>
                        </div>
                        <div style={theme.inputGroup}>
                            <label style={theme.label}>Peinture Murs</label>
                            <div style={theme.colorPickerWrapper}>
                                <input type="color" value={room.wallColor} onChange={(e) => updateRoom({ wallColor: e.target.value })} style={theme.colorPicker} />
                                <span style={theme.colorLabel}>{room.wallColor.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: "8px" }}>
                        <button onClick={() => generateCabinet("window", { width: 1000, height: 1000, depth: 100 })} style={{ ...theme.btnOutline, borderColor: "#94a3b8", color: "#475569", width: "100%" }}>
                            <Icons.Window /> Ajouter une Fenêtre
                        </button>
                    </div>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: 0 }} />

                <div style={theme.section}>
                    <div style={theme.sectionHeader}>
                        <Icons.Box />
                        <h3 style={theme.sectionTitle}>Catalogue Meubles</h3>
                    </div>
                    <div style={theme.grid2}>
                        <button onClick={() => generateCabinet("base_cabinet", { width: 600, height: 812, depth: 600 })} style={theme.btnSecondary}>
                            <Icons.Plus /> Bas
                        </button>
                        <button onClick={() => generateCabinet("wall_cabinet", { width: 600, height: 700, depth: 350 })} style={theme.btnSecondary}>
                            <Icons.Plus /> Haut
                        </button>
                        <button onClick={() => generateCabinet("tall_cabinet", { width: 600, height: 2100, depth: 600 })} style={theme.btnSecondary}>
                            <Icons.Plus /> Colonne
                        </button>
                        <button onClick={handleAddIsland} style={{ ...theme.btnSecondary, background: "#111827", color: "#fff", borderColor: "#111827" }}>
                            <Icons.Plus /> Îlot
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
