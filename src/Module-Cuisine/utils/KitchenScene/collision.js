/**
 * ============================================================================
 * COLLISION & GEOMETRY UTILITIES
 * ============================================================================
 *
 * Helper functions for calculating bounding boxes and detecting collisions
 * between cabinets in the 3D scene.
 *
 * All positions and dimensions are in MILLIMETERS in the store, but converted
 * to METERS for Three.js calculations. This module works with METERS.
 */

import * as THREE from "three";
import { PERP_GAP, MIN_CABINET_GAP } from "../Sidebar/constants.js";

/**
 * Calculates the axis-aligned bounding box (AABB) for a cabinet.
 * Handles cabinet rotation by swapping width/depth when rotated 90° or 270°.
 *
 * @param {Object} item - Cabinet item with dimensions and position
 * @param {number} tempX - Optional temporary X position (for collision checking during drag)
 * @param {number} tempZ - Optional temporary Z position (for collision checking during drag)
 * @returns {Object} Bounding box with minX, maxX, minZ, maxZ properties
 *
 * @example
 * // Normal cabinet
 * getBBox(cabinet) // { minX: -0.3, maxX: 0.3, minZ: -0.9, maxZ: -0.6 }
 *
 * @example
 * // Cabinet rotated 90° - width and depth are swapped
 * getBBox(rotatedCabinet) // { minX: -0.6, maxX: -0.3, minZ: -0.3, maxZ: 0.3 }
 */
export const getBBox = (item, tempX, tempZ) => {
	const rot = item.rotation || 0;
	const isRotated = rot === 90 || rot === 270;

	// Swap dimensions if rotated
	const w = isRotated ? item.dimensions.depth / 1000 : item.dimensions.width / 1000;
	const d = isRotated ? item.dimensions.width / 1000 : item.dimensions.depth / 1000;

	// Use temp position if provided (for drag preview), otherwise use actual position
	const x = tempX !== undefined ? tempX : item.position[0] / 1000;
	const z = tempZ !== undefined ? tempZ : item.position[2] / 1000;

	return {
		minX: x - w / 2,
		maxX: x + w / 2,
		minZ: z - d / 2,
		maxZ: z + d / 2,
	};
};

/**
 * Calculates the clearance zone required for equipment like ovens.
 * This zone extends FROM the cabinet in the direction it faces.
 *
 * Equipment like ovens needs 900mm of clearance in front for safe operation.
 * This function calculates where that clearance zone would be if the
 * cabinet were at a given position.
 *
 * @param {Object} item - Cabinet item
 * @param {number} tempX - Optional temporary X position
 * @param {number} tempZ - Optional temporary Z position
 * @returns {Object} Clearance bounding box
 *
 * @example
 * // Cabinet facing front (0°) needs clearance at maxZ
 * getClearanceBBox(oven) // { minZ: 0.9, maxZ: 1.8, ... }
 */
export const getClearanceBBox = (item, tempX, tempZ) => {
	const rot = item.rotation || 0;
	const w = item.dimensions.width / 1000;
	const d = item.dimensions.depth / 1000;
	const x = tempX !== undefined ? tempX : item.position[0] / 1000;
	const z = tempZ !== undefined ? tempZ : item.position[2] / 1000;

	const CLEARANCE_DEPTH = 0.9; // 900mm clearance required

	let cMinX, cMaxX, cMinZ, cMaxZ;

	// Clearance extends in the direction the cabinet faces
	if (rot === 0) {
		// Facing front (+Z direction)
		cMinX = x - w / 2 + 0.05;
		cMaxX = x + w / 2 - 0.05;
		cMinZ = z + d / 2;
		cMaxZ = z + d / 2 + CLEARANCE_DEPTH;
	} else if (rot === 180) {
		// Facing back (-Z direction)
		cMinX = x - w / 2 + 0.05;
		cMaxX = x + w / 2 - 0.05;
		cMinZ = z - d / 2 - CLEARANCE_DEPTH;
		cMaxZ = z - d / 2;
	} else if (rot === 90) {
		// Facing right (+X direction)
		cMinX = x + d / 2;
		cMaxX = x + d / 2 + CLEARANCE_DEPTH;
		cMinZ = z - w / 2 + 0.05;
		cMaxZ = z + w / 2 - 0.05;
	} else if (rot === 270) {
		// Facing left (-X direction)
		cMinX = x - d / 2 - CLEARANCE_DEPTH;
		cMaxX = x - d / 2;
		cMinZ = z - w / 2 + 0.05;
		cMaxZ = z + w / 2 - 0.05;
	}

	return { minX: cMinX, maxX: cMaxX, minZ: cMinZ, maxZ: cMaxZ };
};

/**
 * Checks if two bounding boxes intersect (AABB collision detection).
 * Uses the separating axis theorem - if there's a gap on any axis, no collision.
 *
 * @param {Object} b1 - First bounding box {minX, maxX, minZ, maxZ}
 * @param {Object} b2 - Second bounding box {minX, maxX, minZ, maxZ}
 * @returns {boolean} True if boxes overlap, false otherwise
 *
 * @example
 * const box1 = { minX: 0, maxX: 1, minZ: 0, maxZ: 1 };
 * const box2 = { minX: 0.5, maxX: 1.5, minZ: 0.5, maxZ: 1.5 };
 * doIntersect(box1, box2); // true - they overlap
 */
export const doIntersect = (b1, b2) => {
	return b1.minX < b2.maxX && b1.maxX > b2.minX && b1.minZ < b2.maxZ && b1.maxZ > b2.minZ;
};

/**
 * Checks if two cabinets would collide if one moved to a new position.
 * Also considers clearance zones for equipment like ovens.
 *
 * @param {Object} movingItem - The cabinet being moved
 * @param {number} newX - Proposed new X position
 * @param {number} newZ - Proposed new Z position
 * @param {Object[]} otherItems - Array of other cabinets to check against
 * @param {Object} config - Moving item's config (for equipment checks)
 * @returns {Object} { hasCollision, hasClearanceViolation }
 */
export const checkCollision = (movingItem, newX, newZ, otherItems, config) => {
	let hasCollision = false;
	let hasClearanceViolation = false;

	// Get the moving item's bounding box at the new position
	const myBBox = getBBox(movingItem, newX, newZ);

	// Check if the moving item needs clearance (oven, interior drawers)
	const iNeedClearance = config?.equipement === "oven_microwave" || config?.isTiroirsInterieurs;

	const myClearance = iNeedClearance ? getClearanceBBox(movingItem, newX, newZ) : null;

	for (const other of otherItems) {
		if (other.type === "window" || movingItem.type === "window") {
			continue;
		}

		const otherRot = other.rotation || 0;
		const otherIsRot = otherRot === 90 || otherRot === 270;

		// Calculate other cabinet's dimensions based on rotation
		const oW = (otherIsRot ? other.dimensions.depth : other.dimensions.width) / 1000;
		const oD = (otherIsRot ? other.dimensions.width : other.dimensions.depth) / 1000;
		const oX = other.position[0] / 1000;
		const oZ = other.position[2] / 1000;
		const oY = other.position[1] / 1000;
		const oH = other.dimensions.height / 1000;

		// For snap detection, check if items are on same Z-axis and close
		const SNAP_THRESHOLD = 0.1; // 100mm
		const heightOverlap =
			Math.abs(newX / 1000 - oX) < 0.1 && Math.abs(newZ - oZ) < SNAP_THRESHOLD && Math.abs(movingItem.position[1] / 1000 - oY) < SNAP_THRESHOLD;

		if (heightOverlap) {
			// This could trigger snap behavior
		}

		// Build 3D bounding boxes for proper collision
		const myMinX = newX - movingItem.dimensions.width / 1000 / 2;
		const myMaxX = newX + movingItem.dimensions.width / 1000 / 2;
		const myMinY = movingItem.position[1] / 1000;
		const myMaxY = myMinY + movingItem.dimensions.height / 1000;
		const myMinZ = newZ - movingItem.dimensions.depth / 1000 / 2;
		const myMaxZ = newZ + movingItem.dimensions.depth / 1000 / 2;

		const oMinX = oX - oW / 2;
		const oMaxX = oX + oW / 2;
		const oMinY = oY;
		const oMaxY = oY + oH;
		const oMinZ = oZ - oD / 2;
		const oMaxZ = oZ + oD / 2;

		// Gap between perpendicular cabinets
		const gap = PERP_GAP;

		// Check 3D intersection
		const intersectX = myMinX < oMaxX + gap && myMaxX > oMinX - gap;
		const intersectY = myMinY < oMaxY - MIN_CABINET_GAP && myMaxY > oMinY + MIN_CABINET_GAP;
		const intersectZ = myMinZ < oMaxZ + gap && myMaxZ > oMinZ - gap;

		if (intersectX && intersectY && intersectZ) {
			hasCollision = true;
		}

		// Check clearance violations
		const otherBBox = getBBox(other);
		if (other.config?.equipement === "oven_microwave" || other.config?.isTiroirsInterieurs) {
			if (doIntersect(myBBox, getClearanceBBox(other))) {
				hasClearanceViolation = true;
			}
		}
		if (iNeedClearance && myClearance && doIntersect(myClearance, otherBBox)) {
			hasClearanceViolation = true;
		}
	}

	return { hasCollision, hasClearanceViolation };
};

/**
 * Clamps a position value to stay within room bounds.
 *
 * @param {number} value - The position value to clamp
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} Clamped value
 */
export const clampToRoom = (value, min, max) => {
	return Math.max(min, Math.min(max, value));
};

/**
 * Calculates the center point of a bounding box.
 *
 * @param {Object} bbox - Bounding box {minX, maxX, minZ, maxZ}
 * @returns {Object} Center point {x, z}
 */
export const getBBoxCenter = (bbox) => {
	return {
		x: (bbox.minX + bbox.maxX) / 2,
		z: (bbox.minZ + bbox.maxZ) / 2,
	};
};

/**
 * Calculates the size (dimensions) of a bounding box.
 *
 * @param {Object} bbox - Bounding box {minX, maxX, minZ, maxZ}
 * @returns {Object} Size {width, depth}
 */
export const getBBoxSize = (bbox) => {
	return {
		width: bbox.maxX - bbox.minX,
		depth: bbox.maxZ - bbox.minZ,
	};
};
