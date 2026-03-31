/**
 * ============================================================================
 * DRESSING CONFIGURATOR - Composant principal
 * ============================================================================
 * Ce fichier est le point d'entrée du configurateur de dressing.
 * Il orchestre l'ensemble des composants UI et 3D.
 * (Logique d'état extraite dans useDressingState)
 */

import React, { useRef } from "react";

// Composants UI & 3D
import { Sidebar } from "./components/Sidebar.jsx";
import QuoteBox from "./components/QuoteBox.jsx";
import BottomBar from "./components/BottomBar.jsx";
import Scene from "./components/Scene.jsx";
import Room from "./components/Room.jsx";
import { Caisson } from "./Caisson.jsx";

// Hook logique
import { useDressingState } from "./hooks/DressingConfigurator/useDressingState.js";

export default function DressingConfigurator() {
	// Récupération de toute la logique via notre Hook
	const { state, actions, computed } = useDressingState();
	const orbitRef = useRef(null);

	return (
		<div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden", background: "#f8fafc" }}>
			{/* Sidebar (à gauche) */}
			<Sidebar
				largeurTotaleCM={state.largeurTotaleCM}
				setLargeurTotaleCM={actions.setLargeurTotaleCM}
				profondeurCM={state.profondeurCM}
				setProfondeurCM={actions.setProfondeurCM}
				finishExt={state.finitionExt}
				setFinishExt={actions.setFinitionExt}
				couleurExt={state.couleurExt}
				setCouleurExt={actions.setCouleurExt}
				finishInt={state.finitionInt}
				setFinishInt={actions.setFinitionInt}
				couleurInt={state.couleurInt}
				setCouleurInt={actions.setCouleurInt}
				avecPoignees={state.avecPoignees}
				setAvecPoignees={actions.setAvecPoignees}
				couleurPoignees={state.couleurPoignees}
				setCouleurPoignees={actions.setCouleurPoignees}
				avecLED={state.avecLED}
				setAvecLED={actions.setAvecLED}
				couleurMur={state.couleurMur}
				setCouleurMur={actions.setCouleurMur}
				couleurSol={state.couleurSol}
				setCouleurSol={actions.setCouleurSol}
				onLoadPreset={actions.loadPreset}
			/>

			{/* Zone principale (3D + UI) */}
			<div style={{ flex: 1, position: "relative" }}>
				{/* Panier / Prix */}
				<QuoteBox totalPrice={computed.totalPrice} />

				{/* Barre de configuration (si un caisson est sélectionné) */}
				<BottomBar
					selectedId={state.selectedId}
					config={state.configs[state.selectedId]}
					hauteur={state.hauteurs[state.selectedId]}
					isTiroirsInterieurs={state.tiroirsInt[state.selectedId]}
					onConfigChange={(value) => actions.setConfigs((p) => ({ ...p, [state.selectedId]: value }))}
					onHauteurChange={(value) => actions.setHauteurs((p) => ({ ...p, [state.selectedId]: value }))}
					onTiroirsTypeChange={(value) => actions.setTiroirsInt((p) => ({ ...p, [state.selectedId]: value }))}
				/>

				{/* Scène 3D */}
				<Scene
					largeurTotaleCM={state.largeurTotaleCM}
					hauteurs={state.hauteurs}
					orbitRef={orbitRef}
					onPointerMissed={() => actions.setSelectedId(null)}
				>
					<Room couleurMur={state.couleurMur} couleurSol={state.couleurSol} profondeurCM={state.profondeurCM} />

					{/* Rendu déclaratif des caissons (Plus de boucle for() sale !) */}
					<group>
						{computed.caissonsData.map((caisson) => (
							<Caisson
								key={caisson.id}
								position={[caisson.positionX, 0, 0]}
								largeur={caisson.width}
								doorsCount={caisson.doorsCount}
								hauteur={caisson.hauteurMM}
								profondeur={state.profondeur}
								activeConfig={caisson.configId}
								isSelected={state.selectedId === caisson.id}
								finitionExt={state.finitionExt}
								couleurExt={state.couleurExt}
								finitionInt={state.finitionInt}
								couleurInt={state.couleurInt}
								avecPoignees={state.avecPoignees}
								couleurPoignees={state.couleurPoignees}
								avecLED={state.avecLED}
								isTiroirsInterieurs={caisson.isTiroirsInt}
								isRightHinge={caisson.isRightHinge}
								onClick={(e) => {
									e.stopPropagation();
									actions.setSelectedId(caisson.id);
								}}
							/>
						))}
					</group>
				</Scene>
			</div>
		</div>
	);
}
