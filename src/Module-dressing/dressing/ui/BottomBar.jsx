import React from "react";
import { theme } from "../theme.js";
import { CONFIG_LABELS, DIMENSION_LIMITS, CONFIG_WITH_DRAWERS } from "../../utils/constants.js";

/**
 * ============================================================================
 * BOTTOM BAR - Barre de configuration d'un caisson spécifique
 * ============================================================================
 * Ce composant apparaît lorsqu'un caisson est sélectionné.
 * Il permet de configurer :
 * - Le type d'agencement (configuration)
 * - La hauteur du caisson
 * - Le type de tiroirs (visibles/cachés)
 */

export function BottomBar({
  selectedId,
  config,
  hauteur,
  isTiroirsInterieurs,
  onConfigChange,
  onHauteurChange,
  onTiroirsTypeChange,
}) {
  if (selectedId === null) return null;

  const currentConfig = config !== undefined ? config : 4;
  const currentHauteur = hauteur || 200;
  const hasTiroirs = CONFIG_WITH_DRAWERS.includes(currentConfig);

  return (
    <div style={theme.bottomBar}>
      {/* Sélection de la configuration */}
      <div style={theme.bottomBarSection}>
        <label style={theme.sectionTitle}>Agencement (Module {selectedId + 1})</label>
        <select
          value={currentConfig}
          onChange={(e) => onConfigChange(Number(e.target.value))}
          style={{ ...theme.select, width: "260px" }}
        >
          {Object.entries(CONFIG_LABELS).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Slider de hauteur */}
      <div style={{ ...theme.bottomBarSection, width: "200px" }}>
        <div style={theme.sliderHeader}>
          <label style={theme.sectionTitle}>Hauteur</label>
          <span style={theme.valueBadge}>{currentHauteur} cm</span>
        </div>
        <input
          type="range"
          min={DIMENSION_LIMITS.HAUTEUR.MIN}
          max={DIMENSION_LIMITS.HAUTEUR.MAX}
          value={currentHauteur}
          onChange={(e) => onHauteurChange(Number(e.target.value))}
          style={theme.slider}
        />
      </div>

      {/* Type de tiroirs (si applicable) */}
      {hasTiroirs && (
        <div style={{ ...theme.bottomBarSection, borderRight: "none", paddingRight: 0 }}>
          <label style={theme.sectionTitle}>Type de tiroirs</label>
          <select
            value={isTiroirsInterieurs ? "hidden" : "visible"}
            onChange={(e) => onTiroirsTypeChange(e.target.value === "hidden")}
            style={{ ...theme.select, width: "180px" }}
          >
            <option value="visible">Visibles (Extérieurs)</option>
            <option value="hidden">Cachés (Intérieurs)</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default BottomBar;
