/**
 * ============================================================================
 * USE SIDEBAR ACTIONS HOOK
 * ============================================================================
 * Gère la logique métier de la Sidebar : Import/Export, chargement de presets,
 * et génération de meubles.
 */

import { useStore } from "../../../store/store";
import { DEFAULT_CABINET_CONFIG } from "../../../utils/Sidebar/pricing";
import { PRESETS } from "../../presets/presets";

export const useSidebarActions = () => {
	const room = useStore((s) => s.room);
	const loadState = useStore((s) => s.loadState);
	const addItem = useStore((s) => s.addItem);
	const updateItemConfig = useStore((s) => s.updateItemConfig);
	const updateItemDimensions = useStore((s) => s.updateItemDimensions);

	// Charger une cuisine prédéfinie
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

	// Exporter le projet en JSON
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

	// Importer un projet JSON
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
				alert("Erreur de lecture du fichier.");
			}
		};
		reader.readAsText(file);
		event.target.value = null; // Reset de l'input
	};

	// Générer un nouveau meuble
	const generateCabinet = (type, dimensions) => {
		let posY = type === "wall_cabinet" ? 1400 : type === "window" ? 900 : 0;
		let posZ = type === "window" ? -room.depth / 2 + dimensions.depth / 2 : 0;

		addItem({
			id: crypto.randomUUID(),
			type,
			position: [0, posY, posZ],
			dimensions,
			config: DEFAULT_CABINET_CONFIG,
		});
	};

	// Gérer le changement d'équipement (ex: Lave-vaisselle)
	const handleEquipmentChange = (selectedId, val) => {
		updateItemConfig(selectedId, { equipement: val });

		if (val === "dishwasher_45") {
			updateItemDimensions(selectedId, { width: 450 });
		} else if (val === "dishwasher_60") {
			updateItemDimensions(selectedId, { width: 600 });
		}
	};

	return {
		loadPreset,
		handleExport,
		handleImport,
		generateCabinet,
		handleEquipmentChange,
	};
};
