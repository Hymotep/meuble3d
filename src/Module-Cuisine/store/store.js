import { create } from 'zustand';

export const useStore = create((set) => ({
    room: { width: 4000, depth: 3000, height: 2500, wallCount: 3, wallColor: "#f3f4f6" },
    items: [],
    selectedId: null,
    draggedId: null,

    // --- NOUVEAU : GESTION DE LA VUE 2D/3D ---
    viewMode: "3D", 
    setViewMode: (mode) => set({ viewMode: mode }),

    updateRoom: (newSettings) => set((state) => ({ 
        room: { ...state.room, ...newSettings } 
    })),

    addItem: (newItem) => set((state) => ({ 
        items: [...state.items, { rotation: 0, ...newItem }] 
    })),
    
    updateItemPosition: (id, newPosition) => set((state) => ({
        items: state.items.map(item => item.id === id ? { ...item, position: newPosition } : item)
    })),

    updateItemRotation: (id, newRotation) => set((state) => ({
        items: state.items.map(item => item.id === id ? { ...item, rotation: newRotation } : item)
    })),

    updateItemConfig: (id, newConfig) => set((state) => ({
        items: state.items.map(item => item.id === id ? { ...item, config: { ...item.config, ...newConfig } } : item)
    })),

    // --- LOGIQUE DE REPOUSSEMENT INTELLIGENT ---
    updateItemDimensions: (id, newDimensions) => set((state) => {
        const targetItem = state.items.find(i => i.id === id);
        if (!targetItem) return state;

        // 1. On calcule de combien le meuble a grandi dans l'espace 3D
        const isRotated = targetItem.rotation === 90 || targetItem.rotation === 270;
        
        const newW = newDimensions.width !== undefined ? newDimensions.width : targetItem.dimensions.width;
        const newD = newDimensions.depth !== undefined ? newDimensions.depth : targetItem.dimensions.depth;

        const oldWorldW = isRotated ? targetItem.dimensions.depth : targetItem.dimensions.width;
        const newWorldW = isRotated ? newD : newW;
        const deltaX = newWorldW - oldWorldW; // Différence sur l'axe Gauche/Droite

        const oldWorldD = isRotated ? targetItem.dimensions.width : targetItem.dimensions.depth;
        const newWorldD = isRotated ? newW : newD;
        const deltaZ = newWorldD - oldWorldD; // Différence sur l'axe Avant/Arrière

        // 2. On met à jour les dimensions ET on décale les voisins
        const newItems = state.items.map(item => {
            // Si c'est le meuble qu'on est en train de modifier, on change juste sa taille
            if (item.id === id) {
                return { ...item, dimensions: { ...item.dimensions, ...newDimensions } };
            }

            let nx = item.position[0];
            let ny = item.position[1];
            let nz = item.position[2];

            // DÉCALAGE HORIZONTAL (Axe X)
            if (Math.abs(item.position[2] - targetItem.position[2]) < (oldWorldD / 2 + 50)) {
                if (deltaX !== 0) {
                    if (item.position[0] > targetItem.position[0] + 10) nx += deltaX / 2; // Pousse vers la droite
                    else if (item.position[0] < targetItem.position[0] - 10) nx -= deltaX / 2; // Pousse vers la gauche
                }
            }

            // DÉCALAGE VERTICAL (Axe Z - Pour les meubles pivotés)
            if (Math.abs(item.position[0] - targetItem.position[0]) < (oldWorldW / 2 + 50)) {
                if (deltaZ !== 0) {
                    if (item.position[2] > targetItem.position[2] + 10) nz += deltaZ / 2; // Pousse vers l'avant
                    else if (item.position[2] < targetItem.position[2] - 10) nz -= deltaZ / 2; // Pousse vers le fond
                }
            }

            // SÉCURITÉ : On bloque les meubles poussés contre les murs
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

    deleteItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id),
        selectedId: state.selectedId === id ? null : state.selectedId
    })),

    setSelectedId: (id) => set({ selectedId: id }),
    setDraggedId: (id) => set({ draggedId: id }),

    loadState: (newState) => set({
        room: newState.room,
        items: newState.items,
        selectedId: null, 
        draggedId: null
    })
}));