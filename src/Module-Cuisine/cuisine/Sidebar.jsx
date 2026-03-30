import React, { useRef } from "react";
import { useStore } from "../store/store";
import { DEFAULT_CABINET_CONFIG } from "../utils/pricing";
import { CABINET_WIDTH_OPTIONS } from "../utils/constants";
import { theme } from "../utils/theme";
import { Icons } from "./Icons";

const RoomShapeBtn = ({ active, onClick, label, children }) => (
	<div
		onClick={onClick}
		style={{
			flex: 1,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			padding: "16px 4px",
			background: active ? "#eff6ff" : "#f9fafb",
			border: `1.5px solid ${active ? "#3b82f6" : "#e5e7eb"}`,
			borderRadius: "8px",
			cursor: "pointer",
			transition: "all 0.2s",
		}}
	>
		{children}
		<span style={{ fontSize: "11px", fontWeight: "600", color: active ? "#1d4ed8" : "#6b7280", marginTop: "12px", textAlign: "center" }}>
			{label}
		</span>
	</div>
);

// --- RESTAURATION DE TOUS LES PRESETS ---
const PRESETS = {
	lineaire: {
		items: (defaultConfig) => [
			{
				id: crypto.randomUUID(),
				type: "window",
				position: [900, 900, -1450],
				dimensions: { width: 1000, height: 1000, depth: 100 },
				rotation: 0,
				config: defaultConfig,
			},
			{
				id: crypto.randomUUID(),
				type: "tall_cabinet",
				position: [-900, 0, -1200],
				dimensions: { width: 600, height: 2100, depth: 600 },
				rotation: 0,
				config: { ...defaultConfig, equipement: "oven_microwave" },
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [-300, 0, -1200],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 0,
				config: { ...defaultConfig, isTiroirsInterieurs: true },
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [300, 0, -1200],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 0,
				config: { ...defaultConfig, equipement: "cooktop" },
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [900, 0, -1200],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 0,
				config: { ...defaultConfig, equipement: "sink" },
			},
			{
				id: crypto.randomUUID(),
				type: "wall_cabinet",
				position: [-300, 1400, -1325],
				dimensions: { width: 600, height: 700, depth: 350 },
				rotation: 0,
				config: defaultConfig,
			},
			{
				id: crypto.randomUUID(),
				type: "wall_cabinet",
				position: [300, 1400, -1325],
				dimensions: { width: 600, height: 700, depth: 350 },
				rotation: 0,
				config: defaultConfig,
			},
		],
	},
	L: {
		items: (defaultConfig) => [
			{
				id: crypto.randomUUID(),
				type: "window",
				position: [-1950, 900, -600],
				dimensions: { width: 1000, height: 1000, depth: 100 },
				rotation: 90,
				config: defaultConfig,
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [-1700, 0, -600],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 270,
				config: { ...defaultConfig, equipement: "sink" },
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [-1700, 0, 0],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 270,
				config: { ...defaultConfig, isTiroirsInterieurs: true },
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [-1100, 0, -1200],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 0,
				config: { ...defaultConfig, equipement: "cooktop" },
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [-500, 0, -1200],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 0,
				config: defaultConfig,
			},
			{
				id: crypto.randomUUID(),
				type: "tall_cabinet",
				position: [100, 0, -1200],
				dimensions: { width: 600, height: 2100, depth: 600 },
				rotation: 0,
				config: { ...defaultConfig, equipement: "oven_microwave" },
			},
		],
	},
	U: {
		items: (defaultConfig) => [
			{
				id: crypto.randomUUID(),
				type: "window",
				position: [100, 900, -1450],
				dimensions: { width: 1000, height: 1000, depth: 100 },
				rotation: 0,
				config: defaultConfig,
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [-1700, 0, 0],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 270,
				config: defaultConfig,
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [-1700, 0, 600],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 270,
				config: { ...defaultConfig, equipement: "sink" },
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [-1100, 0, -1200],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 0,
				config: { ...defaultConfig, isTiroirsInterieurs: true },
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [-500, 0, -1200],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 0,
				config: defaultConfig,
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [100, 0, -1200],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 0,
				config: defaultConfig,
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [700, 0, -1200],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 0,
				config: { ...defaultConfig, equipement: "cooktop" },
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [1700, 0, 0],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 90,
				config: defaultConfig,
			},
			{
				id: crypto.randomUUID(),
				type: "tall_cabinet",
				position: [1700, 0, 600],
				dimensions: { width: 600, height: 2100, depth: 600 },
				rotation: 90,
				config: { ...defaultConfig, equipement: "oven_microwave" },
			},
		],
	},
	ilot: {
		items: (defaultConfig) => [
			{
				id: crypto.randomUUID(),
				type: "window",
				position: [600, 900, -1450],
				dimensions: { width: 1000, height: 1000, depth: 100 },
				rotation: 0,
				config: defaultConfig,
			},
			{
				id: crypto.randomUUID(),
				type: "tall_cabinet",
				position: [-1200, 0, -1200],
				dimensions: { width: 600, height: 2100, depth: 600 },
				rotation: 0,
				config: { ...defaultConfig, equipement: "oven_microwave" },
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [-600, 0, -1200],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 0,
				config: { ...defaultConfig, isTiroirsInterieurs: true },
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [0, 0, -1200],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 0,
				config: { ...defaultConfig, equipement: "cooktop" },
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [600, 0, -1200],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 0,
				config: defaultConfig,
			},
			{
				id: crypto.randomUUID(),
				type: "tall_cabinet",
				position: [1200, 0, -1200],
				dimensions: { width: 600, height: 2100, depth: 600 },
				rotation: 0,
				config: defaultConfig,
			},
			{
				id: crypto.randomUUID(),
				type: "island",
				position: [0, 0, 200],
				dimensions: { width: 1800, height: 900, depth: 900 },
				rotation: 0,
				config: { ...defaultConfig, equipement: "sink" },
			},
		],
	},
	parallele: {
		items: (defaultConfig) => [
			{
				id: crypto.randomUUID(),
				type: "window",
				position: [0, 900, -1450],
				dimensions: { width: 1000, height: 1000, depth: 100 },
				rotation: 0,
				config: defaultConfig,
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [-600, 0, -1200],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 0,
				config: { ...defaultConfig, isTiroirsInterieurs: true },
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [0, 0, -1200],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 0,
				config: { ...defaultConfig, equipement: "cooktop" },
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [600, 0, -1200],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 0,
				config: defaultConfig,
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [-600, 0, 0],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 180,
				config: defaultConfig,
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [0, 0, 0],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 180,
				config: { ...defaultConfig, equipement: "sink" },
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [600, 0, 0],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 180,
				config: { ...defaultConfig, isTiroirsInterieurs: true },
			},
		],
	},
	studio: {
		items: (defaultConfig) => [
			{
				id: crypto.randomUUID(),
				type: "tall_cabinet",
				position: [-600, 0, -1200],
				dimensions: { width: 600, height: 2100, depth: 600 },
				rotation: 0,
				config: { ...defaultConfig, equipement: "oven_microwave" },
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [0, 0, -1200],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 0,
				config: { ...defaultConfig, equipement: "sink" },
			},
			{
				id: crypto.randomUUID(),
				type: "base_cabinet",
				position: [600, 0, -1200],
				dimensions: { width: 600, height: 812, depth: 600 },
				rotation: 0,
				config: { ...defaultConfig, equipement: "cooktop" },
			},
			{
				id: crypto.randomUUID(),
				type: "wall_cabinet",
				position: [0, 1400, -1325],
				dimensions: { width: 600, height: 700, depth: 350 },
				rotation: 0,
				config: defaultConfig,
			},
			{
				id: crypto.randomUUID(),
				type: "wall_cabinet",
				position: [600, 1400, -1325],
				dimensions: { width: 600, height: 700, depth: 350 },
				rotation: 0,
				config: defaultConfig,
			},
		],
	},
};

const Sidebar = () => {
	const {
		room,
		items,
		updateRoom,
		addItem,
		loadState,
		autoFitWall,
		activeTab,
		setActiveTab,
		isEditingItem,
		setIsEditingItem,
		selectedId,
		updateItemDimensions,
		updateItemConfig,
	} = useStore();

	const fileInputRef = useRef(null);

	// --- RESTAURATION DE LA LOGIQUE DES PRESETS ET SAUVEGARDE ---
	const loadPreset = (presetName) => {
		const preset = PRESETS[presetName];
		if (!preset) return;
		const presetItems = preset.items(DEFAULT_CABINET_CONFIG);
		loadState({ room: room, items: presetItems });
		if (room.wallCount === 1) {
			setTimeout(() => {
				useStore.getState().autoFitWall();
			}, 100);
		}
	};

	const handleExport = () => {
		const itemsToSave = useStore.getState().items;
		const dataToSave = { room, items: itemsToSave };
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
									onChange={(e) => updateItemConfig(selectedId, { equipement: e.target.value })}
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

	const generateCabinet = (type, dimensions) => {
		let posY = type === "wall_cabinet" ? 1400 : type === "window" ? 900 : 0;
		let posZ = type === "window" ? -room.depth / 2 + dimensions.depth / 2 : 0;
		addItem({ id: crypto.randomUUID(), type, position: [0, posY, posZ], dimensions, config: DEFAULT_CABINET_CONFIG });
	};

	return (
		<div style={theme.panel}>
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
				{/* --- Boutons globaux Save/Load --- */}
				<div style={theme.buttonRow}>
					<button onClick={handleExport} style={theme.btnOutline}>
						<Icons.Save /> Exporter
					</button>
					<button onClick={() => fileInputRef.current?.click()} style={theme.btnOutline}>
						<Icons.Folder /> Importer
					</button>
					<input type="file" accept=".json" ref={fileInputRef} style={{ display: "none" }} onChange={handleImport} />
				</div>

				{/* --- ONGLET PIÈCE --- */}
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

				{/* --- ONGLET MEUBLES --- */}
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

				{/* --- ONGLET INSPIRATIONS --- */}
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
		</div>
	);
};

export default Sidebar;
