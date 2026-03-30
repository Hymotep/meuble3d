import React from "react";
import { useStore } from "../store/store";
import { Icons } from "./Icons";

const FloatingActionMenu = () => {
	const selectedId = useStore((s) => s.selectedId);
	const items = useStore((s) => s.items);
	const setIsEditingItem = useStore((s) => s.setIsEditingItem);
	const updateItemRotation = useStore((s) => s.updateItemRotation);
	const deleteItem = useStore((s) => s.deleteItem);

	if (!selectedId) return null;
	const item = items.find((i) => i.id === selectedId);
	if (!item) return null;

	const btnStyle = {
		width: "48px",
		height: "48px",
		borderRadius: "50%",
		background: "#ffffff",
		border: "1px solid #e5e7eb",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		cursor: "pointer",
		color: "#111827",
		boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
		transition: "transform 0.1s, background 0.2s",
	};

	return (
		<div style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "16px", zIndex: 100 }}>
			<button
				onClick={() => setIsEditingItem(true)}
				style={btnStyle}
				title="Modifier le meuble"
				onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
				onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
			>
				<Icons.Edit />
			</button>
			<button
				onClick={() => updateItemRotation(selectedId, (item.rotation + 90) % 360)}
				style={btnStyle}
				title="Pivoter à 90°"
				onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
				onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
			>
				<Icons.Rotate />
			</button>
			<button
				onClick={() => deleteItem(selectedId)}
				style={{ ...btnStyle, color: "#ef4444" }}
				title="Supprimer le meuble"
				onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
				onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
			>
				<Icons.Trash />
			</button>
		</div>
	);
};

export default FloatingActionMenu;
