# ⚽ DZ-RPE Foot U17 — Manuel Complet d'Utilisation
> **Application Progressive Web de Monitoring de la Charge d'Entraînement (sRPE), Ratio ACWR et Bien-être (Hooper)**  
> **Auteur scientifique & Concepteur :** Dr. Salah ALIOUI (PhD en Sciences du Sport, Université de Tissemsilt, Algérie)  
> **Dépôt officiel :** [https://github.com/Salahalioui/dz-rpe-foot](https://github.com/Salahalioui/dz-rpe-foot)

---

## 📑 Sommaire
1. [Introduction & Pourquoi DZ-RPE Foot ?](#1-introduction--pourquoi-dz-rpe-foot-)
2. [Installation PWA sur Smartphone / Tablette (100% Hors-Ligne)](#2-installation-pwa-sur-smartphone--tablette-100-hors-ligne)
3. [Prise en Main Rapide en 3 Minutes](#3-prise-en-main-rapide-en-3-minutes)
4. [Le Mode Kiosk de Banc de Touche](#4-le-mode-kiosk-de-banc-de-touche)
5. [Déchiffrer les Données & le Tableau de Bord](#5-déchiffrer-les-données--le-tableau-de-bord)
6. [Le Mode Plein Soleil (Ergonomie Extérieure)](#6-le-mode-plein-soleil-ergonomie-extérieure)
7. [Exports, Rapports DTS & Impression](#7-exports-rapports-dts--impression)
8. [Foire Aux Questions (FAQ Terrain)](#8-foire-aux-questions-faq-terrain)

---

## 1. Introduction & Pourquoi DZ-RPE Foot ?

Dans le football de jeunes en Algérie (U15, U17, U19 et équipes réserves), la gestion de la charge d'entraînement est souvent confrontée à trois obstacles majeurs :
* **Le coût exorbitant** des systèmes GPS et des abonnements logiciels occidentaux.
* **L'instabilité du réseau 3G/4G** sur de nombreux terrains d'entraînement communaux.
* **La barrière linguistique et culturelle** des formulaires standards inadaptés aux jeunes joueurs locaux.

**DZ-RPE Foot U17** élimine ces barrières en proposant une solution :
* **Scientifiquement irréprochable** : basée sur les modèles internationaux validés de **Carl Foster (2001)** pour la Session-RPE, de **Tim Gabbett (2016)** pour l'ACWR Uncoupled, et de **Hooper & Mackinnon (1995)** pour le bien-être.
* **100% Gratuite & Autonome** : aucune base de données payante, fonctionnement hors-ligne garanti.
* **Conçue pour le vestiaire algérien** : interface trilingue (Français, Arabe standard, et expressions locales en Darija telles que *"عيّان بزاف"*, *"ساهل"*).

```
   +-------------------------------------------------------------------------+
   |                        ARCHITECTURE DU SYSTÈME                          |
   |                                                                         |
   |  [ JOUEURS SUR LE BANC ] ---> [ KIOSK TACTILE (0-10) ]                 |
   |                                          |                              |
   |                                          v                              |
   |                            [ MOTEUR DE CALCUL LOCAL ]                   |
   |                             - sRPE (Foster 2001)                        |
   |                             - ACWR Uncoupled (Gabbett 2016)             |
   |                             - Indice Hooper (1995)                      |
   |                             - Monotonie & Strain                        |
   |                                          |                              |
   |                                          v                              |
   |                 +------------------------+------------------------+     |
   |                 |                                                 |     |
   |                 v                                                 v     |
   |      [ TABLEAU DE BORD COACH ]                        [ EXPORTS OFFICIELS ]
   |      - Matrice de Risque Rouge                        - PDF Imprimable DTS
   |      - Radars de Bien-Être                            - Excel Jamovi/SPSS 
   |      - Badge Étalonnage (X/21j)                       - Sauvegarde JSON   
   +-------------------------------------------------------------------------+
```

---

## 2. Installation PWA sur Smartphone / Tablette (100% Hors-Ligne)

DZ-RPE Foot est une **Progressive Web App (PWA)**. Elle s'installe directement sur l'écran d'accueil sans passer par l'App Store ou le Google Play Store.

### Sur Android (Chrome) :
1. Ouvrez le lien de l'application dans Google Chrome.
2. Une bannière ou un bouton **« Installer l'application »** apparaît automatiquement dans la barre supérieure de navigation.
3. Cliquez sur **Installer**.
4. L'icône aux couleurs de DZ-RPE Foot apparaît sur votre écran d'accueil. L'application fonctionne désormais **sans aucune connexion internet**.

### Sur iPhone / iPad (Safari) :
1. Ouvrez le lien dans Safari.
2. Cliquez sur l'icône de partage (le carré avec une flèche vers le haut).
3. Faites défiler vers le bas et appuyez sur **« Sur l'écran d'accueil »**.
4. Validez en haut à droite.

> **💡 Conseil Sécurité des Données :**  
> L'application active automatiquement la fonction `navigator.storage.persist()`. Vos données locales (LocalStorage) ne seront jamais supprimées par le navigateur lors du nettoyage automatique du cache.

---

## 3. Prise en Main Rapide en 3 Minutes

Lors de votre première séance :

### Étape 1 : Vérifier ou Personnaliser l'Équipe
* Rendez-vous dans l'onglet **Effectif**.
* Par défaut, une équipe modèle U17 (20 joueurs) est préchargée pour vous permettre d'expérimenter immédiatement.
* Vous pouvez modifier le nom du club, la catégorie, le nom du coach et ajuster les numéros de maillot de vos joueurs.

### Étape 2 : Créer la Séance du Jour
* Rendez-vous dans l'onglet **Kiosk**.
* Si aucune séance n'est programmée aujourd'hui, un bandeau vert s'affiche. Cliquez simplement sur le bouton **`+ Aujourd'hui`** !
* Une séance datée du jour est automatiquement créée (type *Entraînement*, durée nominale 90 minutes).

### Étape 3 : Faire Circuler le Téléphone
* Passez le téléphone aux joueurs au vestiaire ou sur le banc.
* Chaque joueur clique sur son maillot, note son RPE, et passe l'appareil au suivant.

---

## 4. Le Mode Kiosk de Banc de Touche

Le Kiosk est le cœur battant de l'application sur le terrain. Il a été pensé pour que **20 joueurs puissent noter leur séance en moins de 2 minutes**.

```
+---------------------------------------------------------------------------+
| [DZ-RPE] ⚽ Séance : Entraînement Tactique (90')      [Mode: Coach Direct] |
| Pointage : [ 14 / 20 Notés ]                     [+ Séance Aujourd'hui]   |
+---------------------------------------------------------------------------+
|                                                                           |
|   +-----------+   +-----------+   +-----------+   +-----------+           |
|   |    #1     |   |    #2     |   |    #3     |   |    #4     |           |
|   | M. Chaoui |   | A. Bensaïd|   | S. Zerrouk|   | Y. Belkacem           |
|   |    GK     |   |    DF     |   |    DF     |   |    DF     |           |
|   |  ✓ 540 UA |   |  ✓ 630 UA |   | ⏳ À NOTER |   | ⏳ À NOTER |           |
|   +-----------+   +-----------+   +-----------+   +-----------+           |
|                                                                           |
+---------------------------------------------------------------------------+
```

### Les Deux Modes de Fonctionnement :
1. **Mode Coach Direct (Recommandé en séance dirigée)** :
   * Le préparateur physique tient le smartphone et appelle les joueurs un par un.
   * Clic direct sur le maillot $\rightarrow$ ouverture immédiate de la fenêtre de notation.
2. **Mode Borne PIN (Recommandé en autonomie vestiaire)** :
   * Le smartphone est posé sur une table au vestiaire.
   * Quand le joueur clique sur son maillot, un pavé numérique s'affiche et demande son **code PIN à 4 chiffres** (par défaut : son numéro de maillot complété par des zéros, ex: `0007` pour le maillot 7).
   * **Bouton Master Coach** : Un bouton spécial *« Coach »* permet au staff de déverrouiller instantanément la saisie sans taper le code en cas d'oubli du joueur.

### Le Modal de Notation RPE & Bien-Être :
* **Échelle Borg CR-10 Visuelle** : 11 gros boutons tactiles (0 à 10) munis d'émojis et du ressenti en Darija (*ساهل، صعيب، عيّان بزاف*).
* **Retour Haptique** : Le smartphone vibre légèrement au toucher pour confirmer la sélection.
* **Pills de Durée Rapide** : Si un joueur a joué moins longtemps (remplaçant, joueur ménagé), cliquez sur une pilule : `90'`, `75'`, `60'`, `45'`, `30'` ou `15'`. La charge en Unités Arbitraires ($UA = RPE \times Durée$) est recalculée en temps réel sous vos yeux.
* **Questionnaire Hooper** (optionnel) : Permet de renseigner en 4 clics le Sommeil, les Courbatures, la Fatigue et le Stress (notés de 1 à 5).
* **Bouton « Joueur Suivant »** : Enregistre le log et sélectionne immédiatement le joueur suivant non encore noté !

---

## 5. Déchiffrer les Données & le Tableau de Bord

Une fois la saisie terminée, ouvrez l'onglet **Tableau de Bord**.

```
+---------------------------------------------------------------------------+
|                          TABLEAU DE BORD D'ÉQUIPE                         |
|                                                                           |
| [ Charge Hebdo : 2850 UA ]   [ ACWR Équipe : 1.12 ]   [ Zone Rouge : 1 ]  |
+---------------------------------------------------------------------------+
| MATRICE ACWR INDIVIDUELLE :                                               |
| #  Joueur        Poste   Aiguë(7j)   Chronique(28j)   ACWR    Statut      |
| ------------------------------------------------------------------------- |
| #7 Y. Amoura      AT      1420 UA       890 UA        1.60    🔴 DANGER   |
| #4 R. Bensebaini  DF       980 UA       910 UA        1.08    🟢 OPTIMAL  |
| #1 A. Mandrea     GK       450 UA       650 UA        0.69    🔵 SOUS-CH. |
+---------------------------------------------------------------------------+
```

### Comprendre le Badge `Étalonnage (X/21j)`
> **⚠️ Information Importante pour les 3 Premières Semaines :**  
> Le modèle ACWR compare la fatigue des 7 derniers jours à la moyenne des 28 jours précédents.  
> Lorsque vous commencez sur un nouveau club, vous n'avez pas encore 28 jours de données !  
> **L'algorithme DZ-RPE Foot intègre une calibration intelligente** :
> - Pendant les 21 premiers jours, le ratio est ancré sur la charge aiguë observée pour éviter les fausses alertes à 4.00.
> - Un badge discret `Étalonnage (X/21j)` vous indique le nombre de jours d'historique réel accumulés.
> - Dès le 21ème jour, l'indicateur bascule automatiquement en mode nominal continu.

### Les 4 Zones ACWR de Tim Gabbett :
* 🔵 **$< 0.80$ (Sous-charge)** : Le joueur s'entraîne trop peu ou revient de blessure. Risque de désadaptation aérobie.
* 🟢 **$0.80 - 1.30$ (Sweet Spot - Zone Idéale)** : Charge optimale. Le joueur développe ses qualités physiques tout en étant protégé contre les lésions musculaires.
* 🟠 **$1.30 - 1.49$ (Vigilance)** : Montée en charge rapide. À surveiller de près.
* 🔴 **$\ge 1.50$ (Zone Rouge / Danger)** : **Le risque de blessure est multiplié par 2 à 4.** Le joueur doit être ménagé (allègement des intensités, réduction du temps de jeu en match).

### Monotonie & Contrainte (Strain) :
* **Monotonie $> 2.0$** : Les séances sont trop similaires en intensité. Risque élevé de fatigue nerveuse et de baisse d'immunité.
* **Strain excessif** : Risque direct de déchirure musculaire (ischios, quadriceps).

---

## 6. Le Mode Plein Soleil (Ergonomie Extérieure)

Sur les terrains de football en Algérie, le soleil intense rend souvent les écrans de smartphone illisibles.

* Cliquez sur l'icône **Soleil / Lune** dans la barre de navigation.
* Le **Mode Plein Soleil** s'active instantanément :
  * Fond blanc pur `#ffffff`.
  * Bordures contrastées noires `#000000`.
  * Typographies épaissies ultra-lisibles.
  * Couleurs de l'échelle Borg renforcées pour une visibilité à 2 mètres sous le soleil de midi.

---

## 7. Exports, Rapports DTS & Impression

Dans l'onglet **Rapports**, vous disposez de 4 outils d'exportation :

1. 🖨️ **Bouton Imprimer (Vectoriel A4)** :
   * Déclenche la boîte de dialogue d'impression native du navigateur (`window.print()`).
   * Mise en page officielle épurée prête pour le classeur de suivi de la Direction Technique Sportive (DTS).
2. 📄 **Export PDF Officiel (1-Clic)** :
   * Génère un fichier PDF officiel aux couleurs nationales algériennes avec synthèse hebdomadaire, alertes de blessures et tableau individuel complet.
3. 📊 **Export Excel (.xlsx) Multi-feuilles** :
   * Génère un classeur avec colonnes auto-ajustées :
     * `Raw_Data_SPSS` : Données brutes par log, prêtes pour l'import dans **Jamovi**, **SPSS** ou **RStudio**.
     * `ACWR_Summary` : Synthèse statistique individuelle par joueur.
     * `Sessions_Overview` : Suivi chronologique des séances de l'équipe.
4. 💾 **Sauvegarde JSON** :
   * Permet d'exporter l'intégralité de la base de données locale dans un fichier texte léger pour l'archiver ou la transférer vers un autre smartphone/PC.

---

## 8. Foire Aux Questions (FAQ Terrain)

### Q1 : Que faire si un joueur a oublié de noter son RPE ?
> Rendez-vous dans l'onglet **Kiosk**, cliquez sur le maillot du joueur en retard, sélectionnez la séance correspondante, saisissez son ressenti et validez. Vous pouvez aussi ajuster les logs dans l'onglet **Séances**.

### Q2 : Pourquoi ne pas demander la note RPE tout de suite après le coup de sifflet ?
> C'est le **biais de récence**. Si vous terminez un entraînement très dur par 10 minutes d'étirements calmes, le joueur notera 3 ou 4 au lieu de 8. Attendez 15 à 30 minutes : la note reflétera l'ensemble de la séance.

### Q3 : Mon application fonctionne-t-elle si je coupe la 4G ?
> **Oui, à 100%.** L'ensemble du code, des polices de caractères, des algorithmes et du stockage fonctionne en local sur la puce de votre appareil.

### Q4 : Que faire concrètement quand mon meilleur attaquant est en Zone Rouge ?
> Ne le mettez pas obligatoirement en arrêt complet ! Réduisez le volume :
> 1. Dispensez-le des exercices de sprint maximal et des navettes VMA.
> 2. Laissez-le participer aux ateliers tactiques sans contact et aux jeux de possession avec appuis fixes.
> 3. Lors du match du week-end, limitez son temps de jeu à 45 ou 60 minutes.

---

```
DZ-RPE Foot U17 | Recherche Appliquée & Ingénierie du Sport
Auteur : Dr. Salah ALIOUI (PhD STAPS) — Université de Tissemsilt, Algérie
GitHub : https://github.com/Salahalioui/dz-rpe-foot
```
