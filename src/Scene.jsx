import React, { useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera, OrthographicCamera, Environment, ContactShadows } from "@react-three/drei";
import { useStore } from "../src/store/store"; // Ajuste le chemin si besoin
import { useDrag } from "@use-gesture/react";
import * as THREE from "three";

import { Caisson2 } from "./components/cuisine/Caisson2"; // Ajuste le chemin si besoin

const theme = {
    panel: {
        width: "340px",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        zIndex: 10,
        boxShadow: "4px 0 24px rgba(0,0,0,0.02)",
    },
    header: { padding: "20px 20px 16px", borderBottom: "1px solid #f3f4f6", background: "#ffffff" },
    titleH1: { margin: 0, fontSize: "18px", fontWeight: "600", color: "#111827", letterSpacing: "-0.02em" },
    subtitle: { margin: "4px 0 0 0", fontSize: "12px", color: "#6b7280", fontWeight: "400" },
    scrollArea: { flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "24px" },
    section: { display: "flex", flexDirection: "column", gap: "12px" },
    sectionHeader: { display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f3f4f6", paddingBottom: "8px", marginBottom: "2px" },
    sectionTitle: { margin: 0, fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", color: "#111827" },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
    inputGroup: { display: "flex", flexDirection: "column", gap: "4px" },
    label: { fontSize: "12px", fontWeight: "500", color: "#4b5563" },
    input: {
        width: "100%",
        padding: "8px 10px",
        borderRadius: "6px",
        border: "1px solid #d1d5db",
        fontSize: "13px",
        color: "#111827",
        backgroundColor: "#ffffff",
        outline: "none",
        transition: "border-color 0.2s",
        boxSizing: "border-box",
    },
    select: {
        width: "100%",
        padding: "8px 10px",
        borderRadius: "6px",
        border: "1px solid #d1d5db",
        fontSize: "13px",
        color: "#111827",
        backgroundColor: "#ffffff",
        outline: "none",
        cursor: "pointer",
        boxSizing: "border-box",
    },
    buttonRow: { display: "flex", gap: "8px" },
    btnOutline: {
        flex: 1,
        padding: "8px",
        background: "#ffffff",
        color: "#374151",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "500",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "6px",
    },
    btnSecondary: {
        width: "100%",
        padding: "8px",
        background: "#f3f4f6",
        color: "#111827",
        border: "1px solid #e5e7eb",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "500",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "6px",
    },
    btnDanger: {
        width: "100%",
        padding: "8px",
        background: "#ffffff",
        color: "#dc2626",
        border: "1px solid #fecaca",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "500",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "6px",
        marginTop: "4px",
    },
    colorPickerWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "4px 8px",
        borderRadius: "6px",
        border: "1px solid #d1d5db",
        background: "#ffffff",
    },
    colorPicker: { width: "20px", height: "20px", padding: 0, border: "none", borderRadius: "4px", cursor: "pointer", background: "none" },
    colorLabel: { fontSize: "11px", color: "#4b5563", fontWeight: "500" },
    checkboxWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 10px",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        cursor: "pointer",
        background: "#ffffff",
    },
    checkbox: { width: "14px", height: "14px", accentColor: "#111827", cursor: "pointer", margin: 0 },
    activeSelectionPanel: {
        background: "#f8fafc",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    bottomBar: {
        position: "absolute",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#ffffff",
        padding: "16px 24px",
        borderRadius: "16px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        display: "flex",
        gap: "24px",
        alignItems: "flex-end",
        zIndex: 100,
        border: "1px solid #e5e7eb",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    },
    bottomBarSection: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        borderRight: "1px solid #f3f4f6",
        paddingRight: "24px",
    },
    bottomBarSectionLast: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    }
};

const Icons = {
    Save: () => (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
    ),
    Folder: () => (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
    ),
    Layout: () => (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
    ),
    Plus: () => (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    ),
    Settings: () => (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
    ),
    Rotate: () => (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
        </svg>
    ),
    Trash: () => (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
    ),
    Box: () => (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
    ),
};

const SNAP_DISTANCE = 0.2; 

export const DraggableCaisson = ({ position, dimensions, isSelected, id, config, type }) => {
    const meshRef = useRef();
    const { camera, controls } = useThree();

    const items = useStore((state) => state.items);
    const room = useStore((state) => state.room);
    const setSelectedId = useStore((state) => state.setSelectedId);
    const setDraggedId = useStore((state) => state.setDraggedId);
    const updateItemPosition = useStore((state) => state.updateItemPosition);

    const [isColliding, setIsColliding] = useState(false);
    const lastValidPos = useRef({ x: position[0] / 1000, z: position[2] / 1000 });

    const currentItem = items.find((i) => i.id === id);
    const rotationDeg = currentItem?.rotation || 0;
    const rotationRad = -(rotationDeg * Math.PI) / 180;

    const w = dimensions.width / 1000;
    const h = dimensions.height / 1000;
    const d = dimensions.depth / 1000;

    const isRotated = rotationDeg === 90 || rotationDeg === 270;
    const worldW = isRotated ? d : w;
    const worldD = isRotated ? w : d;

    const baseY = type === "wall_cabinet" ? 1.4 : 0;

    const bind = useDrag(({ active, first, last, event, memo }) => {
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

            lastValidPos.current = { x: meshRef.current.position.x, z: meshRef.current.position.z };

            return {
                offsetX: intersectPoint.x - meshRef.current.position.x,
                offsetZ: intersectPoint.z - meshRef.current.position.z,
            };
        }

        if (active && meshRef.current) {
            let newX = intersectPoint.x - memo.offsetX;
            let newZ = intersectPoint.z - memo.offsetZ;

            const roomW = room.width / 1000;
            const roomD = room.depth / 1000;

            const limitLeft = -roomW / 2 + worldW / 2;
            const limitRight = roomW / 2 - worldW / 2;
            const limitBack = -roomD / 2 + worldD / 2;
            const limitFront = roomD / 2 - worldD / 2;

            if (Math.abs(newX - limitLeft) < SNAP_DISTANCE) newX = limitLeft;
            if (Math.abs(newX - limitRight) < SNAP_DISTANCE) newX = limitRight;
            if (Math.abs(newZ - limitBack) < SNAP_DISTANCE) newZ = limitBack;
            if (Math.abs(newZ - limitFront) < SNAP_DISTANCE) newZ = limitFront;

            newX = Math.max(limitLeft, Math.min(limitRight, newX));
            newZ = Math.max(limitBack, Math.min(limitFront, newZ));

            const otherItems = items.filter((i) => i.id !== id);
            let hasCollision = false;

            otherItems.forEach((other) => {
                const otherRot = other.rotation || 0;
                const otherIsRot = otherRot === 90 || otherRot === 270;
                const oW = (otherIsRot ? other.dimensions.depth : other.dimensions.width) / 1000;
                const oD = (otherIsRot ? other.dimensions.width : other.dimensions.depth) / 1000;
                const oX = other.position[0] / 1000;
                const oZ = other.position[2] / 1000;
                const oY = other.position[1] / 1000;
                const oH = other.dimensions.height / 1000;

                if (Math.abs(newZ - oZ) < 0.1 && Math.abs(baseY - oY) < 0.1) {
                    const targetRight = oX + oW / 2 + worldW / 2;
                    if (Math.abs(newX - targetRight) < SNAP_DISTANCE) {
                        newX = targetRight;
                        newZ = oZ;
                    }
                    const targetLeft = oX - oW / 2 - worldW / 2;
                    if (Math.abs(newX - targetLeft) < SNAP_DISTANCE) {
                        newX = targetLeft;
                        newZ = oZ;
                    }
                }

                const myMinX = newX - worldW / 2;
                const myMaxX = newX + worldW / 2;
                const myMinY = baseY;
                const myMaxY = baseY + h;
                const myMinZ = newZ - worldD / 2;
                const myMaxZ = newZ + worldD / 2;

                const oMinX = oX - oW / 2;
                const oMaxX = oX + oW / 2;
                const oMinY = oY;
                const oMaxY = oY + oH;
                const oMinZ = oZ - oD / 2;
                const oMaxZ = oZ + oD / 2;

                const intersectX = myMinX < oMaxX - 0.005 && myMaxX > oMinX + 0.005;
                const intersectY = myMinY < oMaxY - 0.005 && myMaxY > oMinY + 0.005;
                const intersectZ = myMinZ < oMaxZ - 0.005 && myMaxZ > oMinZ + 0.005;

                if (intersectX && intersectY && intersectZ) {
                    hasCollision = true;
                }
            });

            setIsColliding(hasCollision);

            if (hasCollision) {
                newX = lastValidPos.current.x;
                newZ = lastValidPos.current.z;
            } else {
                lastValidPos.current = { x: newX, z: newZ };
            }

            meshRef.current.position.set(newX, baseY, newZ);
        }

        if (last) {
            setDraggedId(null);
            if (controls) controls.enabled = true;

            updateItemPosition(id, [meshRef.current.position.x * 1000, baseY * 1000, meshRef.current.position.z * 1000]);
            setIsColliding(false);
        }
        return memo;
    });

    return (
        <group ref={meshRef} {...bind()} position={[position[0] / 1000, position[1] / 1000, position[2] / 1000]} rotation={[0, rotationRad, 0]}>
            <group position={[-w / 2, 0, -d / 2]}>
                <Caisson2
                    largeur={dimensions.width}
                    hauteur={dimensions.height}
                    profondeur={dimensions.depth}
                    isSelected={isSelected}
                    isColliding={isColliding}
                    type={type}
                    couleurExt={config.couleurExt}
                    couleurInt={config.couleurInt}
                    avecPoignees={config.avecPoignees}
                    isTiroirsInterieurs={config.isTiroirsInterieurs}
                    equipement={config.equipement}
                    couleurPlanTravail={config.couleurPlanTravail}
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
    const { room, items, selectedId, draggedId, viewMode } = useStore();

    return (
        <>
            <ambientLight intensity={0.2} />
            <directionalLight position={[5, 10, 5]} intensity={0.6} color="#fefce8" />

            <Environment preset="city" />

            {viewMode === "3D" && (
                <ContactShadows 
                    position={[0, 0, 0]}
                    opacity={0.6}
                    scale={10}
                    blur={2}
                    far={1.5}
                    resolution={512}
                    color="#000000"
                />
            )}

            <RoomBuilder />
            
            {viewMode === "2D" && (
                <Grid args={[room.width / 1000, room.depth / 1000]} infiniteGrid fadeDistance={10} />
            )}

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

            <PerspectiveCamera 
                makeDefault={viewMode === "3D"} 
                position={[0, 2, 4]} 
                fov={45} 
            />
            <OrthographicCamera 
                makeDefault={viewMode === "2D"} 
                position={[0, 5, 0]} 
                zoom={100} 
            />

            <OrbitControls 
                makeDefault 
                enabled={!draggedId} 
                enableRotate={viewMode === "3D"} 
                minPolarAngle={0} 
                maxPolarAngle={viewMode === "3D" ? Math.PI / 2 : 0} 
            />
        </>
    );
};

const Sidebar = () => {
    const room = useStore((state) => state.room);
    const updateRoom = useStore((state) => state.updateRoom);
    
    const viewMode = useStore((state) => state.viewMode);
    const setViewMode = useStore((state) => state.setViewMode);

    const addItem = useStore((state) => state.addItem);
    const loadState = useStore((state) => state.loadState);

    const fileInputRef = useRef(null);
    const items = useStore((state) => state.items);

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
                activeConfig: 4,
                couleurExt: "#ffffff",
                couleurInt: "#e5e7eb",
                avecPoignees: true,
                couleurPoignees: "#222222",
                isTiroirsInterieurs: false,
                couleurPlanTravail: "#daba9e",
                equipement: "none",
                ...configOverrides,
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
                activeConfig: 4,
                couleurExt: "#1e3a8a",
                couleurInt: "#e5e7eb",
                avecPoignees: true,
                couleurPoignees: "#ffffff",
                isTiroirsInterieurs: false,
                couleurPlanTravail: "#daba9e",
                equipement: "none",
            },
        });
    };

    return (
        <div style={theme.panel}>
            <div style={theme.header}>
                <h1 style={theme.titleH1}>Studio Design 3D</h1>
                <p style={theme.subtitle}>Configurez votre espace sur mesure</p>
            </div>

            <div style={theme.scrollArea}>
                <div style={{ display: 'flex', background: '#f3f4f6', padding: '4px', borderRadius: '8px' }}>
                    <button
                        onClick={() => setViewMode('2D')}
                        style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', background: viewMode === '2D' ? '#ffffff' : 'transparent', boxShadow: viewMode === '2D' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', fontWeight: 600, fontSize: '12px', cursor: 'pointer', color: viewMode === '2D' ? '#111827' : '#6b7280', transition: 'all 0.2s' }}
                    >
                        Plan 2D
                    </button>
                    <button
                        onClick={() => setViewMode('3D')}
                        style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', background: viewMode === '3D' ? '#ffffff' : 'transparent', boxShadow: viewMode === '3D' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', fontWeight: 600, fontSize: '12px', cursor: 'pointer', color: viewMode === '3D' ? '#111827' : '#6b7280', transition: 'all 0.2s' }}
                    >
                        Vue 3D
                    </button>
                </div>

                <div style={theme.buttonRow}>
                    <button onClick={handleExport} style={theme.btnOutline}>
                        <Icons.Save /> Exporter
                    </button>
                    <button onClick={() => fileInputRef.current.click()} style={theme.btnOutline}>
                        <Icons.Folder /> Importer
                    </button>
                    <input type="file" accept=".json" ref={fileInputRef} style={{ display: "none" }} onChange={handleImport} />
                </div>

                <div style={theme.section}>
                    <div style={theme.sectionHeader}>
                        <Icons.Layout />
                        <h3 style={theme.sectionTitle}>Pièce</h3>
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
                            <label style={theme.label}>Murs</label>
                            <select value={room.wallCount} onChange={(e) => updateRoom({ wallCount: Number(e.target.value) })} style={theme.select}>
                                <option value={1}>1 (Linéaire)</option>
                                <option value={2}>2 (Angle)</option>
                                <option value={3}>3 (En U)</option>
                            </select>
                        </div>
                        <div style={theme.inputGroup}>
                            <label style={theme.label}>Peinture</label>
                            <div style={theme.colorPickerWrapper}>
                                <input type="color" value={room.wallColor} onChange={(e) => updateRoom({ wallColor: e.target.value })} style={theme.colorPicker} />
                                <span style={theme.colorLabel}>{room.wallColor.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: 0 }} />

                <div style={theme.section}>
                    <div style={theme.sectionHeader}>
                        <Icons.Box />
                        <h3 style={theme.sectionTitle}>Catalogue</h3>
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

const SelectionBottomBar = () => {
    const items = useStore((state) => state.items);
    const selectedId = useStore((state) => state.selectedId);
    const updateItemConfig = useStore((state) => state.updateItemConfig);
    const updateItemDimensions = useStore((state) => state.updateItemDimensions);
    const updateItemRotation = useStore((state) => state.updateItemRotation);
    const deleteItem = useStore((state) => state.deleteItem);

    const selectedItem = items.find((item) => item.id === selectedId);

    if (!selectedItem) return null;

    return (
        <div style={theme.bottomBar}>
            
            <div style={theme.bottomBarSection}>
                <label style={theme.sectionTitle}>Dimensions</label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <select
                        value={selectedItem.dimensions.width}
                        onChange={(e) => updateItemDimensions(selectedId, { width: Number(e.target.value) })}
                        style={{ ...theme.select, width: "90px", height: "31px", padding: "0 10px" }}
                    >
                        {selectedItem.type === "island" ? (
                            <>
                                <option value={1200}>1200 mm</option>
                                <option value={1800}>1800 mm</option>
                                <option value={2400}>2400 mm</option>
                            </>
                        ) : (
                            <>
                                <option value={400}>400 mm</option>
                                <option value={600}>600 mm</option>
                                <option value={800}>800 mm</option>
                                <option value={1000}>1000 mm</option>
                            </>
                        )}
                    </select>
                    <button
                        onClick={() => updateItemRotation(selectedId, (selectedItem.rotation + 90) % 360)}
                        style={{ ...theme.btnOutline, height: "31px", padding: "0 12px" }}
                    >
                        <Icons.Rotate /> 90°
                    </button>
                </div>
            </div>

            <div style={theme.bottomBarSection}>
                <label style={theme.sectionTitle}>Finitions</label>
                <div style={{ display: "flex", gap: "8px" }}>
                    <div style={theme.colorPickerWrapper}>
                        <input
                            type="color"
                            value={selectedItem.config.couleurInt || "#e5e7eb"}
                            onChange={(e) => updateItemConfig(selectedId, { couleurInt: e.target.value })}
                            style={theme.colorPicker}
                        />
                        <span style={theme.colorLabel}>Caisson</span>
                    </div>
                    <div style={theme.colorPickerWrapper}>
                        <input
                            type="color"
                            value={selectedItem.config.couleurExt}
                            onChange={(e) => updateItemConfig(selectedId, { couleurExt: e.target.value })}
                            style={theme.colorPicker}
                        />
                        <span style={theme.colorLabel}>Façades</span>
                    </div>
                    {(selectedItem.type === "base_cabinet" || selectedItem.type === "island") && (
                        <div style={theme.colorPickerWrapper}>
                            <input
                                type="color"
                                value={selectedItem.config.couleurPlanTravail || "#daba9e"}
                                onChange={(e) => updateItemConfig(selectedId, { couleurPlanTravail: e.target.value })}
                                style={theme.colorPicker}
                            />
                            <span style={theme.colorLabel}>Plan</span>
                        </div>
                    )}
                </div>
            </div>

            <div style={theme.bottomBarSection}>
                <label style={theme.sectionTitle}>Options</label>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", height: "31px" }}>
                    <label style={{ ...theme.checkboxWrapper, border: "none", padding: 0 }}>
                        <input
                            type="checkbox"
                            checked={selectedItem.config.avecPoignees}
                            onChange={(e) => updateItemConfig(selectedId, { avecPoignees: e.target.checked })}
                            style={theme.checkbox}
                        />
                        <span style={{ ...theme.label, margin: 0, fontSize: "12px" }}>Poignées</span>
                    </label>

                    {selectedItem.type === "base_cabinet" && (
                        <label style={{ ...theme.checkboxWrapper, border: "none", padding: 0 }}>
                            <input
                                type="checkbox"
                                checked={selectedItem.config.isTiroirsInterieurs}
                                onChange={(e) => updateItemConfig(selectedId, { isTiroirsInterieurs: e.target.checked })}
                                style={theme.checkbox}
                            />
                            <span style={{ ...theme.label, margin: 0, fontSize: "12px" }}>Tiroirs</span>
                        </label>
                    )}

                    {(selectedItem.type === "base_cabinet" || selectedItem.type === "island" || selectedItem.type === "tall_cabinet") && (
                        <select
                            value={selectedItem.config.equipement || "none"}
                            onChange={(e) => updateItemConfig(selectedId, { equipement: e.target.value })}
                            style={{ ...theme.select, width: "110px", height: "31px", padding: "0 10px" }}
                        >
                            {selectedItem.type === "tall_cabinet" ? (
                                <>
                                    <option value="none">Aucun</option>
                                    <option value="oven_microwave">Fours</option>
                                </>
                            ) : (
                                <>
                                    <option value="none">Libre</option>
                                    <option value="sink">Évier</option>
                                    <option value="cooktop">Plaque</option>
                                </>
                            )}
                        </select>
                    )}
                </div>
            </div>

            <div style={theme.bottomBarSectionLast}>
                <button 
                    onClick={() => deleteItem(selectedId)} 
                    style={{ ...theme.btnDanger, height: "31px", marginTop: 0, padding: "0 16px" }}
                >
                    <Icons.Trash />
                </button>
            </div>

        </div>
    );
};

export default function KitchenConfigurator() {
    return (
        <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden", background: "#e2e8f0" }}>
            <Sidebar />
            <div style={{ flex: 1, position: "relative" }}>
                <SelectionBottomBar />
                <Canvas>
                    <KitchenScene />
                </Canvas>
            </div>
        </div>
    );
}