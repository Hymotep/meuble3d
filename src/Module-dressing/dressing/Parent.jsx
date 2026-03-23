import React, { useState, useRef } from "react";
import { useControls, folder } from "leva"; // N'oublie pas d'importer 'folder'
import { Caisson } from "./Caisson";

export function Parent() {
	const [selectedId, setSelectedId] = useState(null);
	const [configs, setConfigs] = useState({});
	const [hauteurs, setHauteurs] = useState({});
	const [tiroirsInt, setTiroirsInt] = useState({});

	const hauteursRef = useRef(hauteurs);
	hauteursRef.current = hauteurs;

	const tiroirsIntRef = useRef(tiroirsInt);
	tiroirsIntRef.current = tiroirsInt;

	// --- MENU LEVA : CONFIGURATION GLOBALE ORGANISEE ---
	const { largeurTotaleCM, profondeurCM, finitionExt, couleurExt, finitionInt, couleurInt, avecPoignees, couleurPoignees } = useControls({
		"📏 DIMENSIONS DU MEUBLE": folder({
			largeurTotaleCM: { value: 120, min: 40, max: 600, step: 1, label: "Largeur (cm)" },
			profondeurCM: { value: 60, min: 30, max: 100, step: 1, label: "Profondeur (cm)" },
		}),

		"🎨 DESIGN EXTERIEUR": folder({
			finitionExt: { options: ["Couleur", "Chêne"], label: "Matière" },
			couleurExt: { value: "#e2b388", label: "Couleur" },
		}),

		"🪵 DESIGN INTERIEUR": folder({
			finitionInt: { options: ["Couleur", "Chêne"], label: "Matière" },
			couleurInt: { value: "#ffffff", label: "Couleur" },
		}),

		"🚪 ACCESSOIRES": folder({
			avecPoignees: { value: true, label: "Activer poignées" },
			couleurPoignees: { value: "#222222", label: "Couleur" },
		}),
	});

	const profondeur = profondeurCM * 10;

	// =========================================================
	// LOGIQUE DE DÉCOUPE DES CAISSONS (FAÇON TYLKO)
	// =========================================================
	const GAP = 2; // Espace entre les caissons en mm
	const MAX_DOOR_WIDTH = 500; // Largeur max d'une porte (50cm)
	const largeurTotaleMM = largeurTotaleCM * 10;

	// 1. Calcul du nombre de portes nécessaires pour ne jamais dépasser MAX_DOOR_WIDTH
	const nbPortes = Math.ceil(largeurTotaleMM / MAX_DOOR_WIDTH);

	// 2. Répartition : on crée un maximum de caissons doubles (2 portes)
	const nbCaissonsDoubles = Math.floor(nbPortes / 2);
	const nbCaissonsSimples = nbPortes % 2; // 1 s'il reste une porte impaire, sinon 0
	const nbCaissonsTotal = nbCaissonsDoubles + nbCaissonsSimples;

	// 3. Calcul de la largeur d'une porte exacte (en déduisant les espaces inter-caissons)
	const totalGaps = Math.max(0, nbCaissonsTotal - 1) * GAP;
	const largeurUtile = largeurTotaleMM - totalGaps;
	const largeurUnitePorte = largeurUtile / nbPortes;

	// 4. Création des données pour chaque caisson
	const caissonsData = [];
	for (let i = 0; i < nbCaissonsDoubles; i++) {
		caissonsData.push({ width: largeurUnitePorte * 2, doorsCount: 2 });
	}
	if (nbCaissonsSimples > 0) {
		caissonsData.push({ width: largeurUnitePorte, doorsCount: 1 });
	}

	// --- MENU LEVA : CAISSON SÉLECTIONNÉ ---
	useControls(
		"🎯 CAISSON SÉLECTIONNÉ",
		() => {
			// Si rien n'est sélectionné, on cache ce menu pour ne pas polluer l'interface
			if (selectedId === null) return {};

			const currentConfig = configs[selectedId] !== undefined ? configs[selectedId] : 4;
			const hasDrawers = [1, 4, 6, 7, 8].includes(currentConfig);

			const controls = {
				[`config_${selectedId}`]: {
					label: `Agencement (N°${selectedId + 1})`,
					options: {
						"Vide (1 Étagère)": 0,
						"Dressing (2 Tiroirs + Penderie)": 1,
						"Dressing (3 Tiroirs + Penderie)": 6,
						"Dressing (4 Tiroirs + Penderie)": 7,
						"Mixte (Porte haute + 2 Tiroirs)": 4,
						"Mixte (Porte haute + 3 Tiroirs)": 8,
						"Bibliothèque (4 Étagères)": 2,
						"Fermé (Porte totale)": 3,
						"Penderie (Barre + Étagère)": 5,
					},
					value: currentConfig,
					onChange: (v) => setConfigs((prev) => ({ ...prev, [selectedId]: v })),
				},

				[`hauteur_${selectedId}`]: {
					label: "Hauteur (cm)",
					value: hauteursRef.current[selectedId] || 200,
					min: 50,
					max: 250,
					step: 1,
					onChange: (v) => setHauteurs((prev) => ({ ...prev, [selectedId]: v })),
				},
			};

			// On affiche l'option des tiroirs avec des labels beaucoup plus explicites
			if (hasDrawers) {
				controls[`tiroirsInt_${selectedId}`] = {
					label: "Type de tiroirs",
					options: { "Visibles (Extérieurs)": false, "Cachés (Intérieurs)": true },
					value: tiroirsIntRef.current[selectedId] || false,
					onChange: (v) => setTiroirsInt((prev) => ({ ...prev, [selectedId]: v })),
				};
			}

			return controls;
		},
		[selectedId, configs],
	);

	// =========================================================
	// GÉNÉRATION DU RENDU DES CAISSONS
	// =========================================================
	const caissonsGeneres = [];
	let currentPositionX = -largeurTotaleMM / 2;

	// On boucle maintenant sur caissonsData au lieu de l'ancien tableau widths
	for (let i = 0; i < caissonsData.length; i++) {
		const currentConfig = configs[i] !== undefined ? configs[i] : 4;
		const currentHauteur = (hauteurs[i] || 200) * 10;
		const currentTiroirsInt = tiroirsInt[i] || false;
		const isRightHinge = i % 2 !== 0;

		caissonsGeneres.push(
			<Caisson
				key={i}
				position={[currentPositionX / 1000, 0, 0]}
				largeur={caissonsData[i].width} // NOUVEAU: Largeur mathématique parfaite calculée plus haut
				doorsCount={caissonsData[i].doorsCount} // NOUVEAU: On transmet le nombre de portes
				hauteur={currentHauteur}
				profondeur={profondeur}
				activeConfig={currentConfig}
				isSelected={selectedId === i}
				finitionExt={finitionExt}
				couleurExt={couleurExt}
				finitionInt={finitionInt}
				couleurInt={couleurInt}
				avecPoignees={avecPoignees}
				couleurPoignees={couleurPoignees}
				isTiroirsInterieurs={currentTiroirsInt}
				isRightHinge={isRightHinge}
				onClick={(e) => {
					e.stopPropagation();
					setSelectedId(i);
				}}
			/>,
		);
		// On incrémente la position en ajoutant l'espace inter-caisson
		currentPositionX += caissonsData[i].width + GAP;
	}

	return <group onPointerMissed={() => setSelectedId(null)}>{caissonsGeneres}</group>;
}
