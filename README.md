# ⚽ DZ-RPE Foot U17 (PWA)
> **Application Progressive Web de Monitoring de la Charge d'Entraînement (sRPE), Ratio ACWR et Bien-être (Hooper) pour les Clubs de Football en Algérie.**

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline_First-0052CC?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Présentation & Objectifs

**DZ-RPE Foot U17** est une solution technologique à faible coût et haute précision développée pour les entraîneurs, préparateurs physiques et directeurs techniques de clubs de jeunes en Algérie (catégories U15, U17, U19 et Seniors). 

Elle résout les contraintes majeures du terrain algérien :
1. **Zéro friction de saisie** : Mode Kiosk de banc de touche permettant à 20 joueurs de noter leur RPE en moins de 2 minutes sur un seul smartphone/tablette.
2. **Accessibilité linguistique** : Interface trilingue (**Français**, **Arabe** avec terminologie footballistique locale *"ساهل، صعيب، عيّان بزاف"*, et **Anglais**).
3. **Fonctionnement 100% Hors-Ligne (Offline-First)** : Enregistrement local instantané sur le terrain sans dépendance à la connexion 3G/4G, avec synchronisation et exports PDF/Excel directs.
4. **Calculs Scientifiques Automatisés** : Intégration directe des modèles validés de **Foster (sRPE)**, **Gabbett (ACWR Uncoupled)** et **Hooper & Mackinnon (Indice de Bien-Être)**.

---

## 🔬 Fondements Scientifiques & Algorithmes

### 1. Session-RPE (Carl Foster, 2001)
La charge d'entraînement quotidienne est calculée selon l'échelle Borg CR-10 modifiée :
$$\text{Charge (UA)} = \text{Note RPE (0 à 10)} \times \text{Durée effective (minutes)}$$
*Protocole : Recueil 15 à 30 minutes après la fin de la séance pour éviter le biais de récence.*

### 2. Ratio Charge Aiguë / Charge Chronique (ACWR - Tim Gabbett, 2016)
$$\text{ACWR} = \frac{\text{Charge Aiguë (Somme 7 jours)}}{\text{Charge Chronique (Moyenne hebdomadaire sur 28 jours)}}$$
* **$< 0.80$** : Sous-entraînement / Risque de désadaptation.
* **$0.80 - 1.30$** : **Sweet Spot** (Zone optimale de progression et protection contre les blessures).
* **$1.30 - 1.49$** : Zone d'alerte / Vigilance.
* **$\ge 1.50$** : **Zone Rouge / Danger** (Risque relatif de blessure multiplié par 2 à 4).

### 3. Monotonie & Contrainte (Strain)
$$\text{Monotonie} = \frac{\text{Moyenne de charge sur 7 jours}}{\text{Écart-type de charge sur 7 jours}}$$
$$\text{Strain} = \text{Charge Hebdomadaire Totale} \times \text{Monotonie}$$

### 4. Indice de Bien-Être Hooper (1995)
Score pré-séance composé de 4 items notés de 1 (Optimal) à 5 (Très mauvais) :
$$\text{Score Hooper} = \text{Sommeil} + \text{Courbatures (DOMS)} + \text{Fatigue} + \text{Stress}$$

---

## 🚀 Fonctionnalités Clés

* 📱 **Mode Kiosk Terrain** : Grille visuelle par numéro de maillot avec sélecteur Borg CR-10 en gros boutons tactiles et emojis.
* 📊 **Tableau de Bord & Matrice de Risque** : Graphiques de charge d'équipe sur 14 jours, radar de fatigue Hooper et alertes visuelles pour les joueurs en zone rouge ($ACWR \ge 1.5$).
* 📅 **Gestion du Microcycle** : Planification par jours de match (`MD-4`, `MD-3`, `MD-2`, `MD-1`, `MD`, `MD+1`).
* 📄 **Export PDF Professionnel en 1-Clic** : Rapport officiel prêt pour le Directeur Technique Sportif (DTS).
* 📑 **Export Excel (.xlsx) Multi-feuilles** : Données brutes et métriques standardisées prêtes pour les analyses statistiques sous **Jamovi**, **SPSS** ou **R**.
* 💾 **Sauvegarde & Restauration JSON** : Portabilité totale sans serveur payant.
* 🌍 **Support RTL & Darija / Arabe / Français**.

---

## 🛠️ Stack Technique

* **Framework** : [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Bundler & Build Tool** : [Vite 8](https://vitejs.dev/)
* **Styling** : [Tailwind CSS 4](https://tailwindcss.com/)
* **Graphiques & Visualisations** : [Recharts](https://recharts.org/)
* **PWA & Offline Service Worker** : [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
* **Génération PDF & Excel** : `jspdf`, `jspdf-autotable`, `xlsx`
* **Icônes** : [Lucide React](https://lucide.dev/)

---

## 👨🔬 Auteur & Crédits

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

# 3. Lancer le serveur de développement local
npm run dev

# 4. Compiler pour la production
npm run build
```

---

## 🌐 Déploiement sur Vercel en 1-Clic

1. Rendez-vous sur [Vercel](https://vercel.com/new).
2. Connectez votre compte GitHub et importez le dépôt `dz-rpe-foot`.
3. Conservez les paramètres par défaut (**Framework Preset: Vite**).
4. Cliquez sur **Deploy**. Votre PWA sera disponible en ligne avec HTTPS et mise en cache PWA immédiate.

---

## 📄 Licence
Distribué sous la licence MIT. Voir `LICENSE` pour plus de détails.
