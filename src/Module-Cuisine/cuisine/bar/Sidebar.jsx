/**
 * ============================================================================
 * SIDEBAR COMPONENT
 * ============================================================================
 * Interface utilisateur principale pour la configuration de la pièce et
 * l'ajout de meubles. (Logique extraite dans useSidebarActions).
 */

import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../store/store";
import { CABINET_WIDTH_OPTIONS } from "../../utils/Sidebar/constants";
import { DEFAULT_CABINET_CONFIG } from "../../utils/Sidebar/pricing";
import { theme } from "../../utils/Sidebar/theme";

import { Icons } from "../ui/Icons";
import { useSidebarActions } from "../hooks/Sidebar/useSidebarActions";

// --- COMPOSANT BOUTON FORME PIÈCE (Gardé ici car c'est purement de l'UI) ---
const RoomShapeBtn = ({ active, onClick, label, children }) => (
	<button
		onClick={onClick}
		style={{
			...theme.btnSecondary,
			flex: 1,
			height: "70px",
			flexDirection: "column",
			gap: "8px",
			background: active ? "#111827" : "#ffffff",
			color: active ? "#ffffff" : "#111827",
			borderColor: active ? "#111827" : "#d1d5db",
			padding: "10px 4px",
		}}
	>
		{children}
		<span style={{ fontSize: "11px", fontWeight: "600" }}>{label}</span>
	</button>
);

const Sidebar = () => {
	// 1. Accès à l'état global (Zustand)
	const {
		room,
		items,
		updateRoom,
		autoFitWall,
		activeTab,
		setActiveTab,
		isEditingItem,
		setIsEditingItem,
		selectedId,
		updateItemDimensions,
		updateItemConfig,
		addItem,
	} = useStore();

	// 2. Fonctions logiques (Custom Hook)
	const { loadPreset, handleExport, handleImport, generateCabinet, handleEquipmentChange } = useSidebarActions();

	const fileInputRef = useRef(null);

	// --- GESTION DU MODE ÉDITION D'UN MEUBLE ---
	if (isEditingItem && selectedId) {
		const item = items.find((i) => i.id === selectedId);
		if (!item) return null;

		const isArchitecture = item.type === "window";
		const getWidthOptions = () =>
			isArchitecture ? CABINET_WIDTH_OPTIONS.window : item.type === "island" ? CABINET_WIDTH_OPTIONS.island : CABINET_WIDTH_OPTIONS.standard;

		return (
			<div style={theme.panel}>
				<div style={{ ...theme.header, display: "flex", alignItems: "center", gap: "12px", paddingBottom: "16px" }}>
					<button
						onClick={() => setIsEditingItem(false)}
						style={{
							background: "transparent",
							border: "none",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							color: "#6b7280",
							padding: 0,
						}}
					>
						<Icons.ChevronLeft />
					</button>
					<div>
						<h1 style={{ ...theme.titleH1, fontSize: "18px" }}>Modifier le meuble</h1>
					</div>
				</div>

				<div style={theme.scrollArea}>
					<div style={theme.section}>
						<label style={theme.label}>Largeur (mm)</label>
						<select
							value={item.dimensions.width}
							onChange={(e) => updateItemDimensions(selectedId, { width: Number(e.target.value) })}
							style={theme.select}
						>
							{getWidthOptions().map((w) => (
								<option key={w} value={w}>
									{w} mm
								</option>
							))}
						</select>
					</div>

					{!isArchitecture && (
						<>
							<div style={theme.section}>
								<label style={theme.label}>Couleurs</label>
								<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
									<div style={theme.colorPickerWrapper}>
										<input
											type="color"
											value={item.config.couleurInt}
											onChange={(e) => updateItemConfig(selectedId, { couleurInt: e.target.value })}
											style={theme.colorPicker}
										/>
										<span style={theme.colorLabel}>Caisson intérieur</span>
									</div>
									<div style={theme.colorPickerWrapper}>
										<input
											type="color"
											value={item.config.couleurExt}
											onChange={(e) => updateItemConfig(selectedId, { couleurExt: e.target.value })}
											style={theme.colorPicker}
										/>
										<span style={theme.colorLabel}>Façades</span>
									</div>
									{item.type !== "wall_cabinet" && (
										<div style={theme.colorPickerWrapper}>
											<input
												type="color"
												value={item.config.couleurPlanTravail}
												onChange={(e) => updateItemConfig(selectedId, { couleurPlanTravail: e.target.value })}
												style={theme.colorPicker}
											/>
											<span style={theme.colorLabel}>Plan de travail</span>
										</div>
									)}
								</div>
							</div>

							<div style={theme.section}>
								<label style={theme.label}>Équipement</label>
								<select
									value={item.config.equipement || "none"}
									onChange={(e) => handleEquipmentChange(selectedId, e.target.value)}
									style={theme.select}
								>
									{item.type === "tall_cabinet" ? (
										<>
											<option value="none">Aucun</option>
											<option value="oven_microwave">Fours encastrés</option>
										</>
									) : (
										<>
											<option value="none">Libre</option>
											<option value="sink">Évier</option>
											<option value="cooktop">Plaque de cuisson</option>
											<option value="dishwasher_45">Lave-vaisselle (45 cm)</option>
											<option value="dishwasher_60">Lave-vaisselle (60 cm)</option>
										</>
									)}
								</select>
							</div>

							<div style={theme.section}>
								<label style={theme.label}>Options</label>
								<label style={{ ...theme.checkboxWrapper, border: "none", padding: 0 }}>
									<input
										type="checkbox"
										checked={item.config.avecPoignees}
										onChange={(e) => updateItemConfig(selectedId, { avecPoignees: e.target.checked })}
										style={theme.checkbox}
									/>
									<span style={{ ...theme.label, margin: 0, fontSize: "14px" }}>Poignées</span>
								</label>
								{item.type === "base_cabinet" && (
									<label style={{ ...theme.checkboxWrapper, border: "none", padding: 0, marginTop: "8px" }}>
										<input
											type="checkbox"
											checked={item.config.isTiroirsInterieurs}
											onChange={(e) => updateItemConfig(selectedId, { isTiroirsInterieurs: e.target.checked })}
											style={theme.checkbox}
										/>
										<span style={{ ...theme.label, margin: 0, fontSize: "14px" }}>Tiroirs casseroliers</span>
									</label>
								)}
							</div>
						</>
					)}
				</div>
			</div>
		);
	}

	// --- MODE NORMAL (ONGLETS) ---
	const tabStyle = (isActive) => ({
		flex: 1,
		textAlign: "center",
		padding: "14px 0",
		cursor: "pointer",
		fontSize: "13px",
		fontWeight: isActive ? "700" : "500",
		color: isActive ? "#111827" : "#6b7280",
		borderBottom: isActive ? "2px solid #111827" : "2px solid transparent",
		transition: "all 0.2s",
	});

	return (
		<div style={theme.panel}>
			{/* Header */}
			<div style={{ ...theme.header, paddingBottom: "12px", borderBottom: "none" }}>
				<Link
					to="/dressing"
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: "4px",
						color: "#6b7280",
						fontSize: "12px",
						textDecoration: "none",
						fontWeight: "500",
						marginBottom: "16px",
					}}
				>
					<Icons.ChevronLeft /> Retour au dressing
				</Link>
				<h1 style={{ ...theme.titleH1, fontSize: "18px", marginBottom: "2px" }}>Studio Design 3D</h1>
				<p style={{ ...theme.subtitle, fontSize: "11px", margin: 0, marginBottom: "16px" }}>Configurez votre cuisine sur mesure</p>
			</div>

			{/* Tabs */}
			<div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", background: "#fff" }}>
				<div onClick={() => setActiveTab("room")} style={tabStyle(activeTab === "room")}>
					Pièce
				</div>
				<div onClick={() => setActiveTab("catalog")} style={tabStyle(activeTab === "catalog")}>
					Meubles
				</div>
				<div onClick={() => setActiveTab("presets")} style={tabStyle(activeTab === "presets")}>
					Inspirations
				</div>
			</div>

			<div style={theme.scrollArea}>
				{/* ONGLET PIÈCE */}
				{activeTab === "room" && (
					<div style={theme.section}>
						<div style={{ display: "flex", gap: "8px", marginBottom: "16px", marginTop: "8px" }}>
							<RoomShapeBtn active={room.wallCount === 3} onClick={() => updateRoom({ wallCount: 3 })} label="Rectangulaire">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
									<path d="M4 20V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" />
								</svg>
							</RoomShapeBtn>
							<RoomShapeBtn active={room.wallCount === 2} onClick={() => updateRoom({ wallCount: 2 })} label="En L">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
									<path d="M4 4v14a2 2 0 0 0 2 2h14" />
								</svg>
							</RoomShapeBtn>
							<RoomShapeBtn active={room.wallCount === 1} onClick={() => updateRoom({ wallCount: 1 })} label="Ouvert">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
									<line x1="2" y1="12" x2="22" y2="12" />
								</svg>
							</RoomShapeBtn>
						</div>
						<div style={theme.inputGroup}>
							<div style={{ ...theme.sliderHeader }}>
								<label style={theme.label}>Largeur mur</label>
								<span style={theme.valueBadge}>{room.width} mm</span>
							</div>
							<input
								type="range"
								min="1500"
								max="8000"
								step="50"
								value={room.width}
								onChange={(e) => updateRoom({ width: Number(e.target.value) })}
								style={theme.slider}
							/>
						</div>
						<div style={{ ...theme.inputGroup, marginTop: "12px" }}>
							<div style={theme.sliderHeader}>
								<label style={theme.label}>Profondeur</label>
								<span style={theme.valueBadge}>{room.depth} mm</span>
							</div>
							<input
								type="range"
								min="1500"
								max="8000"
								step="50"
								value={room.depth}
								onChange={(e) => updateRoom({ depth: Number(e.target.value) })}
								style={theme.slider}
							/>
						</div>
						<div style={{ ...theme.inputGroup, marginTop: "16px" }}>
							<label style={theme.label}>Peinture Murs</label>
							<div style={theme.colorPickerWrapper}>
								<input
									type="color"
									value={room.wallColor}
									onChange={(e) => updateRoom({ wallColor: e.target.value })}
									style={{ ...theme.colorPicker, width: "100%" }}
								/>
							</div>
						</div>
					</div>
				)}

				{/* ONGLET MEUBLES */}
				{activeTab === "catalog" && (
					<div style={theme.section}>
						<div style={{ ...theme.grid2, marginTop: "8px" }}>
							<button
								onClick={() => generateCabinet("base_cabinet", { width: 600, height: 812, depth: 600 })}
								style={{ ...theme.btnSecondary, height: "80px", flexDirection: "column" }}
							>
								<Icons.Plus /> Bas
							</button>
							<button
								onClick={() => generateCabinet("tall_cabinet", { width: 600, height: 2100, depth: 600 })}
								style={{ ...theme.btnSecondary, height: "80px", flexDirection: "column" }}
							>
								<Icons.Plus /> Colonne
							</button>
							<button
								onClick={() => generateCabinet("wall_cabinet", { width: 600, height: 700, depth: 350 })}
								style={{ ...theme.btnSecondary, height: "80px", flexDirection: "column" }}
							>
								<Icons.Plus /> Haut
							</button>
							<button
								onClick={() =>
									addItem({
										id: crypto.randomUUID(),
										type: "island",
										position: [0, 0, 0],
										dimensions: { width: 1800, height: 900, depth: 900 },
										config: { ...DEFAULT_CABINET_CONFIG, couleurExt: "#1e3a8a" },
									})
								}
								style={{
									...theme.btnSecondary,
									height: "80px",
									flexDirection: "column",
									background: "#111827",
									color: "#fff",
									borderColor: "#111827",
								}}
							>
								<Icons.Plus /> Îlot
							</button>
						</div>
						<button
							onClick={() => generateCabinet("window", { width: 1000, height: 1000, depth: 100 })}
							style={{ ...theme.btnOutline, marginTop: "16px", borderColor: "#94a3b8", color: "#475569" }}
						>
							<Icons.Window /> Ajouter une Fenêtre
						</button>
						{items.length > 0 && (
							<button
								onClick={() => autoFitWall()}
								style={{ ...theme.btnSecondary, background: "#f1f5f9", borderColor: "#cbd5e1", marginTop: "16px" }}
							>
								<Icons.Magic /> Ajuster au mur
							</button>
						)}
					</div>
				)}

				{/* ONGLET INSPIRATIONS */}
				{activeTab === "presets" && (
					<div style={{ ...theme.section, marginTop: "8px" }}>
						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
							<button onClick={() => loadPreset("lineaire")} style={theme.btnSecondary}>
								Linéaire
							</button>
							<button onClick={() => loadPreset("L")} style={theme.btnSecondary}>
								Cuisine en L
							</button>
							<button onClick={() => loadPreset("U")} style={theme.btnSecondary}>
								Cuisine en U
							</button>
							<button onClick={() => loadPreset("ilot")} style={theme.btnSecondary}>
								Avec Îlot
							</button>
							<button onClick={() => loadPreset("parallele")} style={theme.btnSecondary}>
								Parallèle
							</button>
							<button onClick={() => loadPreset("studio")} style={theme.btnSecondary}>
								Studio Compact
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Boutons de sauvegarde */}
			<div style={{ padding: "16px", borderTop: "1px solid #e5e7eb", background: "#fff", display: "flex", gap: "8px" }}>
				<button onClick={handleExport} style={theme.btnOutline}>
					<Icons.Save /> Sauvegarder
				</button>
				<button onClick={() => fileInputRef.current?.click()} style={theme.btnOutline}>
					<Icons.Folder /> Charger
				</button>
				<input type="file" accept=".json" ref={fileInputRef} style={{ display: "none" }} onChange={handleImport} />
			</div>
		</div>
	);
};

export default Sidebar;
