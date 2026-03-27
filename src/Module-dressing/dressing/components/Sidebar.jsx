import React from "react";
import { theme } from "../theme.js";
import { Icons } from "./Icons.jsx";
import { PRESETS, getPresetByType } from "../../utils/presets.js";
import { DIMENSION_LIMITS } from "../../utils/constants.js";

/**
 * ============================================================================
 * SIDEBAR - Panneau latéral de configuration globale (Version Compacte)
 * ============================================================================
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
    <div style={{ ...theme.panel, height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", padding: "10px" }}>
      
      {/* HEADER COMPACT */}
      <div style={{ ...theme.header, paddingBottom: "5px", marginBottom: "5px" }}>
        <h1 style={{ ...theme.titleH1, fontSize: "18px", marginBottom: "2px" }}>Studio Dressing</h1>
        <p style={{ ...theme.subtitle, fontSize: "11px", margin: 0 }}>Configurez votre rangement sur mesure</p>
      </div>

      <div style={{ ...theme.scrollArea, overflow: "hidden", padding: "0 5px", flex: 1 }}>
        
        {/* Section: Inspirations / Presets */}
        <div style={{ ...theme.section, padding: "8px", marginBottom: "8px" }}>
          <div style={{ ...theme.sectionHeader, marginBottom: "4px" }}>
            <Icons.Star width="14" height="14" />
            <h3 style={{ ...theme.sectionTitle, fontSize: "13px", margin: 0 }}>Inspirations</h3>
          </div>
          <div style={{ ...theme.grid2, gap: "5px" }}>
            <button onClick={() => handlePresetClick("suite")} style={{ ...theme.btnSecondary, fontSize: "11px", padding: "4px" }}>
              Suite Parentale
            </button>
            <button onClick={() => handlePresetClick("entree")} style={{ ...theme.btnSecondary, fontSize: "11px", padding: "4px" }}>
              Meuble Entrée
            </button>
            <button onClick={() => handlePresetClick("biblio")} style={{ ...theme.btnSecondary, fontSize: "11px", padding: "4px" }}>
              Bibliothèque
            </button>
          </div>
        </div>

        {/* Section: Dimensions globales */}
        <div style={{ ...theme.section, padding: "8px", marginBottom: "8px" }}>
          <div style={{ ...theme.sectionHeader, marginBottom: "4px" }}>
            <Icons.Layout width="14" height="14" />
            <h3 style={{ ...theme.sectionTitle, fontSize: "13px", margin: 0 }}>Dimensions Globales</h3>
          </div>
          <div style={{ ...theme.inputGroup, marginBottom: "6px" }}>
            <div style={{ ...theme.sliderHeader, marginBottom: "2px" }}>
              <label style={{ ...theme.label, fontSize: "11px", margin: 0 }}>Largeur totale</label>
              <span style={{ ...theme.valueBadge, fontSize: "11px", padding: "2px 6px" }}>{largeurTotaleCM} cm</span>
            </div>
            <input
              type="range"
              min={DIMENSION_LIMITS.LARGEUR.MIN}
              max={DIMENSION_LIMITS.LARGEUR.MAX}
              value={largeurTotaleCM}
              onChange={(e) => setLargeurTotaleCM(Number(e.target.value))}
              style={{ ...theme.slider, margin: "2px 0" }}
            />
          </div>
          <div style={{ ...theme.inputGroup, marginBottom: 0 }}>
            <div style={{ ...theme.sliderHeader, marginBottom: "2px" }}>
              <label style={{ ...theme.label, fontSize: "11px", margin: 0 }}>Profondeur</label>
              <span style={{ ...theme.valueBadge, fontSize: "11px", padding: "2px 6px" }}>{profondeurCM} cm</span>
            </div>
            <input
              type="range"
              min={DIMENSION_LIMITS.PROFONDEUR.MIN}
              max={DIMENSION_LIMITS.PROFONDEUR.MAX}
              value={profondeurCM}
              onChange={(e) => setProfondeurCM(Number(e.target.value))}
              style={{ ...theme.slider, margin: "2px 0" }}
            />
          </div>
        </div>

        {/* Section: Finitions du bois */}
        <div style={{ ...theme.section, padding: "8px", marginBottom: "8px" }}>
          <div style={{ ...theme.sectionHeader, marginBottom: "4px" }}>
            <Icons.Box width="14" height="14" />
            <h3 style={{ ...theme.sectionTitle, fontSize: "13px", margin: 0 }}>Finitions du bois</h3>
          </div>
          <div style={{ ...theme.inputGroup, marginBottom: "6px" }}>
            <label style={{ ...theme.label, fontSize: "11px", marginBottom: "2px" }}>Extérieur (Façades)</label>
            <div style={{ display: "flex", gap: "5px" }}>
              <select
                value={finishExt}
                onChange={(e) => setFinishExt(e.target.value)}
                style={{ ...theme.select, flex: 1, fontSize: "11px", padding: "2px 4px", height: "24px" }}
              >
                <option value="Couleur">Couleur unie</option>
                <option value="Chêne">Bois (Chêne)</option>
              </select>
              <div style={{ ...theme.colorPickerWrapper, height: "24px" }}>
                <input
                  type="color"
                  value={couleurExt}
                  onChange={(e) => setCouleurExt(e.target.value)}
                  style={{ ...theme.colorPicker, padding: 0, height: "100%" }}
                />
              </div>
            </div>
          </div>
          <div style={{ ...theme.inputGroup, marginBottom: 0 }}>
            <label style={{ ...theme.label, fontSize: "11px", marginBottom: "2px" }}>Intérieur (Caissons)</label>
            <div style={{ display: "flex", gap: "5px" }}>
              <select
                value={finishInt}
                onChange={(e) => setFinishInt(e.target.value)}
                style={{ ...theme.select, flex: 1, fontSize: "11px", padding: "2px 4px", height: "24px" }}
              >
                <option value="Couleur">Couleur unie</option>
                <option value="Chêne">Bois (Chêne)</option>
              </select>
              <div style={{ ...theme.colorPickerWrapper, height: "24px" }}>
                <input
                  type="color"
                  value={couleurInt}
                  onChange={(e) => setCouleurInt(e.target.value)}
                  style={{ ...theme.colorPicker, padding: 0, height: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Accessoires */}
        <div style={{ ...theme.section, padding: "8px", marginBottom: "8px" }}>
          <div style={{ ...theme.sectionHeader, marginBottom: "4px" }}>
            <Icons.Settings width="14" height="14" />
            <h3 style={{ ...theme.sectionTitle, fontSize: "13px", margin: 0 }}>Accessoires</h3>
          </div>
          <div style={{ ...theme.inputGroup, marginBottom: 0 }}>
            <label style={{ ...theme.checkboxWrapper, border: "none", padding: "0 0 4px 0", background: "transparent" }}>
              <input
                type="checkbox"
                checked={avecLED}
                onChange={(e) => setAvecLED(e.target.checked)}
                style={{ ...theme.checkbox, margin: "0 6px 0 0", width: "12px", height: "12px" }}
              />
              <span style={{ ...theme.label, margin: 0, fontSize: "11px" }}>Éclairage LED intégré</span>
            </label>
            <label style={{ ...theme.checkboxWrapper, border: "none", padding: 0, background: "transparent" }}>
              <input
                type="checkbox"
                checked={avecPoignees}
                onChange={(e) => setAvecPoignees(e.target.checked)}
                style={{ ...theme.checkbox, margin: "0 6px 0 0", width: "12px", height: "12px" }}
              />
              <span style={{ ...theme.label, margin: 0, fontSize: "11px" }}>Poignées en métal</span>
            </label>
            {avecPoignees && (
              <div style={{ ...theme.colorPickerWrapper, marginTop: "4px", width: "fit-content", height: "20px", display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "10px", color: "#6b7280", marginRight: "6px" }}>Couleur :</span>
                <input
                  type="color"
                  value={couleurPoignees}
                  onChange={(e) => setCouleurPoignees(e.target.value)}
                  style={{ ...theme.colorPicker, width: "24px", height: "16px", padding: 0 }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Section: Pièce (mur et sol) */}
        <div style={{ ...theme.section, padding: "8px", marginBottom: 0 }}>
          <div style={{ ...theme.sectionHeader, marginBottom: "4px" }}>
            <Icons.House width="14" height="14" />
            <h3 style={{ ...theme.sectionTitle, fontSize: "13px", margin: 0 }}>Votre pièce</h3>
          </div>
          <div style={{ ...theme.grid2, gap: "8px" }}>
            <div style={{ ...theme.inputGroup, marginBottom: 0 }}>
              <label style={{ ...theme.label, fontSize: "11px", marginBottom: "2px" }}>Couleur du mur</label>
              <div style={{ ...theme.colorPickerWrapper, height: "24px" }}>
                <input
                  type="color"
                  value={couleurMur}
                  onChange={(e) => setCouleurMur(e.target.value)}
                  style={{ ...theme.colorPicker, width: "100%", height: "100%", padding: 0 }}
                />
              </div>
            </div>
            <div style={{ ...theme.inputGroup, marginBottom: 0 }}>
              <label style={{ ...theme.label, fontSize: "11px", marginBottom: "2px" }}>Couleur du sol</label>
              <div style={{ ...theme.colorPickerWrapper, height: "24px" }}>
                <input
                  type="color"
                  value={couleurSol}
                  onChange={(e) => setCouleurSol(e.target.value)}
                  style={{ ...theme.colorPicker, width: "100%", height: "100%", padding: 0 }}
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