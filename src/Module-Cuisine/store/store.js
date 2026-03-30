import { create } from "zustand";

export const useStore = create((set) => ({
	room: { width: 4000, depth: 3000, height: 2500, wallCount: 3, wallColor: "#f3f4f6" },
	items: [],
	selectedId: null,
	draggedId: null,

	// --- NOUVEAUX ÉTATS POUR L'INTERFACE INTELLIGENTE ---
	viewMode: "3D",
	setViewMode: (mode) => set({ viewMode: mode }),
	activeTab: "room", // Onglets de la sidebar: 'room', 'catalog', 'presets'
	setActiveTab: (tab) => set({ activeTab: tab }),
	isEditingItem: false, // Savoir si le panneau latéral doit afficher les options du meuble
	setIsEditingItem: (val) => set({ isEditingItem: val }),
	cameraAction: null, // Pour déclencher le zoom depuis l'interface HTML vers la 3D
	triggerCameraAction: (action) => set({ cameraAction: action }),

	updateRoom: (newSettings) =>
		set((state) => ({
			room: { ...state.room, ...newSettings },
		})),

	addItem: (newItem) =>
		set((state) => ({
			items: [...state.items, { rotation: 0, ...newItem }],
		})),

	updateItemPosition: (id, newPosition) =>
		set((state) => ({
			items: state.items.map((item) => (item.id === id ? { ...item, position: newPosition } : item)),
		})),

	updateItemRotation: (id, newRotation) =>
		set((state) => ({
			items: state.items.map((item) => (item.id === id ? { ...item, rotation: newRotation } : item)),
		})),

	updateItemConfig: (id, newConfig) =>
		set((state) => ({
			items: state.items.map((item) => (item.id === id ? { ...item, config: { ...item.config, ...newConfig } } : item)),
		})),

	updateItemDimensions: (id, newDimensions) =>
		set((state) => {
			const targetItem = state.items.find((i) => i.id === id);
			if (!targetItem) return state;

			const isRotated = targetItem.rotation === 90 || targetItem.rotation === 270;
			const newW = newDimensions.width !== undefined ? newDimensions.width : targetItem.dimensions.width;
			const newD = newDimensions.depth !== undefined ? newDimensions.depth : targetItem.dimensions.depth;

			const oldWorldW = isRotated ? targetItem.dimensions.depth : targetItem.dimensions.width;
			const newWorldW = isRotated ? newD : newW;
			const deltaX = newWorldW - oldWorldW;

			const oldWorldD = isRotated ? targetItem.dimensions.width : targetItem.dimensions.depth;
			const newWorldD = isRotated ? newW : newD;
			const deltaZ = newWorldD - oldWorldD;

			const newItems = state.items.map((item) => {
				if (item.id === id) {
					return { ...item, dimensions: { ...item.dimensions, ...newDimensions } };
				}
				let nx = item.position[0];
				let ny = item.position[1];
				let nz = item.position[2];

				if (Math.abs(item.position[2] - targetItem.position[2]) < oldWorldD / 2 + 50) {
					if (deltaX !== 0) {
						if (item.position[0] > targetItem.position[0] + 10) nx += deltaX / 2;
						else if (item.position[0] < targetItem.position[0] - 10) nx -= deltaX / 2;
					}
				}
				if (Math.abs(item.position[0] - targetItem.position[0]) < oldWorldW / 2 + 50) {
					if (deltaZ !== 0) {
						if (item.position[2] > targetItem.position[2] + 10) nz += deltaZ / 2;
						else if (item.position[2] < targetItem.position[2] - 10) nz -= deltaZ / 2;
					}
				}

				const itemIsRotated = item.rotation === 90 || item.rotation === 270;
				const itemW = itemIsRotated ? item.dimensions.depth : item.dimensions.width;
				const itemD = itemIsRotated ? item.dimensions.width : item.dimensions.depth;

				const murGauche = -state.room.width / 2 + itemW / 2;
				const murDroit = state.room.width / 2 - itemW / 2;
				const murFond = -state.room.depth / 2 + itemD / 2;
				const murFace = state.room.depth / 2 - itemD / 2;

				if (nx < murGauche) nx = murGauche;
				if (nx > murDroit) nx = murDroit;
				if (nz < murFond) nz = murFond;
				if (nz > murFace) nz = murFace;

				return { ...item, position: [nx, ny, nz] };
			});

			return { items: newItems };
		}),

	autoFitWall: () =>
		set((state) => {
			if (state.room.wallCount > 1) return state;
			let updatedItems = JSON.parse(JSON.stringify(state.items));
			let backWallBases = updatedItems.filter((i) => (i.type === "base_cabinet" || i.type === "tall_cabinet") && i.rotation === 0);
			let backWallHauts = updatedItems.filter((i) => i.type === "wall_cabinet" && i.rotation === 0);
			if (backWallBases.length === 0) return state;

			backWallBases.sort((a, b) => a.position[0] - b.position[0]);
			backWallHauts.sort((a, b) => a.position[0] - b.position[0]);

			const GAP = 2;
			let availableWidth = state.room.width;
			const hasLeftWall = updatedItems.some((i) => (i.rotation === 90 || i.rotation === 270) && i.position[0] < 0);
			const hasRightWall = updatedItems.some((i) => (i.rotation === 90 || i.rotation === 270) && i.position[0] > 0);
			if (hasLeftWall) availableWidth -= 600;
			if (hasRightWall) availableWidth -= 600;

			const idealCount = Math.max(1, Math.round((availableWidth + GAP) / (600 + GAP)));
			const currentCount = backWallBases.length;

			if (idealCount > currentCount) {
				const cabinetsToAdd = idealCount - currentCount;
				const templateBase = backWallBases[backWallBases.length - 1];
				const templateWall = backWallHauts[backWallHauts.length - 1];
				for (let i = 0; i < cabinetsToAdd; i++) {
					const newBase = { ...templateBase, id: crypto.randomUUID() };
					updatedItems.push(newBase);
					backWallBases.push(newBase);
					if (templateWall) {
						const newWall = { ...templateWall, id: crypto.randomUUID() };
						updatedItems.push(newWall);
						backWallHauts.push(newWall);
					}
				}
			} else if (idealCount < currentCount) {
				const cabinetsToRemove = currentCount - idealCount;
				for (let i = 0; i < cabinetsToRemove; i++) {
					const baseToRemove = backWallBases.pop();
					updatedItems = updatedItems.filter((item) => item.id !== baseToRemove.id);
					if (backWallHauts.length > backWallBases.length) {
						const wallToRemove = backWallHauts.pop();
						updatedItems = updatedItems.filter((item) => item.id !== wallToRemove.id);
					}
				}
			}

			const totalGaps = (idealCount - 1) * GAP;
			const targetWidthPerItem = (availableWidth - totalGaps) / idealCount;
			let startX = -state.room.width / 2;
			if (hasLeftWall) startX += 600;
			let currentX = startX + targetWidthPerItem / 2;

			backWallBases.forEach((cab, index) => {
				cab.dimensions.width = targetWidthPerItem;
				cab.position[0] = currentX;
				cab.position[2] = -state.room.depth / 2 + cab.dimensions.depth / 2;
				cab.rotation = 0;
				if (backWallHauts[index]) {
					backWallHauts[index].dimensions.width = targetWidthPerItem;
					backWallHauts[index].position[0] = currentX;
					backWallHauts[index].position[2] = -state.room.depth / 2 + backWallHauts[index].dimensions.depth / 2;
					backWallHauts[index].rotation = 0;
				}
				currentX += targetWidthPerItem + GAP;
			});
			return { items: updatedItems };
		}),

	// --- MISE À JOUR : Quand on sélectionne un nouveau meuble, on ferme le panneau d'édition
	setSelectedId: (id) => set({ selectedId: id, isEditingItem: false }),
	setDraggedId: (id) => set({ draggedId: id }),

	deleteItem: (id) =>
		set((state) => ({
			items: state.items.filter((item) => item.id !== id),
			selectedId: state.selectedId === id ? null : state.selectedId,
			isEditingItem: state.selectedId === id ? false : state.isEditingItem,
		})),

	loadState: (newState) =>
		set({
			room: newState.room,
			items: newState.items,
			selectedId: null,
			draggedId: null,
			isEditingItem: false,
		}),
}));
