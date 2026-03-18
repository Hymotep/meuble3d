# Meuble3D - Complete Beginner Guide

Welcome! This guide will explain EVERYTHING about this project in simple terms.

---

## Table of Contents

1. [What is this app?](#what-is-this-app)
2. [Project Structure Overview](#project-structure-overview)
3. [How the App is Organized](#how-the-app-is-organized)
4. [Understanding the Key Concepts](#understanding-the-key-concepts)
5. [The State Management (Store)](#the-state-management-store)
6. [Component Breakdown](#component-breakdown)
7. [How Drag and Drop Works](#how-drag-and-drop-works)
8. [Coordinate System Explained](#coordinate-system-explained)
9. [Common Tasks](#common-tasks)

---

## What is this app?

This is a **3D Kitchen Configurator** - a web application that lets users:

- Design kitchen layouts by dragging cabinets in a 3D view
- Choose from preset kitchen layouts (Linear, L-shape, U-shape, etc.)
- Customize cabinet colors, sizes, and equipment (sink, stove, oven)
- See real-time price estimates
- Export/import their designs

**Tech Stack:**
- React (UI framework)
- Three.js (3D graphics)
- React Three Fiber (React + Three.js bridge)
- Zustand (state management)
- Vite (build tool)

---

## Project Structure Overview

```
src/
├── main.jsx              # Entry point - starts the app
├── App.jsx               # Main app with routing between pages
├── index.css             # Global styles
├── Scene.jsx             # Kitchen configurator page (48 lines!)
│
├── config/               # Configuration files
│   ├── constants.js      # Magic numbers and settings
│   ├── pricing.js        # Cabinet prices
│   └── theme.js          # UI styles (colors, fonts, etc.)
│
├── store/                # State Management
│   └── store.js          # All app data and functions to modify it
│
├── components/           # UI Components
│   ├── cuisine/          # Kitchen configurator components
│   │   ├── KitchenScene.jsx       # Main 3D scene
│   │   ├── DraggableCaisson.jsx  # Draggable cabinet
│   │   ├── RoomBuilder.jsx       # Floor and walls
│   │   ├── Sidebar.jsx           # Left panel (menus)
│   │   ├── SelectionBottomBar.jsx # Item editor at bottom
│   │   ├── DevisPanel.jsx       # Price display
│   │   ├── Caisson2.jsx          # Kitchen cabinet 3D model
│   │   ├── ArchitectureVisual.jsx # Window visual
│   │   └── Icons.jsx             # SVG icons
│   │
│   ├── Caisson.jsx       # Wardrobe cabinet (dressing section)
│   └── Parent.jsx       # Wardrobe scene parent
│
└── utils/                # Helper functions
    ├── collision.js      # Collision detection
    ├── caissonUtils.js   # Dresser cabinet calculations
    ├── porteUtils.jsx    # Door rendering
    └── tiroirsUtils.jsx  # Drawer rendering
```

---

## How the App is Organized

Think of it like a **house with rooms**:

1. **Entry Point** (`main.jsx`) → The front door
2. **App Router** (`App.jsx`) → The hallway that directs you to different rooms
3. **Pages** → The rooms themselves
   - Kitchen Configurator (`Scene.jsx`)
   - Dressing/Wardrobe (another route)

### The Kitchen Configurator Page

This is where most of the magic happens. It has **4 main parts**:

```
┌─────────────────────────────────────────────────────────┐
│  ┌─────────────┐                                      │
│  │   SIDEBAR   │   ┌────────────────────────────────┐ │
│  │             │   │                                │ │
│  │  - Presets  │   │                                │ │
│  │  - Room     │   │       3D CANVAS                │ │
│  │  - Catalog  │   │                                │ │
│  │             │   │     (KitchenScene)             │ │
│  │             │   │                                │ │
│  └─────────────┘   └────────────────────────────────┘ │
│                        ┌────────────────────┐         │
│   ┌──────────────┐     │   DEVIS PANEL      │         │
│   │ BOTTOM BAR   │     │   (Price: €1,250)  │         │
│   │ - Dimensions │     └────────────────────┘         │
│   │ - Colors     │                                     │
│   │ - Options    │                                     │
│   └──────────────┘                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Understanding the Key Concepts

### 1. What is a "Component"?

A component is a **reusable piece of UI**. Think of it like a LEGO block:

```jsx
// This is a simple component
function MyButton() {
    return <button>Click me!</button>;
}

// You can use it anywhere:
// <MyButton />
// <MyButton />
// <MyButton />
```

### 2. What is a "Hook"?

Hooks are special functions that let React components "hook into" features:

- `useState` → Store data that changes
- `useEffect` → Run code when something happens
- `useStore` → Access the global state (from Zustand)

### 3. What is "State"?

State is **data that changes** over time. For example:
- The selected cabinet
- The room dimensions
- The list of items in the room

---

## The State Management (Store)

The **store** (`store.js`) is like a **central database** for the app. Everything is stored here.

### What Data is Stored?

```javascript
{
    room: { 
        width: 4000,        // Room width in mm
        depth: 3000,         // Room depth in mm  
        height: 2500,        // Room height in mm
        wallCount: 3,        // How many walls (1, 2, or 3)
        wallColor: "#f3f4f6" // Wall color
    },
    
    items: [
        {
            id: "abc-123",           // Unique ID
            type: "base_cabinet",    // Cabinet type
            position: [0, 0, -1200],  // X, Y, Z position in mm
            dimensions: {
                width: 600,          // Width in mm
                height: 812,         // Height in mm
                depth: 600           // Depth in mm
            },
            rotation: 0,              // 0, 90, 180, or 270 degrees
            config: {
                couleurExt: "#ffffff",      // External color
                couleurInt: "#e5e7eb",      // Internal color
                couleurPlanTravail: "#daba9e", // Countertop color
                avecPoignees: true,         // Has handles?
                couleurPoignees: "#222222", // Handle color
                isTiroirsInterieurs: false, // Interior drawers?
                equipement: "none",          // "sink", "cooktop", "oven_microwave"
                useTextures: false           // Use PBR textures?
            }
        },
        // ... more items
    ],
    
    selectedId: "abc-123",   // Which item is selected
    draggedId: null,          // Which item is being dragged
    viewMode: "3D"            // "2D" or "3D"
}
```

### How to Use the Store

```javascript
// Import the store hook
import { useStore } from "../store/store";

// In a component, you can READ data:
const items = useStore((state) => state.items);
const room = useStore((state) => state.room);

// You can also READ and WRITE:
const updateRoom = useStore((state) => state.updateRoom);
const addItem = useStore((state) => state.addItem);

// Example: Change room width
updateRoom({ width: 5000 });

// Example: Add a new cabinet
addItem({
    id: crypto.randomUUID(),
    type: "base_cabinet",
    position: [0, 0, 0],
    dimensions: { width: 600, height: 812, depth: 600 },
    config: { couleurExt: "#ffffff", ... }
});
```

### Store Functions (Actions)

| Function | What it Does |
|----------|--------------|
| `updateRoom()` | Change room dimensions/color |
| `addItem()` | Add a new cabinet |
| `updateItemPosition()` | Move a cabinet |
| `updateItemRotation()` | Rotate a cabinet (90° increments) |
| `updateItemConfig()` | Change colors, equipment, etc. |
| `updateItemDimensions()` | Resize a cabinet |
| `deleteItem()` | Remove a cabinet |
| `setSelectedId()` | Select/deselect a cabinet |
| `setDraggedId()` | Mark a cabinet as being dragged |
| `loadState()` | Load a saved project |
| `setViewMode()` | Switch between 2D and 3D |

---

## Component Breakdown

### Scene.jsx (Kitchen Configurator)

This is the **main page** for the kitchen configurator. It combines all the parts:

```jsx
const KitchenConfigurator = () => {
    return (
        <div style={{ display: "flex" }}>
            {/* Left panel with presets and catalog */}
            <Sidebar />
            
            {/* Main area */}
            <div>
                {/* Price estimate (top right) */}
                <DevisPanel />
                
                {/* Item editor (bottom) */}
                <SelectionBottomBar />
                
                {/* 3D Canvas */}
                <Canvas>
                    <KitchenScene />
                </Canvas>
            </div>
        </div>
    );
};
```

### KitchenScene.jsx (3D Scene)

This is where the **3D world is built**. It:
- Sets up lighting
- Creates the room (floor + walls)
- Renders all cabinets
- Sets up cameras (2D vs 3D view)

### DraggableCaisson.jsx (Draggable Cabinet)

This is the most complex component. It:
1. **Renders** a cabinet in 3D
2. **Detects** when the user drags it
3. **Calculates** the new position based on mouse movement
4. **Checks** for collisions with other cabinets
5. **Snaps** to walls and other cabinets
6. **Updates** the store when the drag ends

### Sidebar.jsx (Left Panel)

Contains:
- **View Toggle**: Switch between 2D plan and 3D view
- **Export/Import**: Save or load projects
- **Presets**: Quick-start layouts (Linear, L, U, Island, etc.)
- **Room Config**: Adjust room dimensions
- **Catalog**: Add new cabinets (Base, Wall, Tall, Island)

### SelectionBottomBar.jsx (Item Editor)

Appears when a cabinet is selected. Lets you:
- Change dimensions (width)
- Rotate 90°
- Change colors (interior, exterior, countertop)
- Toggle options (handles, drawers, PBR textures)
- Add equipment (sink, cooktop, oven)
- Delete the cabinet

### DevisPanel.jsx (Price Display)

Shows real-time price estimate based on:
- Cabinet type and size
- Optional equipment (sinks cost extra, etc.)

---

## How Drag and Drop Works

This is the most complex part! Here's how it works:

### 1. User Clicks and Drags

```javascript
const bind = useDrag(({ active, first, last, event, memo }) => {
    // `active` = is the user currently dragging?
    // `first` = is this the first frame of the drag?
    // `last` = is this the last frame of the drag?
    // `event` = the mouse/touch event
});
```

### 2. Calculate Mouse Position in 3D

```javascript
// Create a horizontal plane at y=0
const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

// Create a ray from the camera through the mouse position
const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(mouse, camera);

// Find where the ray intersects the floor
raycaster.ray.intersectPlane(floorPlane, intersectPoint);
```

### 3. Check for Collisions

```javascript
// Get the bounding box of our cabinet at the new position
const myBBox = getBBox(currentItem, newX, newZ);

// Check against all other cabinets
for (const other of items) {
    const otherBBox = getBBox(other);
    
    // If they overlap, there's a collision!
    if (doIntersect(myBBox, otherBBox)) {
        hasCollision = true;
    }
}
```

### 4. Snap to Other Cabinets or Walls

```javascript
// If close to a wall, snap to it
if (Math.abs(newX - limitLeft) < SNAP_DISTANCE) {
    newX = limitLeft;
}

// If close to another cabinet, snap to it
const targetRight = otherX + otherW / 2 + myW / 2;
if (Math.abs(newX - targetRight) < SNAP_DISTANCE) {
    newX = targetRight;
}
```

### 5. Update Position

```javascript
// Move the mesh to the new position
meshRef.current.position.set(newX, baseY, newZ);

// When drag ends, save to store
updateItemPosition(id, [
    meshRef.current.position.x * 1000,  // Convert meters to mm
    baseY * 1000,
    meshRef.current.position.z * 1000
]);
```

---

## Coordinate System Explained

This app uses a **3D coordinate system**:

```
        +Y (up)
          │
          │
          │
          │
          │
          └────────────── +X (right)
         ╱
        ╱
       ╱
      ╱
    +Z (toward viewer)
```

### Important Rules:

1. **Unit of Measurement**: Everything internally is in **meters**, but the store stores **millimeters**
   - Store: `position: [0, 0, -1200]` = 1200mm
   - Three.js: `position: [0, 0, -1.2]` = 1.2 meters

2. **Conversion**:
   ```javascript
   const meters = millimeters / 1000;
   const millimeters = meters * 1000;
   ```

3. **Room Center**: The room is centered at origin (0, 0, 0)
   - Left wall: X = -roomWidth/2
   - Right wall: X = +roomWidth/2
   - Back wall: Z = -roomDepth/2
   - Front: Z = +roomDepth/2

4. **Y-Axis**: Height above floor
   - Floor: Y = 0
   - Base cabinets: Y = 0
   - Wall cabinets: Y = 1.4 (1400mm)

5. **Rotation**: Cabinets can be rotated 0°, 90°, 180°, or 270°

---

## File-by-File Explanation

### config/constants.js
Contains all the "magic numbers" - values that are used throughout the code. Centralizing them makes it easy to tweak settings.

Key exports:
- `SNAP_DISTANCE` - How close to snap to walls/cabinets
- `CABINET_BASE_HEIGHTS` - Y position for each cabinet type
- `CABINET_WIDTH_OPTIONS` - Available widths in the dropdown
- `STANDARD_DIMENSIONS` - Default sizes for each cabinet type
- `CLEARANCE_REQUIREMENTS` - Space needed for ovens, etc.

### config/pricing.js
The pricing table for cabinets and options. Also exports `calculateItemPrice()` function.

Key exports:
- `CABINET_PRICES` - Base prices by type and width
- `OPTIONS_PRICES` - Extra costs for handles, drawers, etc.
- `DEFAULT_CABINET_CONFIG` - Default colors and settings for new cabinets

### config/theme.js
All UI styling is defined here as JavaScript objects. Makes it easy to maintain consistent styling.

Key exports:
- `panelStyles` - Sidebar styling
- `btnOutlineStyles` - Button styles
- `theme` - Combined object with all styles

### store/store.js
The Zustand store. Contains all app data and functions to modify it.

This is the **heart of the application**. All data flows through here.

### utils/collision.js
Helper functions for calculating bounding boxes and detecting collisions.

Key exports:
- `getBBox()` - Calculate bounding box for an item
- `getClearanceBBox()` - Calculate clearance zone for equipment
- `doIntersect()` - Check if two boxes overlap

### utils/caissonUtils.js
Helper functions for the wardrobe/dressing cabinet (different from kitchen).

### utils/porteUtils.jsx
Renders doors for the wardrobe cabinet.

### utils/tiroirsUtils.jsx
Renders drawers for the wardrobe cabinet.

---

## Common Tasks

### Adding a New Cabinet Type

1. Add default dimensions in `src/config/constants.js`:
```javascript
export const STANDARD_DIMENSIONS = {
    base_cabinet: { width: 600, height: 812, depth: 600 },
    // ADD HERE:
    new_type: { width: 400, height: 700, depth: 400 },
};
```

2. Add base heights in `CABINET_BASE_HEIGHTS`:
```javascript
export const CABINET_BASE_HEIGHTS = {
    base_cabinet: 0,
    wall_cabinet: 1.4,
    // ADD HERE:
    new_type: 0,
};
```

3. Handle rendering in `Caisson2.jsx` if it needs special geometry.

4. Add pricing in `src/config/pricing.js`:
```javascript
export const CABINET_PRICES = {
    new_type: {
        400: 100,
        600: 150,
    },
};
```

### Modifying Default Cabinet Colors

Edit `src/config/pricing.js`:
```javascript
export const DEFAULT_CABINET_CONFIG = {
    couleurExt: "#ffffff",     // Change default exterior color
    couleurInt: "#e5e7eb",   // Change default interior color
    couleurPlanTravail: "#daba9e", // Change default countertop
    // ...
};
```

### Adding a New Preset Kitchen

Edit `Sidebar.jsx` and add to the `PRESETS` object:
```javascript
const PRESETS = {
    myNewPreset: {
        room: { wallCount: 2 },
        items: (defaultConfig) => [
            // ... list of cabinets
        ]
    },
    // ... existing presets
};
```

---

## Tips for Beginners

1. **Start Small**: If you want to understand the code, start with `Scene.jsx` and trace through each component.

2. **Use Console**: Add `console.log()` statements to see what data looks like:
   ```javascript
   const items = useStore((state) => state.items);
   console.log("Items:", items);
   ```

3. **Read the Comments**: The code has detailed comments explaining WHY things work.

4. **Understand the Coordinate System**: Most bugs come from mixing up meters and millimeters.

5. **State Flows Down**: Remember: data flows from the store → components → UI.

---

## Glossary

| Term | Meaning |
|------|---------|
| **Component** | A reusable piece of UI |
| **Props** | Data passed from parent to child components |
| **State** | Data that changes over time |
| **Hook** | Special React functions that add features |
| **Bounding Box** | A box that encloses an object (used for collision) |
| **Raycasting** | Shooting a ray from camera to find 3D position |
| **Snap** | Magnetic attraction to grid lines or objects |
| **AABB** | Axis-Aligned Bounding Box - simplest collision shape |
| **PBR** | Physically Based Rendering - realistic textures |
| **Caisson** | French word for "cabinet" or "module" |
| **Devis** | French word for "estimate" or "quote" |

---

## Need Help?

If something is unclear, try:
1. Reading the comments in the source files
2. Adding console.log statements to see what's happening
3. Searching for the concept online (React, Three.js docs are great)

Good luck with the project! 🚀
