# ⚽ DZ-RPE Foot U17 (PWA)
> **Application Progressive Web de Monitoring de la Charge d'Entraînement (sRPE), Ratio ACWR et Bien-être (Hooper) pour les Clubs de Football en Algérie.**

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline_First-0052CC?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Bundle Size](https://img.shields.io/badge/Bundle_Entry-308_Ko_(97_Ko_gzip)-success)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Présentation & Objectifs

**DZ-RPE Foot U17** est une solution technologique à faible coût et haute précision développée pour les entraîneurs, préparateurs physiques et directeurs techniques de clubs de football en Algérie (catégories U15, U17, U19 et Seniors). 

Conçue pour répondre aux contraintes du terrain algérien :
1. **Zéro friction de saisie** : Mode Kiosk de banc de touche permettant à 20 joueurs d'enregistrer leur RPE en moins de 2 minutes sur un seul smartphone ou tablette.
2. **Accessibilité linguistique** : Interface trilingue (**Français**, **Arabe** avec terminologie footballistique locale *"ساهل، صعيب، عيّان بزاف"*, et **Anglais**) avec support RTL natif.
3. **Fonctionnement 100% Hors-Ligne (Offline-First)** : Enregistrement local instantané sans dépendance au réseau 3G/4G, mise en cache Workbox des polices Google Fonts (*Cairo*, *Inter*), et persistance de stockage garantie via `navigator.storage.persist()`.
4. **Modèles Scientifiques Validés** : Intégration des modèles de **Foster (sRPE, 2001)**, **Gabbett (ACWR Uncoupled, 2016)** et **Hooper & Mackinnon (Indice de Bien-Être, 1995)** avec gestion de l'étalonnage des premières semaines.
5. **Ergonomie Extérieure** : Mode Plein Soleil (*High-Contrast Sunlight Mode*) pour une lisibilité parfaite sous forte exposition en plein air.

---

## 🔬 Fondements Scientifiques & Algorithmes

### 1. Session-RPE (Carl Foster, 2001)
La charge d'entraînement quotidienne est calculée selon l'échelle Borg CR-10 modifiée :
$$\text{Charge (UA)} = \text{Note RPE (0 à 10)} \times \text{Durée effective (minutes)}$$
*Recommandation terrain : Recueil 15 à 30 minutes après la séance pour éviter le biais de récence.*

### 2. Ratio Charge Aiguë / Charge Chronique (ACWR - Tim Gabbett, 2016)
$$\text{ACWR} = \frac{\text{Charge Aiguë (7 derniers jours)}}{\text{Charge Chronique (Moyenne hebdomadaire sur 28 jours - fenêtre non-couplée)}}$$

* **Gestion du Biais Initial (< 21 jours d'historique)** :
  - Durant les 3 premières semaines, la division fixe par 4 faussait l'ACWR en créant un pic artificiel ($> 4.0$).
  - L'algorithme normalise désormais par le nombre de semaines réelles observées et ancre la base sur la charge aiguë.
  - Un badge visuel d'information `Étalonnage (X/21j)` alerte le staff pendant la phase de calibration initiale.
* **Fenêtre ACWR Uncoupled** : La charge chronique est calculée sur la fenêtre $t-27$ à $t-7$ (21 jours / 3) pour éliminer l'autocorrélation mathématique (collinéarité aigu-chronique).
* **Interprétation des Zones de Risque** :
  * **$< 0.80$** : Sous-entraînement / Risque de désadaptation.
  * **$0.80 - 1.30$** : **Sweet Spot** (Zone optimale de progression et protection contre les blessures).
  * **$1.30 - 1.49$** : Zone de vigilance modérée.
  * **$\ge 1.50$** : **Zone Rouge / Danger** (Risque relatif de blessure multiplié par 2 à 4).

### 3. Monotonie & Contrainte (Strain)
$$\text{Monotonie} = \frac{\text{Moyenne de charge sur 7 jours}}{\text{Écart-type de charge sur 7 jours}}$$
$$\text{Strain} = \text{Charge Hebdomadaire Totale} \times \text{Monotonie}$$
*Une monotonie $> 2.0$ associée à un strain élevé est un prédicteur majeur de surentraînement et d'infections respiratoires.*

### 4. Indice de Bien-Être Hooper (1995)
Score pré-séance composé de 4 items notés de 1 (Optimal) à 5 (Très mauvais) :
$$\text{Score Hooper} = \text{Sommeil} + \text{Courbatures (DOMS)} + \text{Fatigue} + \text{Stress}$$
*Valeur par défaut fixée à `null` (affichage `—`) lorsqu'aucun questionnaire n'a été complété pour la journée.*

---

## 🚀 Fonctionnalités Clés

### 📱 Kiosk de Banc de Touche Ultra-Rapide
* **Tri par Maillot** : Grille ordonnée par numéro de maillot croissant (`#1, #2, #3...`).
* **Pills de Durée Rapide** : Raccourcis 1-clic (`90'`, `75'`, `60'`, `45'`, `30'`, `15'`) pour ajuster instantanément le temps de jeu effectif.
* **Retour Haptique** : Vibrations discrètes (`navigator.vibrate`) lors de la sélection sur l'échelle Borg et l'enregistrement.
* **Double Mode Kiosk** :
  * **Mode Coach Direct** : Saisie fluide et assistée par l'encadrement technique.
  * **Mode Borne PIN** : Sécurisation individuelle avec pavé numérique 4 chiffres par joueur et déverrouillage maître par bouton Coach.
* **Création Rapide du Jour** : Bouton `+ Aujourd'hui` permettant d'initialiser la séance de la journée directement depuis le Kiosk.

### ☀️ Mode Plein Soleil (High-Contrast Sunlight)
* Bascule instantanée jour/nuit dans la barre de navigation.
* Thème à contraste absolu (fond blanc `#ffffff`, textes et bordures `#000000`, couleurs Borg éclatantes) pensé pour les écrans de smartphone sous le soleil vif des stades en Algérie.

### 📊 Tableau de Bord & Matrice de Risque
* Graphiques d'équipe sur 14 jours (charge, monotonie, strain).
* Encapsulation `dir="ltr"` sur les visualisations Recharts pour garantir un tracé temporel parfait en affichage RTL (arabe).
* Radar de fatigue Hooper et alertes visuelles immédiates pour les joueurs en zone critique.

### 📄 Rapports, Exports & Impression
* **Impression Vectorielle** : Bouton d'impression navigateur direct (`window.print()`) avec mise en page A4 aux couleurs nationales algériennes.
* **Export Excel Multi-feuilles (.xlsx)** : Colonnes auto-ajustées, prêt pour analyses statistiques avancées sous **Jamovi**, **SPSS** ou **R**.
* **Export PDF Officiel** : Fiche récapitulative pour la Direction Technique Sportive (DTS).
* **Sauvegarde & Restauration JSON** : Portabilité totale des données sans serveur ni abonnement.

### ⚡ Performance & PWA Offline
* **Code-Splitting** : Découpage dynamique via `React.lazy` et chargement à la demande de `xlsx` et `jspdf`. Taille du bundle d'entrée réduite à **308 Ko** (97 Ko gzip).
* **Mise en cache PWA Complète** : Icônes 192x192 et 512x512 maskables, polices Cairo/Inter en cache local, support du `safe-area-inset` pour iPhone et Android modernes.

---

## 🛠️ Stack Technique

* **Framework** : [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Bundler & Build Tool** : [Vite 8](https://vitejs.dev/)
* **Styling** : [Tailwind CSS 4](https://tailwindcss.com/)
* **Graphiques & Visualisations** : [Recharts](https://recharts.org/)
* **PWA & Cache Hors-Ligne** : [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) + Workbox
* **Génération PDF & Excel** : `jspdf`, `jspdf-autotable`, `xlsx` (chargement dynamique)
* **Icônes** : [Lucide React](https://lucide.dev/)
* **Linter** : [Oxlint](https://oxc.rs/)

---

## 👨‍🔬 Auteur & Crédits

**Dr. Salah ALIOUI**  
*PhD en Sciences et Techniques des Activités Physiques et Sportives (STAPS)*  
Enseignant d'Éducation Physique et Sportive (EPS) • Chercheur en Sciences du Sport  
Développeur Vibe Coding & Spécialiste Data Sports  
📍 *El Bayadh / Tissemsilt, Algérie*

* **GitHub** : [@Salahalioui](https://github.com/Salahalioui)
* **Email Académique** : `salaheddine.allioui@univ-tissemsilt.dz`
* **Affiliation** : Université de Tissemsilt, Algérie

---

## 📦 Installation & Démarrage Local

```bash
# 1. Cloner le dépôt
git clone https://github.com/Salahalioui/dz-rpe-foot.git
cd dz-rpe-foot

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev

# 4. Vérifier la qualité du code
npm run lint

# 5. Compiler pour la production
npm run build
```

---

## 🌐 Déploiement sur Vercel en 1-Clic

1. Rendez-vous sur [Vercel](https://vercel.com/new).
2. Connectez votre compte GitHub et importez le dépôt `dz-rpe-foot`.
3. Conservez les paramètres par défaut (**Framework Preset: Vite**).
4. Cliquez sur **Deploy**. Votre PWA sera immédiatement disponible en ligne avec HTTPS et activation du Service Worker.

---

## 📄 Licence
Distribué sous la licence MIT. Voir `LICENSE` pour plus de détails.
