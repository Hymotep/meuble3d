import { create } from 'zustand';

export const useStore = create((set) => ({
    room: { width: 4000, depth: 3000, height: 2500, wallCount: 3, wallColor: "#f3f4f6" },
    items: [],
    selectedId: null,
    draggedId: null,

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

    updateItemDimensions: (id, newDimensions) => set((state) => ({
        items: state.items.map(item => item.id === id ? { ...item, dimensions: { ...item.dimensions, ...newDimensions } } : item)
    })),

    deleteItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id),
        selectedId: state.selectedId === id ? null : state.selectedId
    })),

    setSelectedId: (id) => set({ selectedId: id }),
    setDraggedId: (id) => set({ draggedId: id }),

    // NOUVEAU : Fonction pour écraser tout le store avec un fichier chargé
    loadState: (newState) => set({
        room: newState.room,
        items: newState.items,
        selectedId: null, // On désélectionne tout par sécurité
        draggedId: null
    })
}));