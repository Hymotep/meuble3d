/**
 * ============================================================================
 * PRICING CONFIGURATION
 * ============================================================================
 * 
 * Contains the pricing table for all cabinet types and optional add-ons.
 * Used by the DevisPanel component to calculate total project estimates.
 * 
 * All prices are in euros (€).
 */

/**
 * Base prices for cabinets, organized by type and width.
 * Key: cabinet type (base_cabinet, wall_cabinet, tall_cabinet, island)
 * Value: object mapping width (mm) to price (€)
 * 
 * Example: base_cabinet with 600mm width costs 150€
 */
export const CABINET_PRICES = {
    /** Floor-level base cabinets */
    base_cabinet: {
        400: 120,
        600: 150,
        800: 180,
        1000: 210,
    },

    /** Upper wall cabinets mounted above countertop */
    wall_cabinet: {
        400: 90,
        600: 110,
        800: 140,
        1000: 160,
    },

    /** Tall column cabinets (typically contain oven/microwave) */
    tall_cabinet: {
        600: 250,
    },

    /** Kitchen islands - price varies significantly by size */
    island: {
        1200: 350,
        1800: 450,
        2400: 550,
    },
};

/**
 * Optional add-ons and equipment that can be added to cabinets.
 * These are added ON TOP of the base cabinet price.
 * 
 * Example: base_cabinet (600mm) = 150€ + sink (150€) = 300€
 */
export const OPTIONS_PRICES = {
    /** Cabinet handles/knobs */
    poignees: 15,

    /** Interior drawer system (vs external doors) */
    tiroirs: 80,

    /** Kitchen sink (installed in base cabinet) */
    sink: 150,

    /** Cooking surface / stovetop */
    cooktop: 250,

    /** Built-in oven + microwave combination */
    oven_microwave: 500,
};

/**
 * Default price used when a cabinet width doesn't have a specific price.
 * This ensures we always have a price even for custom sizes.
 */
export const DEFAULT_CABINET_PRICE = 150;

/**
 * Default configuration for new cabinets.
 * These values are used when generating new items via the sidebar.
 */
export const DEFAULT_CABINET_CONFIG = {
    activeConfig: 4,
    couleurExt: "#ffffff",
    couleurInt: "#e5e7eb",
    avecPoignees: true,
    couleurPoignees: "#222222",
    isTiroirsInterieurs: false,
    couleurPlanTravail: "#daba9e",
    equipement: "none",
    useTextures: false,
};

/**
 * Calculates the total price for a single cabinet item.
 * 
 * @param {Object} item - The cabinet item from the store
 * @returns {number} Total price in euros
 */
export const calculateItemPrice = (item) => {
    if (item.type === 'window') return 0;

    const width = item.dimensions.width;
    let price = 0;

    // Get base price from pricing table, or use default
    if (CABINET_PRICES[item.type] && CABINET_PRICES[item.type][width]) {
        price += CABINET_PRICES[item.type][width];
    } else {
        price += DEFAULT_CABINET_PRICE;
    }

    // Add optional equipment prices
    if (item.config?.avecPoignees) {
        price += OPTIONS_PRICES.poignees;
    }
    if (item.config?.isTiroirsInterieurs) {
        price += OPTIONS_PRICES.tiroirs;
    }
    if (item.config?.equipement === 'sink') {
        price += OPTIONS_PRICES.sink;
    }
    if (item.config?.equipement === 'cooktop') {
        price += OPTIONS_PRICES.cooktop;
    }
    if (item.config?.equipement === 'oven_microwave') {
        price += OPTIONS_PRICES.oven_microwave;
    }

    return price;
};
