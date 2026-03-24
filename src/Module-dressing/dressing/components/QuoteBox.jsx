import React from "react";
import { theme } from "../theme.js";

/**
 * ============================================================================
 * QUOTE BOX - Affichage du prix en temps réel
 * ============================================================================
 * Ce composant affiche le prix estimé TTC du dressing.
 * Il se met à jour automatiquement via les props.
 */

export function QuoteBox({ totalPrice }) {
  return (
    <div style={theme.quoteBox}>
      <div>
        <p style={theme.quoteLabel}>Prix estimé TTC</p>
        <h2 style={theme.quotePrice}>{totalPrice.toLocaleString("fr-FR")} €</h2>
      </div>
    </div>
  );
}

export default QuoteBox;
