# Meuble3D - 3D Kitchen Configurator

A React-based 3D kitchen configurator that allows users to design custom kitchen layouts with draggable cabinets, appliances, and workstations.

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Key Concepts](#key-concepts)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Getting Started](#getting-started)

---

## Project Overview

This application enables users to:
- Design kitchen layouts using predefined presets (Linear, L-shaped, U-shaped, Island, Parallel, Studio)
- Drag and drop cabinets within a 3D room
- Configure cabinet properties (colors, handles, equipment)
- View real-time price estimates
- Export/import projects as JSON

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **React Three Fiber** | 3D rendering with React |
| **Three.js** | Core 3D library |
| **@react-three/drei** | Useful helpers for R3F |
| **Zustand** | Lightweight state management |
| **Vite** | Build tool & dev server |
| **@use-gesture/react** | Drag gesture handling |

---

## Project Structure

```
src/
├── main.jsx                 # Entry point
├── App.jsx                  # Root component with routing
├── index.css                # Global styles
│
├── components/
│   ├── dressing/            # Wardrobe/furniture configurator
│   │   ├── Parent.jsx       # Parent component for dresser scene
│   │   └── Caisson.jsx      # Individual cabinet with doors/drawers
│   │
│   └── cuisine/             # Kitchen configurator
│       ├── KitchenScene.jsx         # Main 3D scene (lights, room, items)
│       ├── DraggableCaisson.jsx     # Draggable cabinet wrapper
│       ├── RoomBuilder.jsx          # Room geometry (walls, floor)
│       ├── ArchitectureVisual.jsx   # Window visualization
│       ├── Sidebar.jsx              # Left panel (presets, add items)
│       ├── SelectionBottomBar.jsx   # Bottom bar (item properties)
│       ├── DevisPanel.jsx           # Price estimate display
│       ├── Caisson2.jsx              # Kitchen cabinet 3D model
│       └── index.js                 # Barrel export
│
├── config/                  # Application configuration
│   ├── constants.js         # Global constants (snap distance, etc.)
│   ├── pricing.js           # Pricing table for cabinets
│   └── theme.js             # UI theme/styles
│
├── store/                   # State management
│   └── store.js            # Zustand store (room, items, selection)
│
└── utils/                   # Utility functions
    ├── index.js            # Barrel export
    ├── caissonUtils.js     # Scale calculations for dresser
    ├── porteUtils.jsx       # Door rendering & animation
    └── tiroirsUtils.jsx    # Drawer rendering & animation
```

---

## Key Concepts

### Coordinate System

- All internal measurements are in **millimeters (mm)**
- 3D positions use **meters (m)** internally (divide by 1000)
- Room center is at origin (0, 0, 0)
- Y-axis is vertical, Z-axis is depth (forward/back)
- Positive Z = front of room, Negative Z = back (against wall)

### Cabinet Types

| Type | Description | Default Position |
|------|-------------|------------------|
| `base_cabinet` | Floor cabinets with countertop | Y = 0 |
| `wall_cabinet` | Upper wall cabinets | Y = 1400mm |
| `tall_cabinet` | Full-height column | Y = 0 |
| `island` | Kitchen island (freestanding) | Y = 0 |
| `window` | Architectural window marker | Y = 900mm |

### Equipment Options

| Equipment | Available For | Description |
|-----------|--------------|-------------|
| `sink` | base_cabinet, island | Kitchen sink |
| `cooktop` | base_cabinet | Cooking surface |
| `oven_microwave` | tall_cabinet | Oven + microwave combo |

### Collision Detection

The app uses **bounding box collision** to:
- Prevent cabinets from overlapping
- Snap cabinets to room walls
- Detect clearance violations (ovens need space behind)

---

## Component Architecture

### App Flow

```
<App>
├── <Routes>
│   ├── Route: "/" (DressingScene)
│   │   └── <Parent> → <Caisson> (wardrobe configurator)
│   │
│   └── Route: "/cuisine" (KitchenConfigurator)
│       ├── <Sidebar> (left panel)
│       └── <Canvas>
│           └── <KitchenScene>
│               ├── <RoomBuilder> (floor & walls)
│               └── <DraggableCaisson> × n (interactive cabinets)
```

### KitchenScene Component

The main 3D scene handles:
1. **Lighting** - Ambient + directional lights, environment map
2. **Camera** - Perspective (3D) or Orthographic (2D) based on viewMode
3. **Room** - Floor and wall geometry
4. **Items** - All placed cabinets rendered as DraggableCaisson

### DraggableCaisson Component

Each cabinet is wrapped with drag functionality:
1. Uses `@use-gesture/react` for drag detection
2. Raycasts to a horizontal plane for position
3. Checks collisions with other items in real-time
4. Updates Zustand store on drag end

---

## State Management

### Zustand Store (`store.js`)

```javascript
{
  // Room properties
  room: { width, depth, height, wallCount, wallColor },
  
  // All placed items
  items: [{ id, type, position, dimensions, rotation, config }],
  
  // Selection state
  selectedId: string | null,
  draggedId: string | null,
  
  // View mode (2D plan vs 3D view)
  viewMode: "2D" | "3D",
  
  // Actions
  addItem(), updateItemPosition(), updateItemRotation(),
  updateItemConfig(), updateItemDimensions(), deleteItem(),
  loadState(), setViewMode(), setSelectedId()
}
```

### Item Structure

```javascript
{
  id: "uuid-string",
  type: "base_cabinet" | "wall_cabinet" | "tall_cabinet" | "island" | "window",
  position: [x_mm, y_mm, z_mm],
  dimensions: { width_mm, height_mm, depth_mm },
  rotation: 0 | 90 | 180 | 270,  // degrees
  config: {
    couleurExt: "#ffffff",      // External color
    couleurInt: "#e5e7eb",       // Internal color
    couleurPlanTravail: "#daba9e", // Countertop color
    avecPoignees: true,          // Show handles
    couleurPoignees: "#222222",  // Handle color
    isTiroirsInterieurs: false,  // Interior drawers (hidden)
    equipement: "none" | "sink" | "cooktop" | "oven_microwave",
    useTextures: false            // PBR texture mode
  }
}
```

---

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Adding a New Cabinet Type

1. Add the type to `CABINET_TYPES` in `config/constants.js`
2. Add default dimensions in `generateCabinet()` in `Sidebar.jsx`
3. Handle rendering in `Caisson2.jsx` if special geometry needed
4. Add pricing in `config/pricing.js`

### Modifying the 3D Model

The `Caisson2.jsx` component builds cabinets procedurally using Three.js primitives:
- **Body**: Box geometries with thickness
- **Doors**: Flat boxes with optional handles
- **Equipment**: Custom meshes for sinks, cooktops, ovens

---

## Code Style Guide

- **Comments**: Explain WHY, not WHAT (code shows what)
- **Naming**: Use descriptive names, camelCase for variables
- **Constants**: All magic numbers defined in `config/constants.js`
- **Components**: One component per file, export named component
- **Imports**: Group by external → internal → relative

---

## Performance Tips

1. Use `useMemo` for expensive calculations (scales, materials)
2. Use `useCallback` for event handlers passed to children
3. Limit `useFrame` callbacks to essential animations
4. Use `InstancedMesh` for many identical objects
