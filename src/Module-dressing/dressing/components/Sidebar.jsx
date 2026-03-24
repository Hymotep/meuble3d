import React from "react";
import { theme } from "../theme.js";
import { Icons } from "./Icons.jsx";
import { PRESETS, getPresetByType } from "../../utils/presets.js";
import { DIMENSION_LIMITS } from "../../utils/constants.js";

/**
 * ============================================================================
 * SIDEBAR - Panneau latéral de configuration globale
 * ============================================================================
 * Ce composant gère tous les contrôles globaux du dressing :
 * - Inspirations (presets)
 * - Dimensions (largeur, profondeur)
 * - Finitions (extérieur, intérieur)
 * - Accessoires (LED, poignées)
 * - Pièce (couleur mur, sol)
 */

export function Sidebar({
  largeurTotaleCM,
  setLargeurTotaleCM,
  profondeurCM,
  setProfondeurCM,
  finishExt,
  setFinishExt,
  couleurExt,
  setCouleurExt,
  finishInt,
  setFinishInt,
  couleurInt,
  setCouleurInt,
  avecPoignees,
  setAvecPoignees,
  couleurPoignees,
  setCouleurPoignees,
  avecLED,
  setAvecLED,
  couleurMur,
  setCouleurMur,
  couleurSol,
  setCouleurSol,
  onLoadPreset,
}) {
  const handlePresetClick = (presetType) => {
    const preset = getPresetByType(presetType);
    if (preset) {
      onLoadPreset(preset);
    }
  };

  return (
    <div style={theme.panel}>
      <div style={theme.header}>
        <h1 style={theme.titleH1}>Studio Dressing</h1>
        <p style={theme.subtitle}>Configurez votre rangement sur mesure</p>
      </div>

      <div style={theme.scrollArea}>
        {/* Section: Inspirations / Presets */}
        <div style={theme.section}>
          <div style={theme.sectionHeader}>
            <Icons.Star />
            <h3 style={theme.sectionTitle}>Inspirations</h3>
          </div>
          <div style={theme.grid2}>
            <button onClick={() => handlePresetClick("suite")} style={theme.btnSecondary}>
              Suite Parentale
            </button>
            <button onClick={() => handlePresetClick("entree")} style={theme.btnSecondary}>
              Meuble Entrée
            </button>
            <button onClick={() => handlePresetClick("biblio")} style={theme.btnSecondary}>
              Bibliothèque
            </button>
          </div>
        </div>

        {/* Section: Dimensions globales */}
        <div style={theme.section}>
          <div style={theme.sectionHeader}>
            <Icons.Layout />
            <h3 style={theme.sectionTitle}>Dimensions Globales</h3>
          </div>
          <div style={theme.inputGroup}>
            <div style={theme.sliderHeader}>
              <label style={theme.label}>Largeur totale</label>
              <span style={theme.valueBadge}>{largeurTotaleCM} cm</span>
            </div>
            <input
              type="range"
              min={DIMENSION_LIMITS.LARGEUR.MIN}
              max={DIMENSION_LIMITS.LARGEUR.MAX}
              value={largeurTotaleCM}
              onChange={(e) => setLargeurTotaleCM(Number(e.target.value))}
              style={theme.slider}
            />
          </div>
          <div style={theme.inputGroup}>
            <div style={theme.sliderHeader}>
              <label style={theme.label}>Profondeur</label>
              <span style={theme.valueBadge}>{profondeurCM} cm</span>
            </div>
            <input
              type="range"
              min={DIMENSION_LIMITS.PROFONDEUR.MIN}
              max={DIMENSION_LIMITS.PROFONDEUR.MAX}
              value={profondeurCM}
              onChange={(e) => setProfondeurCM(Number(e.target.value))}
              style={theme.slider}
            />
          </div>
        </div>

        {/* Section: Finitions du bois */}
        <div style={theme.section}>
          <div style={theme.sectionHeader}>
            <Icons.Box />
            <h3 style={theme.sectionTitle}>Finitions du bois</h3>
          </div>
          <div style={theme.inputGroup}>
            <label style={theme.label}>Extérieur (Façades)</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <select
                value={finishExt}
                onChange={(e) => setFinishExt(e.target.value)}
                style={{ ...theme.select, flex: 1 }}
              >
                <option value="Couleur">Couleur unie</option>
                <option value="Chêne">Bois (Chêne)</option>
              </select>
              <div style={theme.colorPickerWrapper}>
                <input
                  type="color"
                  value={couleurExt}
                  onChange={(e) => setCouleurExt(e.target.value)}
                  style={theme.colorPicker}
                />
              </div>
            </div>
          </div>
          <div style={theme.inputGroup}>
            <label style={theme.label}>Intérieur (Caissons)</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <select
                value={finishInt}
                onChange={(e) => setFinishInt(e.target.value)}
                style={{ ...theme.select, flex: 1 }}
              >
                <option value="Couleur">Couleur unie</option>
                <option value="Chêne">Bois (Chêne)</option>
              </select>
              <div style={theme.colorPickerWrapper}>
                <input
                  type="color"
                  value={couleurInt}
                  onChange={(e) => setCouleurInt(e.target.value)}
                  style={theme.colorPicker}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Accessoires */}
        <div style={theme.section}>
          <div style={theme.sectionHeader}>
            <Icons.Settings />
            <h3 style={theme.sectionTitle}>Accessoires</h3>
          </div>
          <div style={theme.inputGroup}>
            <label style={{ ...theme.checkboxWrapper, border: "none", padding: "0 0 8px 0", background: "transparent" }}>
              <input
                type="checkbox"
                checked={avecLED}
                onChange={(e) => setAvecLED(e.target.checked)}
                style={theme.checkbox}
              />
              <span style={{ ...theme.label, margin: 0, fontSize: "14px" }}>Éclairage LED intégré</span>
            </label>
            <label style={{ ...theme.checkboxWrapper, border: "none", padding: 0, background: "transparent" }}>
              <input
                type="checkbox"
                checked={avecPoignees}
                onChange={(e) => setAvecPoignees(e.target.checked)}
                style={theme.checkbox}
              />
              <span style={{ ...theme.label, margin: 0, fontSize: "14px" }}>Poignées en métal</span>
            </label>
            {avecPoignees && (
              <div style={{ ...theme.colorPickerWrapper, marginTop: "8px", width: "fit-content" }}>
                <span style={{ fontSize: "12px", color: "#6b7280", marginRight: "8px" }}>Couleur :</span>
                <input
                  type="color"
                  value={couleurPoignees}
                  onChange={(e) => setCouleurPoignees(e.target.value)}
                  style={theme.colorPicker}
                />
              </div>
            )}
          </div>
        </div>

        {/* Section: Pièce (mur et sol) */}
        <div style={theme.section}>
          <div style={theme.sectionHeader}>
            <Icons.House />
            <h3 style={theme.sectionTitle}>Votre pièce</h3>
          </div>
          <div style={theme.grid2}>
            <div style={theme.inputGroup}>
              <label style={theme.label}>Couleur du mur</label>
              <div style={theme.colorPickerWrapper}>
                <input
                  type="color"
                  value={couleurMur}
                  onChange={(e) => setCouleurMur(e.target.value)}
                  style={{ ...theme.colorPicker, width: "100%" }}
                />
              </div>
            </div>
            <div style={theme.inputGroup}>
              <label style={theme.label}>Couleur du sol</label>
              <div style={theme.colorPickerWrapper}>
                <input
                  type="color"
                  value={couleurSol}
                  onChange={(e) => setCouleurSol(e.target.value)}
                  style={{ ...theme.colorPicker, width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
