/**
 * ============================================================================
 * UI THEME & STYLES
 * ============================================================================
 * 
 * Centralized style definitions for the kitchen configurator UI.
 * Using inline styles for simplicity, but structured like a theme system.
 * 
 * This makes it easy to:
 * - Find and modify styles in one place
 * - Maintain visual consistency
 * - Potentially support theming/dark mode later
 */

/**
 * Base spacing unit used throughout the UI.
 * All spacing values are multiples of this.
 */
const SPACING_UNIT = 8;

/**
 * Border radius values for consistent rounded corners.
 */
const BORDER_RADIUS = {
    sm: "4px",
    md: "6px",
    lg: "8px",
    xl: "12px",
    xxl: "16px",
};

/**
 * Color palette used in the UI.
 */
const COLORS = {
    white: "#ffffff",
    gray: {
        50: "#f9fafb",
        100: "#f3f4f6",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#475569",
        700: "#374151",
        800: "#1f2937",
        900: "#111827",
    },
    success: "#10b981",
    danger: "#dc2626",
    dangerLight: "#fecaca",
    info: "#3b82f6",
};

/**
 * Typography settings.
 */
const FONT = {
    family: "'Inter', system-ui, -apple-system, sans-serif",
    sizes: {
        xs: "11px",
        sm: "12px",
        base: "13px",
        lg: "14px",
        xl: "18px",
        "2xl": "28px",
    },
};

/**
 * Main panel (left sidebar) styling.
 * Contains presets, room settings, and catalog.
 */
export const panelStyles = {
    width: "340px",
    background: COLORS.white,
    borderRight: `1px solid ${COLORS.gray[200]}`,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    fontFamily: FONT.family,
    zIndex: 10,
    boxShadow: "4px 0 24px rgba(0,0,0,0.02)",
};

/**
 * Header section at top of sidebar.
 */
export const headerStyles = {
    padding: `${SPACING_UNIT * 2.5}px ${SPACING_UNIT * 2.5}px ${SPACING_UNIT * 2}px`,
    borderBottom: `1px solid ${COLORS.gray[100]}`,
    background: COLORS.white,
};

/**
 * Title (h1) styling.
 */
export const titleH1Styles = {
    margin: 0,
    fontSize: FONT.sizes.xl,
    fontWeight: "600",
    color: COLORS.gray[900],
    letterSpacing: "-0.02em",
};

/**
 * Subtitle styling.
 */
export const subtitleStyles = {
    margin: "4px 0 0 0",
    fontSize: FONT.sizes.xs,
    color: COLORS.gray[500],
    fontWeight: "400",
};

/**
 * Scrollable content area in sidebar.
 */
export const scrollAreaStyles = {
    flex: 1,
    overflowY: "auto",
    padding: `${SPACING_UNIT * 2}px ${SPACING_UNIT * 2.5}px`,
    display: "flex",
    flexDirection: "column",
    gap: `${SPACING_UNIT * 3}px`,
};

/**
 * Section container styling.
 */
export const sectionStyles = {
    display: "flex",
    flexDirection: "column",
    gap: `${SPACING_UNIT * 1.5}px`,
};

/**
 * Section header with icon and title.
 */
export const sectionHeaderStyles = {
    display: "flex",
    alignItems: "center",
    gap: `${SPACING_UNIT}px`,
    borderBottom: `1px solid ${COLORS.gray[100]}`,
    paddingBottom: `${SPACING_UNIT}px`,
    marginBottom: "2px",
};

/**
 * Section title styling.
 */
export const sectionTitleStyles = {
    margin: 0,
    fontSize: FONT.sizes.xs,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: COLORS.gray[900],
};

/**
 * Two-column grid layout for inputs.
 */
export const grid2Styles = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: `${SPACING_UNIT * 1.25}px`,
};

/**
 * Input group container.
 */
export const inputGroupStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
};

/**
 * Label styling.
 */
export const labelStyles = {
    fontSize: FONT.sizes.sm,
    fontWeight: "500",
    color: COLORS.gray[600],
};

/**
 * Text input styling.
 */
export const inputStyles = {
    width: "100%",
    padding: `${SPACING_UNIT}px ${SPACING_UNIT * 1.25}px`,
    borderRadius: BORDER_RADIUS.md,
    border: `1px solid ${COLORS.gray[300]}`,
    fontSize: FONT.sizes.base,
    color: COLORS.gray[900],
    backgroundColor: COLORS.white,
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
};

/**
 * Select dropdown styling.
 */
export const selectStyles = {
    ...inputStyles,
    cursor: "pointer",
};

/**
 * Button row layout (for horizontal button groups).
 */
export const buttonRowStyles = {
    display: "flex",
    gap: `${SPACING_UNIT}px`,
};

/**
 * Outline button styling (secondary action).
 */
export const btnOutlineStyles = {
    flex: 1,
    padding: `${SPACING_UNIT}px`,
    background: COLORS.white,
    color: COLORS.gray[700],
    border: `1px solid ${COLORS.gray[300]}`,
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONT.sizes.sm,
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
};

/**
 * Secondary button styling (filled background).
 */
export const btnSecondaryStyles = {
    width: "100%",
    padding: `${SPACING_UNIT}px`,
    background: COLORS.gray[100],
    color: COLORS.gray[900],
    border: `1px solid ${COLORS.gray[200]}`,
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONT.sizes.sm,
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
};

/**
 * Danger button styling (delete actions).
 */
export const btnDangerStyles = {
    width: "100%",
    padding: `${SPACING_UNIT}px`,
    background: COLORS.white,
    color: COLORS.danger,
    border: `1px solid ${COLORS.dangerLight}`,
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONT.sizes.sm,
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
    marginTop: "4px",
};

/**
 * Color picker wrapper (input + label).
 */
export const colorPickerWrapperStyles = {
    display: "flex",
    alignItems: "center",
    gap: `${SPACING_UNIT}px`,
    padding: `${SPACING_UNIT * 0.5}px ${SPACING_UNIT}px`,
    borderRadius: BORDER_RADIUS.md,
    border: `1px solid ${COLORS.gray[300]}`,
    background: COLORS.white,
};

/**
 * Color input (the actual color picker).
 */
export const colorPickerStyles = {
    width: "20px",
    height: "20px",
    padding: 0,
    border: "none",
    borderRadius: BORDER_RADIUS.sm,
    cursor: "pointer",
    background: "none",
};

/**
 * Color label text.
 */
export const colorLabelStyles = {
    fontSize: FONT.sizes.xs,
    color: COLORS.gray[600],
    fontWeight: "500",
};

/**
 * Checkbox wrapper styling.
 */
export const checkboxWrapperStyles = {
    display: "flex",
    alignItems: "center",
    gap: `${SPACING_UNIT}px`,
    padding: `${SPACING_UNIT}px ${SPACING_UNIT * 1.25}px`,
    border: `1px solid ${COLORS.gray[300]}`,
    borderRadius: BORDER_RADIUS.md,
    cursor: "pointer",
    background: COLORS.white,
};

/**
 * Checkbox input styling.
 */
export const checkboxStyles = {
    width: "14px",
    height: "14px",
    accentColor: COLORS.gray[900],
    cursor: "pointer",
    margin: 0,
};

/**
 * Bottom bar styling (selection panel).
 * Appears at bottom center of screen when item is selected.
 */
export const bottomBarStyles = {
    position: "absolute",
    bottom: `${SPACING_UNIT * 3}px`,
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: COLORS.white,
    padding: `${SPACING_UNIT * 2}px ${SPACING_UNIT * 3}px`,
    borderRadius: BORDER_RADIUS.xxl,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    gap: `${SPACING_UNIT * 3}px`,
    alignItems: "flex-end",
    zIndex: 100,
    border: `1px solid ${COLORS.gray[200]}`,
    fontFamily: FONT.family,
};

/**
 * Section within bottom bar (with right border separator).
 */
export const bottomBarSectionStyles = {
    display: "flex",
    flexDirection: "column",
    gap: `${SPACING_UNIT}px`,
    borderRight: `1px solid ${COLORS.gray[100]}`,
    paddingRight: `${SPACING_UNIT * 3}px`,
};

/**
 * Last section in bottom bar (no border).
 */
export const bottomBarSectionLastStyles = {
    display: "flex",
    flexDirection: "column",
    gap: `${SPACING_UNIT}px`,
};

/**
 * Price estimate panel styling (top right corner).
 */
export const devisPanelStyles = {
    position: "absolute",
    top: `${SPACING_UNIT * 3}px`,
    right: `${SPACING_UNIT * 3}px`,
    backgroundColor: COLORS.white,
    color: COLORS.white,
    padding: `${SPACING_UNIT * 2}px ${SPACING_UNIT * 3}px`,
    borderRadius: BORDER_RADIUS.xl,
    boxShadow: "0 10px 25px rgba(170, 170, 170, 0.2)",
    zIndex: 100,
    fontFamily: FONT.family,
    minWidth: "200px",
    display: "flex",
    flexDirection: "column",
    gap: `${SPACING_UNIT}px`,
};

/**
 * Convenience export: all styles merged into single object.
 * Useful for components that need multiple style objects.
 */
export const theme = {
    panel: panelStyles,
    header: headerStyles,
    titleH1: titleH1Styles,
    subtitle: subtitleStyles,
    scrollArea: scrollAreaStyles,
    section: sectionStyles,
    sectionHeader: sectionHeaderStyles,
    sectionTitle: sectionTitleStyles,
    grid2: grid2Styles,
    inputGroup: inputGroupStyles,
    label: labelStyles,
    input: inputStyles,
    select: selectStyles,
    buttonRow: buttonRowStyles,
    btnOutline: btnOutlineStyles,
    btnSecondary: btnSecondaryStyles,
    btnDanger: btnDangerStyles,
    colorPickerWrapper: colorPickerWrapperStyles,
    colorPicker: colorPickerStyles,
    colorLabel: colorLabelStyles,
    checkboxWrapper: checkboxWrapperStyles,
    checkbox: checkboxStyles,
    bottomBar: bottomBarStyles,
    bottomBarSection: bottomBarSectionStyles,
    bottomBarSectionLast: bottomBarSectionLastStyles,
    devisPanel: devisPanelStyles,
};
