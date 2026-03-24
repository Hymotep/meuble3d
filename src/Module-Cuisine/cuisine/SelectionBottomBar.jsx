/**
 * ============================================================================
 * SELECTION BOTTOM BAR COMPONENT
 * ============================================================================
 *
 * Bottom bar that appears when a cabinet is selected.
 * Allows editing dimensions, rotation, colors, options, and delete items.
 */

import React from "react";
import { useStore } from "../store/store";
import { theme } from "../utils/theme";
import { Icons } from "./Icons";
import { CABINET_WIDTH_OPTIONS } from "../utils/constants";

const SelectionBottomBar = () => {
	const items = useStore((state) => state.items);
	const selectedId = useStore((state) => state.selectedId);
	const updateItemConfig = useStore((state) => state.updateItemConfig);
	const updateItemDimensions = useStore((state) => state.updateItemDimensions);
	const updateItemRotation = useStore((state) => state.updateItemRotation);
	const deleteItem = useStore((state) => state.deleteItem);

	const selectedItem = items.find((item) => item.id === selectedId);
	if (!selectedItem) return null;

	const isArchitecture = selectedItem.type === "window";
	const isIsland = selectedItem.type === "island";

	const getWidthOptions = () => {
		if (isIsland) return CABINET_WIDTH_OPTIONS.island;
		if (isArchitecture) return CABINET_WIDTH_OPTIONS.window;
		return CABINET_WIDTH_OPTIONS.standard;
	};

	const getEquipmentOptions = () => {
		if (selectedItem.type === "tall_cabinet") {
			return (
				<>
					<option value="none">Aucun</option>
					<option value="oven_microwave">Fours</option>
				</>
			);
		}
		return (
			<>
				<option value="none">Libre</option>
				<option value="sink">Évier</option>
				<option value="cooktop">Plaque</option>
			</>
		);
	};

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
						{getWidthOptions().map((w) => (
							<option key={w} value={w}>
								{w} mm
							</option>
						))}
					</select>
					<button
						onClick={() => updateItemRotation(selectedId, (selectedItem.rotation + 90) % 360)}
						style={{ ...theme.btnOutline, height: "31px", padding: "0 12px" }}
					>
						<Icons.Rotate /> 90°
					</button>
				</div>
			</div>

			{!isArchitecture && (
				<>
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
							{(selectedItem.type === "base_cabinet" || selectedItem.type === "island" || selectedItem.type === "tall_cabinet") && (
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

							<label style={{ ...theme.checkboxWrapper, border: "none", padding: 0 }}>
								<input
									type="checkbox"
									checked={selectedItem.config.useTextures || false}
									onChange={(e) => updateItemConfig(selectedId, { useTextures: e.target.checked })}
									style={theme.checkbox}
								/>
								<span style={{ ...theme.label, margin: 0, fontSize: "12px" }}>Textures PBR</span>
							</label>

							{(selectedItem.type === "base_cabinet" || selectedItem.type === "island" || selectedItem.type === "tall_cabinet") && (
								<select
									value={selectedItem.config.equipement || "none"}
									onChange={(e) => updateItemConfig(selectedId, { equipement: e.target.value })}
									style={{ ...theme.select, width: "110px", height: "31px", padding: "0 10px" }}
								>
									{getEquipmentOptions()}
								</select>
							)}
						</div>
					</div>
				</>
			)}

			<div style={theme.bottomBarSectionLast}>
				<button onClick={() => deleteItem(selectedId)} style={{ ...theme.btnDanger, height: "31px", marginTop: 0, padding: "0 16px" }}>
					<Icons.Trash />
				</button>
			</div>
		</div>
	);
};

export default SelectionBottomBar;
