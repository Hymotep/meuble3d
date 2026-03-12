import { create } from 'zustand';

export const useStore = create((set) => ({
    room: { width: 4000, depth: 3000, height: 2500 },
    items: [],
    selectedId: null,
    draggedId: null,

    // NOUVEAU : On inclut rotation: 0 par défaut
    addItem: (newItem) => set((state) => ({ items: [...state.items, { ...newItem, rotation: 0 }] })),
    
    updateItemPosition: (id, newPosition) => set((state) => ({
        items: state.items.map(item => item.id === id ? { ...item, position: newPosition } : item)
    })),

    // NOUVEAU : Action pour pivoter le meuble
    updateItemRotation: (id, newRotation) => set((state) => ({
        items: state.items.map(item => item.id === id ? { ...item, rotation: newRotation } : item)
    })),

    setSelectedId: (id) => set({ selectedId: id }),
    setDraggedId: (id) => set({ draggedId: id }),
}));