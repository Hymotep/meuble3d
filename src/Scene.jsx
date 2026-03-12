import React, { useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { useStore } from "../src/store/store";
import { useDrag } from "@use-gesture/react";
import * as THREE from "three";

// IMPORT DE TON VRAI CAISSON
import { Caisson } from "./components/Caisson"; 

// --- 1. LE COMPOSANT CAISSON RÉEL ET DRAGGABLE (Axé sur le Centre) ---
const DraggableCaisson = ({ position, dimensions, isSelected, id }) => {
    const meshRef = useRef();
    const { camera, controls } = useThree();
    const items = useStore((state) => state.items);
    const room = useStore((state) => state.room); 
    const setSelectedId = useStore((state) => state.setSelectedId);
    const setDraggedId = useStore((state) => state.setDraggedId);
    const updateItemPosition = useStore((state) => state.updateItemPosition);
    const dragOffset = useRef(new THREE.Vector3());

    // On récupère la rotation depuis le store
    const currentItem = items.find(i => i.id === id);
    const rotationDeg = currentItem?.rotation || 0;
    // Conversion en radians (-Math.PI/2 = rotation horaire)
    const rotationRad = -(rotationDeg * Math.PI) / 180; 

    const w = dimensions.width / 1000;
    const h = dimensions.height / 1000;
    const d = dimensions.depth / 1000;

    // --- CALCUL DE L'ENCOMBREMENT RÉEL ---
    // Si le meuble est tourné à 90° ou 270°, sa largeur physique devient sa profondeur, et vice versa !
    const isRotated = rotationDeg === 90 || rotationDeg === 270;
    const worldW = isRotated ? d : w; 
    const worldD = isRotated ? w : d;

    const bind = useDrag(({ active, first, last, event }) => {
        const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1
        );
        raycaster.setFromCamera(mouse, camera);
        const intersectPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(floorPlane, intersectPoint);

        if (first) {
            event.stopPropagation();
            setSelectedId(id);
            setDraggedId(id);
            if (controls) controls.enabled = false;
            if (meshRef.current) dragOffset.current.copy(intersectPoint).sub(meshRef.current.position);
        }

        if (active && meshRef.current) {
            // newX et newZ représentent maintenant le CENTRE EXACT du meuble
            let newX = intersectPoint.x - dragOffset.current.x;
            let newZ = intersectPoint.z - dragOffset.current.z;

            const SNAP_DISTANCE = 0.15; 

            // --- 1. BLOCAGE STRICT CONTRE LES MURS (Basé sur le centre) ---
            const roomW = room.width / 1000;
            const roomD = room.depth / 1000;
            const murGauche = -roomW / 2 + worldW / 2; // Le centre s'arrête à moitié de largeur du mur
            const murDroit = roomW / 2 - worldW / 2;
            const murFond = -roomD / 2 + worldD / 2;
            const murFace = roomD / 2 - worldD / 2;

            if (newX < murGauche) newX = murGauche;
            if (newX > murDroit) newX = murDroit;
            if (newZ < murFond) newZ = murFond;
            if (newZ > murFace) newZ = murFace;

            // --- 2. MAGNÉTISME ENTRE CAISSONS ---
            items.forEach((otherItem) => {
                if (otherItem.id === id) return;

                const otherRot = otherItem.rotation || 0;
                const otherIsRot = otherRot === 90 || otherRot === 270;
                const otherW = (otherIsRot ? otherItem.dimensions.depth : otherItem.dimensions.width) / 1000;
                const otherD = (otherIsRot ? otherItem.dimensions.width : otherItem.dimensions.depth) / 1000;
                
                const otherX = otherItem.position[0] / 1000;
                const otherZ = otherItem.position[2] / 1000;

                // Magnétisme Gauche/Droite
                if (Math.abs((newX + worldW/2) - (otherX - otherW/2)) < SNAP_DISTANCE) newX = otherX - otherW/2 - worldW/2;
                else if (Math.abs((newX - worldW/2) - (otherX + otherW/2)) < SNAP_DISTANCE) newX = otherX + otherW/2 + worldW/2;

                // Magnétisme Avant/Arrière (On aligne les DOS des meubles, c'est le plus logique pour une cuisine)
                if (Math.abs((newZ - worldD/2) - (otherZ - otherD/2)) < SNAP_DISTANCE) newZ = otherZ - otherD/2 + worldD/2;
                else if (Math.abs((newZ + worldD/2) - (otherZ + otherD/2)) < SNAP_DISTANCE) newZ = otherZ + otherD/2 - worldD/2;
            });

            meshRef.current.position.x = newX;
            meshRef.current.position.z = newZ;
        }

        if (last) {
            setDraggedId(null);
            if (controls) controls.enabled = true;
            if (meshRef.current) updateItemPosition(id, [meshRef.current.position.x * 1000, 0, meshRef.current.position.z * 1000]);
        }
    });

    return (
        <group 
            ref={meshRef} 
            {...bind()} 
            position={[position[0] / 1000, 0, position[2] / 1000]}
            rotation={[0, rotationRad, 0]} // ON APPLIQUE LA ROTATION ICI !
        >
            {/* L'astuce magique : On décale le visuel de -w/2 et -d/2 pour que le (0,0,0) du groupe parent soit exactement au centre du caisson ! */}
            <group position={[-w / 2, 0, -d / 2]}>
                <mesh position={[w / 2, h / 2, d / 2]}>
                    <boxGeometry args={[w, h, d]} />
                    <meshBasicMaterial visible={false} /> 
                </mesh>
                <Caisson 
                    largeur={dimensions.width} 
                    hauteur={dimensions.height} 
                    profondeur={dimensions.depth} 
                    activeConfig={4}
                    isSelected={isSelected} 
                    finitionExt="Couleur"
                    couleurExt="#e2b388"
                    finitionInt="Couleur"
                    couleurInt="#ffffff"
                    avecPoignees={true} 
                    couleurPoignees="#222222"
                    isTiroirsInterieurs={false}
                    isRightHinge={false}
                    onClick={(e) => e.stopPropagation()} 
                />
            </group>
        </group>
    );
};
// --- 2. LA SCÈNE ---
const KitchenScene = () => {
    const { room, items, selectedId, draggedId, setSelectedId } = useStore();

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />

            {/* Le sol ne sert plus qu'à l'affichage et à désélectionner */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]} onPointerDown={() => setSelectedId(null)}>
                <planeGeometry args={[room.width / 1000, room.depth / 1000]} />
                <meshStandardMaterial color="#e5e7eb" />
            </mesh>

            <Grid args={[room.width / 1000, room.depth / 1000]} infiniteGrid fadeDistance={10} />

            {/* BOUCLE D'AFFICHAGE DES CAISSONS */}
            {items.map((item) => (
                <DraggableCaisson 
                    key={item.id} 
                    id={item.id} 
                    position={item.position} 
                    dimensions={item.dimensions} 
                    isSelected={selectedId === item.id} 
                />
            ))}

            {/* La caméra est désactivée SEULEMENT si un objet est en cours de drag */}
            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} enabled={!draggedId} />
        </>
    );
};

const Sidebar = () => {
    const items = useStore((state) => state.items);
    const selectedId = useStore((state) => state.selectedId);
    const addItem = useStore((state) => state.addItem);
    const updateItemRotation = useStore((state) => state.updateItemRotation);

    // On récupère le meuble actuellement sélectionné
    const selectedItem = items.find(item => item.id === selectedId);

    const handleAddCabinet = () => {
        const newCabinet = {
            id: crypto.randomUUID(),
            type: "base_cabinet",
            position: [0, 0, 0], // Position centrale
            dimensions: { width: 600, height: 812, depth: 600 },
        };
        addItem(newCabinet);
    };

    const handleRotate = () => {
        if (selectedItem) {
            // On ajoute 90° et on boucle (0, 90, 180, 270, 0...)
            const nextRotation = (selectedItem.rotation + 90) % 360;
            updateItemRotation(selectedId, nextRotation);
        }
    };

    return (
        <div style={{ width: "300px", background: "#fff", padding: "20px", boxShadow: "2px 0 5px rgba(0,0,0,0.1)", zIndex: 10, display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
                <h2>Catalogue</h2>
                <button onClick={handleAddCabinet} style={{ width: "100%", padding: "10px", background: "#3b82f6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px" }}>
                    + Ajouter Caisson Bas
                </button>
            </div>

            {/* LE PANNEAU D'ÉDITION (Visible uniquement si un meuble est sélectionné) */}
            {selectedItem && (
                <div style={{ padding: "15px", background: "#f3f4f6", borderRadius: "8px" }}>
                    <h3 style={{ marginTop: 0 }}>Édition</h3>
                    <p style={{ fontSize: "14px", color: "#666" }}>Caisson sélectionné.</p>
                    <button onClick={handleRotate} style={{ width: "100%", padding: "10px", background: "#10b981", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                        ↻ Pivoter (90°)
                    </button>
                </div>
            )}
        </div>
    );
};

// --- 4. LE COMPOSANT PRINCIPAL (Layout) ---
export default function KitchenConfigurator() {
    const setSelectedId = useStore((state) => state.setSelectedId);

    return (
        <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
            <Sidebar />
            <div style={{ flex: 1, position: "relative" }} onPointerMissed={() => setSelectedId(null)}>
                <Canvas camera={{ position: [0, 2, 4], fov: 45 }}>
                    <KitchenScene />
                </Canvas>
            </div>
        </div>
    );
}