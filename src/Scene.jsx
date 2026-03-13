import React, { useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { useStore } from "../src/store/store";
import { useDrag } from "@use-gesture/react";
import * as THREE from "three";

import { Caisson2 } from "./components/Caisson2";

const theme = {
    panel: { width: "360px", background: "#f8fafc", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", height: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" },
    header: { padding: "24px 20px", background: "#ffffff", borderBottom: "1px solid #e2e8f0" },
    titleH1: { margin: 0, fontSize: "20px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" },
    subtitle: { margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" },
    scrollArea: { flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" },
    card: { background: "#ffffff", borderRadius: "16px", padding: "20px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", border: "1px solid #f1f5f9" },
    sectionTitle: { margin: "0 0 16px 0", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "8px" },
    label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "8px", marginTop: "16px" },
    input: { width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px", color: "#0f172a", backgroundColor: "#f8fafc", boxSizing: "border-box", outline: "none", transition: "border 0.2s" },
    colorPicker: { width: "100%", height: "40px", padding: "2px", borderRadius: "10px", border: "1px solid #cbd5e1", cursor: "pointer", backgroundColor: "#ffffff", boxSizing: "border-box" },
    colorRow: { display: "flex", gap: "10px", marginTop: "8px" },
    colorBlock: { flex: 1, display: "flex", flexDirection: "column", gap: "4px" },
    colorLabel: { fontSize: "11px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" },
    checkboxLabel: { display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#334155", fontWeight: "500", cursor: "pointer", marginTop: "16px", padding: "12px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" },
    checkbox: { width: "18px", height: "18px", accentColor: "#3b82f6", cursor: "pointer" },
    buttonRow: { display: "flex", gap: "10px", marginBottom: "16px" },
    btnIcon: { flex: 1, padding: "10px", background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" },
    btnPrimary: { width: "100%", padding: "14px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "12px", boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)" },
    btnSecondary: { width: "100%", padding: "14px", background: "#8b5cf6", color: "#ffffff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "12px", boxShadow: "0 4px 6px -1px rgba(139, 92, 246, 0.2)" },
    btnTall: { width: "100%", padding: "14px", background: "#f59e0b", color: "#ffffff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "12px", boxShadow: "0 4px 6px -1px rgba(245, 158, 11, 0.2)" },
    btnIsland: { width: "100%", padding: "14px", background: "#0f172a", color: "#ffffff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "12px", boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.2)" },
    btnAction: { width: "100%", padding: "12px", background: "#10b981", color: "#ffffff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "20px" },
    btnDanger: { width: "100%", padding: "12px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "24px" }
};

const DraggableCaisson = ({ position, dimensions, isSelected, id, config, type }) => {
    const meshRef = useRef();
    const { camera, controls } = useThree();
    const items = useStore((state) => state.items);
    const room = useStore((state) => state.room);
    const setSelectedId = useStore((state) => state.setSelectedId);
    const setDraggedId = useStore((state) => state.setDraggedId);
    const updateItemPosition = useStore((state) => state.updateItemPosition);
    const dragOffset = useRef(new THREE.Vector3());

    const lastValidPos = useRef({ x: position[0]/1000, z: position[2]/1000 });

    const currentItem = items.find((i) => i.id === id);
    const rotationDeg = currentItem?.rotation || 0;
    const rotationRad = -(rotationDeg * Math.PI) / 180;

    const w = dimensions.width / 1000;
    const h = dimensions.height / 1000;
    const d = dimensions.depth / 1000;

    const isRotated = rotationDeg === 90 || rotationDeg === 270;
    const worldW = isRotated ? d : w;
    const worldD = isRotated ? w : d;

    const bind = useDrag(({ active, first, last, event }) => {
        const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        raycaster.setFromCamera(mouse, camera);
        const intersectPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(floorPlane, intersectPoint);

        if (first) {
            event.stopPropagation();
            setSelectedId(id);
            setDraggedId(id);
            if (controls) controls.enabled = false;
            if (meshRef.current) {
                dragOffset.current.copy(intersectPoint).sub(meshRef.current.position);
                lastValidPos.current = { x: meshRef.current.position.x, z: meshRef.current.position.z };
            }
        }

        if (active && meshRef.current) {
            let newX = intersectPoint.x - dragOffset.current.x;
            let newZ = intersectPoint.z - dragOffset.current.z;
            let newY = type === "wall_cabinet" ? 1.4 : 0;

            const SNAP_DISTANCE = 0.2;

            const roomW = room.width / 1000;
            const roomD = room.depth / 1000;
            const murGauche = -roomW / 2 + worldW / 2;
            const murDroit = roomW / 2 - worldW / 2;
            const murFond = -roomD / 2 + worldD / 2;
            const murFace = roomD / 2 - worldD / 2;

            if (newX < murGauche) newX = murGauche;
            if (newX > murDroit) newX = murDroit;
            if (newZ < murFond) newZ = murFond;
            if (newZ > murFace) newZ = murFace;

            const isFloorItem = type === "base_cabinet" || type === "tall_cabinet" || type === "island";
            
            const interactingItems = items.filter((i) => {
                if (i.id === id) return false;
                if (isFloorItem) return i.type === "base_cabinet" || i.type === "tall_cabinet" || i.type === "island";
                if (type === "wall_cabinet") return i.type === "wall_cabinet" || i.type === "tall_cabinet";
                return false;
            });

            let hasCollision = false;

            interactingItems.forEach((otherItem) => {
                const otherRot = otherItem.rotation || 0;
                const otherIsRot = otherRot === 90 || otherRot === 270;
                const otherW = (otherIsRot ? otherItem.dimensions.depth : otherItem.dimensions.width) / 1000;
                const otherD = (otherIsRot ? otherItem.dimensions.width : otherItem.dimensions.depth) / 1000;

                const otherX = otherItem.position[0] / 1000;
                const otherZ = otherItem.position[2] / 1000;

                let tempX = newX;
                let tempZ = newZ;

                if (Math.abs(newX + worldW / 2 - (otherX - otherW / 2)) < SNAP_DISTANCE) tempX = otherX - otherW / 2 - worldW / 2;
                else if (Math.abs(newX - worldW / 2 - (otherX + otherW / 2)) < SNAP_DISTANCE) tempX = otherX + otherW / 2 + worldW / 2;

                if (Math.abs(newZ - worldD / 2 - (otherZ - otherD / 2)) < SNAP_DISTANCE) tempZ = otherZ - otherD / 2 + worldD / 2;
                else if (Math.abs(newZ + worldD / 2 - (otherZ + otherD / 2)) < SNAP_DISTANCE) tempZ = Math.abs(newZ + worldD / 2 - (otherZ + otherD / 2)) < SNAP_DISTANCE ? otherZ + otherD / 2 - worldD / 2 : tempZ;

                newX = tempX;
                newZ = tempZ;

                const myBox = { x: newX - worldW / 2, z: newZ - worldD / 2, w: worldW, d: worldD };
                const otherBox = { x: otherX - otherW / 2, z: otherZ - otherD / 2, w: otherW, d: otherD };

                if (
                    myBox.x < otherBox.x + otherBox.w - 0.01 &&
                    myBox.x + myBox.w > otherBox.x + 0.01 &&
                    myBox.z < otherBox.z + otherBox.d - 0.01 &&
                    myBox.z + myBox.d > otherBox.z + 0.01
                ) {
                    hasCollision = true;
                }
            });

            if (hasCollision) {
                newX = lastValidPos.current.x;
                newZ = lastValidPos.current.z;
            } else {
                lastValidPos.current = { x: newX, z: newZ };
            }

            meshRef.current.position.set(newX, newY, newZ);
        }

        if (last) {
            setDraggedId(null);
            if (controls) controls.enabled = true;
            if (meshRef.current) {
                updateItemPosition(id, [meshRef.current.position.x * 1000, meshRef.current.position.y * 1000, meshRef.current.position.z * 1000]);
            }
        }
    });

    return (
        <group ref={meshRef} {...bind()} position={[position[0] / 1000, position[1] / 1000, position[2] / 1000]} rotation={[0, rotationRad, 0]}>
            <group position={[-w / 2, 0, -d / 2]}>
                <mesh position={[w / 2, h / 2, d / 2]}>
                    <boxGeometry args={[w, h, d]} />
                    <meshBasicMaterial visible={false} />
                </mesh>
                <Caisson2
                    largeur={dimensions.width}
                    hauteur={dimensions.height}
                    profondeur={dimensions.depth}
                    isSelected={isSelected}
                    type={type}
                    couleurExt={config.couleurExt}
                    couleurInt={config.couleurInt} 
                    avecPoignees={config.avecPoignees}
                    isTiroirsInterieurs={config.isTiroirsInterieurs}
                    equipement={config.equipement}
                    couleurPlanTravail={config.couleurPlanTravail}
                    onClick={(e) => e.stopPropagation()}
                />
            </group>
        </group>
    );
};

const RoomBuilder = () => {
    const room = useStore((state) => state.room);
    const setSelectedId = useStore((state) => state.setSelectedId);

    const w = room.width / 1000;
    const d = room.depth / 1000;
    const h = room.height / 1000;

    return (
        <group onPointerDown={() => setSelectedId(null)}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}>
                <planeGeometry args={[w, d]} />
                <meshStandardMaterial color="#e5e7eb" />
            </mesh>
            {room.wallCount >= 1 && (
                <mesh position={[0, h / 2, -d / 2]}>
                    <planeGeometry args={[w, h]} />
                    <meshStandardMaterial color={room.wallColor} />
                </mesh>
            )}
            {room.wallCount >= 2 && (
                <mesh rotation={[0, Math.PI / 2, 0]} position={[-w / 2, h / 2, 0]}>
                    <planeGeometry args={[d, h]} />
                    <meshStandardMaterial color={room.wallColor} />
                </mesh>
            )}
            {room.wallCount === 3 && (
                <mesh rotation={[0, -Math.PI / 2, 0]} position={[w / 2, h / 2, 0]}>
                    <planeGeometry args={[d, h]} />
                    <meshStandardMaterial color={room.wallColor} />
                </mesh>
            )}
        </group>
    );
};

const KitchenScene = () => {
    const { room, items, selectedId, draggedId } = useStore();

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <RoomBuilder />
            <Grid args={[room.width / 1000, room.depth / 1000]} infiniteGrid fadeDistance={10} />
            {items.map((item) => (
                <DraggableCaisson
                    key={item.id}
                    id={item.id}
                    type={item.type}
                    position={item.position}
                    dimensions={item.dimensions}
                    isSelected={selectedId === item.id}
                    config={item.config}
                />
            ))}
            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} enabled={!draggedId} />
        </>
    );
};

const Sidebar = () => {
    const items = useStore((state) => state.items);
    const room = useStore((state) => state.room);
    const updateRoom = useStore((state) => state.updateRoom);
    const selectedId = useStore((state) => state.selectedId);

    const addItem = useStore((state) => state.addItem);
    const updateItemRotation = useStore((state) => state.updateItemRotation);
    const updateItemConfig = useStore((state) => state.updateItemConfig);
    const updateItemDimensions = useStore((state) => state.updateItemDimensions); 
    const deleteItem = useStore((state) => state.deleteItem);
    const loadState = useStore((state) => state.loadState);

    const selectedItem = items.find((item) => item.id === selectedId);
    const fileInputRef = useRef(null);

    const handleExport = () => {
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
                if (parsedData.room && parsedData.items) loadState(parsedData);
                else alert("Fichier de cuisine non valide !");
            } catch (error) {
                alert("Erreur de lecture.");
            }
        };
        reader.readAsText(file);
        event.target.value = null; 
    };

    const generateCabinet = (type, dimensions, configOverrides = {}) => {
        addItem({
            id: crypto.randomUUID(),
            type,
            position: [0, type === "wall_cabinet" ? 1400 : 0, 0],
            dimensions,
            config: {
                activeConfig: 4, couleurExt: "#ffffff", couleurInt: "#e5e7eb",
                avecPoignees: true, couleurPoignees: "#222222", isTiroirsInterieurs: false,
                couleurPlanTravail: "#daba9e", equipement: "none", ...configOverrides
            },
        });
    };

    const handleAddIsland = () => {
        addItem({
            id: crypto.randomUUID(),
            type: "island",
            position: [0, 0, 0],
            dimensions: { width: 1800, height: 900, depth: 900 },
            config: {
                activeConfig: 4, couleurExt: "#1e3a8a", couleurInt: "#e5e7eb",
                avecPoignees: true, couleurPoignees: "#ffffff", isTiroirsInterieurs: false,
                couleurPlanTravail: "#daba9e", equipement: "none"
            },
        });
    };

    return (
        <div style={theme.panel}>
            {/* HEADER */}
            <div style={theme.header}>
                <h1 style={theme.titleH1}>Cuisine Studio 3D</h1>
                <p style={theme.subtitle}>Configurez votre espace sur mesure</p>
            </div>

            {/* SCROLL AREA */}
            <div style={theme.scrollArea}>
                
                {/* PROJET */}
                <div style={{...theme.card, border: "1px solid #e0e7ff", background: "#f8fafc"}}>
                    <h3 style={{...theme.sectionTitle, color: "#6366f1"}}>📁 Projet</h3>
                    <div style={theme.buttonRow}>
                        <button onClick={handleExport} style={theme.btnIcon}>💾 Sauvegarder</button>
                        <button onClick={() => fileInputRef.current.click()} style={theme.btnIcon}>📂 Ouvrir</button>
                        <input type="file" accept=".json" ref={fileInputRef} style={{ display: "none" }} onChange={handleImport} />
                    </div>
                </div>

                {/* ESPACE 3D */}
                <div style={theme.card}>
                    <h3 style={theme.sectionTitle}>📐 Dimensions de la pièce</h3>
                    <label style={theme.label}>Largeur (mm)</label>
                    <input type="number" value={room.width} onChange={(e) => updateRoom({ width: Number(e.target.value) })} style={theme.input} />
                    <label style={theme.label}>Profondeur (mm)</label>
                    <input type="number" value={room.depth} onChange={(e) => updateRoom({ depth: Number(e.target.value) })} style={theme.input} />
                    <label style={theme.label}>Configuration des murs</label>
                    <select value={room.wallCount} onChange={(e) => updateRoom({ wallCount: Number(e.target.value) })} style={theme.input}>
                        <option value={1}>1 mur (Cuisine linéaire)</option>
                        <option value={2}>2 murs (Cuisine en L)</option>
                        <option value={3}>3 murs (Cuisine en U)</option>
                    </select>
                    <label style={theme.label}>Couleur des murs</label>
                    <input type="color" value={room.wallColor} onChange={(e) => updateRoom({ wallColor: e.target.value })} style={theme.colorPicker} />
                </div>

                {/* CATALOGUE */}
                <div style={theme.card}>
                    <h3 style={theme.sectionTitle}>📦 Catalogue de meubles</h3>
                    <button onClick={() => generateCabinet("base_cabinet", { width: 600, height: 812, depth: 600 })} style={theme.btnPrimary}>+ Meuble Bas</button>
                    <button onClick={() => generateCabinet("wall_cabinet", { width: 600, height: 700, depth: 350 })} style={theme.btnSecondary}>+ Meuble Haut</button>
                    <button onClick={() => generateCabinet("tall_cabinet", { width: 600, height: 2100, depth: 600 })} style={theme.btnTall}>+ Colonne (2m10)</button>
                    <button onClick={handleAddIsland} style={theme.btnIsland}>+ Créer un Îlot Central</button>
                </div>

                {/* EDITION DU CAISSON SELECTIONNE */}
                {selectedItem && (
                    <div style={{...theme.card, border: "2px solid #3b82f6", background: "#f0f9ff"}}>
                        <h3 style={{...theme.sectionTitle, color: "#1d4ed8"}}>⚙️ Modifier la sélection</h3>
                        
                        <button onClick={() => updateItemRotation(selectedId, (selectedItem.rotation + 90) % 360)} style={theme.btnAction}>
                            ↻ Faire pivoter (90°)
                        </button>

                        <label style={theme.label}>Largeur totale (mm)</label>
                        <select value={selectedItem.dimensions.width} onChange={(e) => updateItemDimensions(selectedId, { width: Number(e.target.value) })} style={theme.input}>
                            {selectedItem.type === "island" ? (
                                <>
                                    <option value={1200}>1200 mm (Petit Îlot)</option>
                                    <option value={1800}>1800 mm (Îlot Standard)</option>
                                    <option value={2400}>2400 mm (Grand Îlot)</option>
                                </>
                            ) : (
                                <>
                                    <option value={400}>400 mm (Étroit)</option>
                                    <option value={600}>600 mm (Standard)</option>
                                    <option value={800}>800 mm (Large)</option>
                                    <option value={1000}>1000 mm (Très large)</option>
                                </>
                            )}
                        </select>

                        <label style={theme.label}>Apparence</label>
                        <div style={theme.colorRow}>
                            <div style={theme.colorBlock}>
                                <span style={theme.colorLabel}>Structure</span>
                                <input type="color" value={selectedItem.config.couleurInt || "#e5e7eb"} onChange={(e) => updateItemConfig(selectedId, { couleurInt: e.target.value })} style={theme.colorPicker} />
                            </div>
                            <div style={theme.colorBlock}>
                                <span style={theme.colorLabel}>Façades</span>
                                <input type="color" value={selectedItem.config.couleurExt} onChange={(e) => updateItemConfig(selectedId, { couleurExt: e.target.value })} style={theme.colorPicker} />
                            </div>
                        </div>

                        <label style={theme.checkboxLabel}>
                            <input type="checkbox" checked={selectedItem.config.avecPoignees} onChange={(e) => updateItemConfig(selectedId, { avecPoignees: e.target.checked })} style={theme.checkbox} />
                            Ajouter des poignées
                        </label>

                        {selectedItem.type === "base_cabinet" && (
                            <label style={{...theme.checkboxLabel, background: "#e0e7ff", borderColor: "#c7d2fe", color: "#4338ca"}}>
                                <input type="checkbox" checked={selectedItem.config.isTiroirsInterieurs} onChange={(e) => updateItemConfig(selectedId, { isTiroirsInterieurs: e.target.checked })} style={theme.checkbox} />
                                Transformer en Casserolier (Tiroirs)
                            </label>
                        )}

                        {/* NOUVEAU : GESTION DES ÉQUIPEMENTS (Meubles Bas ET Colonnes) */}
                        {(selectedItem.type === "base_cabinet" || selectedItem.type === "island" || selectedItem.type === "tall_cabinet") && (
                            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #cbd5e1" }}>
                                <label style={{...theme.label, marginTop: 0}}>Équipement intégré</label>
                                
                                {selectedItem.type === "tall_cabinet" ? (
                                    <select value={selectedItem.config.equipement || "none"} onChange={(e) => updateItemConfig(selectedId, { equipement: e.target.value })} style={theme.input}>
                                        <option value="none">Aucun (Armoire simple)</option>
                                        <option value="oven_microwave">Four + Micro-ondes</option>
                                    </select>
                                ) : (
                                    <select value={selectedItem.config.equipement || "none"} onChange={(e) => updateItemConfig(selectedId, { equipement: e.target.value })} style={theme.input}>
                                        <option value="none">Plan de travail libre</option>
                                        <option value="sink">Évier + Robinet</option>
                                        <option value="cooktop">Plaque de Cuisson</option>
                                    </select>
                                )}

                                {(selectedItem.type === "base_cabinet" || selectedItem.type === "island") && (
                                    <>
                                        <label style={theme.label}>Couleur du Plan de Travail</label>
                                        <input type="color" value={selectedItem.config.couleurPlanTravail || "#daba9e"} onChange={(e) => updateItemConfig(selectedId, { couleurPlanTravail: e.target.value })} style={theme.colorPicker} />
                                    </>
                                )}
                            </div>
                        )}

                        <button onClick={() => deleteItem(selectedId)} style={theme.btnDanger}>
                            🗑️ Supprimer ce meuble
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function KitchenConfigurator() {
    return (
        <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden", background: "#e2e8f0" }}>
            <Sidebar />
            <div style={{ flex: 1, position: "relative" }}>
                <Canvas camera={{ position: [0, 2, 4], fov: 45 }}>
                    <KitchenScene />
                </Canvas>
            </div>
        </div>
    );
}