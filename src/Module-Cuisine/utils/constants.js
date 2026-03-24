/**
 * ============================================================================
 * CONFIGURATION CONSTANTS
 * ============================================================================
 * 
 * Central location for all magic numbers and constants used throughout
 * the kitchen configurator. This makes it easy to:
 * - Find where specific values are defined
 * - Adjust dimensions without hunting through code
 * - Maintain consistency across components
 */

/**
 * Distance in meters at which cabinets snap to room edges or other cabinets.
 * A smaller value = more precise snapping but harder to hit the snap point.
 */
export const SNAP_DISTANCE = 0.2;

/**
 * Cabinet base height (Y position) for different cabinet types.
 * These represent the floor level offset for each category.
 */
export const CABINET_BASE_HEIGHTS = {
    base_cabinet: 0,        // Floor level
    wall_cabinet: 1.4,      // 1400mm from floor
    tall_cabinet: 0,        // Floor level (full height)
    island: 0,              // Floor level
    window: 0.9,            // Window center height (900mm)
};

/**
 * Default room settings used when initializing or resetting the configurator.
 * All dimensions are in millimeters.
 */
export const DEFAULT_ROOM = {
    width: 4000,
    depth: 3000,
    height: 2500,
    wallCount: 3,
    wallColor: "#f3f4f6",
};

/**
 * Width presets available in the dimension selector for cabinets.
 * The value selected determines the cabinet width in millimeters.
 */
export const CABINET_WIDTH_OPTIONS = {
    standard: [400, 600, 800, 1000],
    island: [1200, 1800, 2400],
    window: [700, 800, 900, 1000, 1200],
};

/**
 * Standard cabinet dimensions (width, height, depth) in millimeters.
 * These are used as defaults when adding new cabinets.
 */
export const STANDARD_DIMENSIONS = {
    base_cabinet: { width: 600, height: 812, depth: 600 },
    wall_cabinet: { width: 600, height: 700, depth: 350 },
    tall_cabinet: { width: 600, height: 2100, depth: 600 },
    island: { width: 1800, height: 900, depth: 900 },
    window: { width: 1000, height: 1000, depth: 100 },
};

/**
 * Clearance zone requirements for equipment that needs space behind it.
 * For example, ovens need 900mm of clearance in front for safe operation.
 * Values are in meters for use with 3D calculations.
 */
export const CLEARANCE_REQUIREMENTS = {
    oven_microwave: 0.9,    // 900mm clearance
    tiroirsInterieurs: 0.9, // Interior drawers need space
};

/**
 * Minimum gap between cabinets and between cabinets and walls.
 * Helps prevent visual overlap and allows for slight misalignment.
 * Value is in meters.
 */
export const MIN_CABINET_GAP = 0.005;  // 5mm
export const PERP_GAP = 0.05;           // 50mm for perpendicular cabinets
