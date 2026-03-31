/**
 * ============================================================================
 * DEVIS PANEL COMPONENT
 * ============================================================================
 *
 * Displays real-time price estimate for the kitchen configuration.
 */

import React, { useMemo } from "react";
import { useStore } from "../store/store";
import { calculateItemPrice } from "../utils/Sidebar/pricing";
import { theme } from "../utils/Sidebar/theme";
import { Icons } from "./Icons";

const DevisPanel = () => {
	const items = useStore((state) => state.items);

	const total = useMemo(() => {
		return items.reduce((sum, item) => sum + calculateItemPrice(item), 0);
	}, [items]);

	const cabinetCount = items.filter((item) => item.type !== "window").length;

	return (
		<div style={theme.devisPanel}>
			<div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #000000", paddingBottom: "8px" }}>
				<Icons.Cart />
				<span style={{ fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "#030303" }}>
					Devis Estimatif
				</span>
			</div>
			<div style={{ fontSize: "28px", fontWeight: "700", color: "#000000", marginTop: "4px" }}>{total.toLocaleString("fr-FR")} €</div>
			<div style={{ fontSize: "11px", color: "#6b7280" }}>{cabinetCount} éléments inclus</div>
		</div>
	);
};

export default DevisPanel;
