# RATUNED
convertisseur de musique en 432Hz
# 🎵 Convertisseur 440Hz → 432Hz Web

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/sasvavoutoinformatique-hue/RATUNED)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Web Audio API](https://img.shields.io/badge/Web%20Audio%20API-compatible-orange.svg)(https://github.com/sasvavoutoinformatique-hue/RATUNED-api/)

Une application web complète pour convertir la fréquence musicale de 440Hz à 432Hz directement dans votre navigateur.

## ✨ Fonctionnalités

- 🎼 **Conversion en temps réel** : Transformez vos fichiers audio sans téléchargement de logiciel
- 🛡️ **100% privé** : Tous les traitements s'effectuent localement dans votre navigateur
- 📁 **Multi-format** : Supporte MP3, WAV, OGG, FLAC, AAC, M4A
- ⚡ **Rapide** : Conversion en quelques secondes
- 🎚️ **Paramètres avancés** : Ajustez la qualité, le débit et la méthode de conversion
- 📱 **Responsive** : Fonctionne sur mobile, tablette et desktop

## 🚀 Démo en ligne

👉 **[Lien vers la démo](https://github.com/sasvavoutoinformatique-hue/RATUNED)**

🎮 Utilisation
Glissez-déposez votre fichier audio ou cliquez sur "Parcourir les fichiers"

Écoutez l'original avec les contrôles intégrés

Ajustez les paramètres de conversion si nécessaire

Cliquez sur "Convertir en 432Hz"

Téléchargez votre fichier converti

🔧 Technologies utilisées
HTML5 : Structure de l'application

CSS3 : Styles et animations

JavaScript ES6+ : Logique métier

Web Audio API : Traitement audio

Font Awesome : Icônes

Google Fonts : Typographie

📁 Structure du projet
text
music-432-converter-web/
├── index.html          # Page principale
├── style.css          # Styles CSS
├── app.js            # Logique principale
├── converter.js      # Conversion audio
├── README.md         # Documentation
└── assets/           # Ressources
🔍 Comment ça marche ?
Chargement : Le fichier audio est lu via l'API File

Décodage : Conversion en AudioBuffer via Web Audio API

Conversion : Application du ratio 432/440 aux données audio

Encodage : Conversion du résultat en format WAV

Téléchargement : Génération d'un fichier téléchargeable

🧪 Méthodes de conversion
Méthode	Description	Utilisation
Préserver le tempo	Change la hauteur sans altérer la durée	Recommandé
Préserver la hauteur	Change le tempo sans altérer la hauteur	Pour des effets spéciaux
Rééchantillonnage	Méthode simple avec moins de qualité	Rapide
🌐 Déploiement
Sur GitHub Pages
bash
# 1. Créer un dépôt GitHub
# 2. Pousser les fichiers
git add .
git commit -m "Initial commit"
git push origin main

# 3. Activer GitHub Pages
# Settings > Pages > Source: main branch
Sur un serveur web
bash
# Copier les fichiers sur votre serveur
scp -r * user@yourserver.com:/var/www/html/music-converter/
📱 Compatibilité
Navigateur	Support	Notes
Chrome 60+	✅	Meilleure compatibilité
Firefox 55+	✅	Bon support
Safari 14+	✅	Support complet
Edge 79+	✅	Support complet
Opera 47+	✅	Support complet
🚫 Limitations
Taille maximale des fichiers : 50MB

Qualité réduite sur les très longs fichiers

Pas de traitement par lots

Conversion uniquement en WAV pour le téléchargement

🤝 Contribution
Les contributions sont les bienvenues !

Fork le projet

Créez une branche (git checkout -b feature/AmazingFeature)

Commitez vos changements (git commit -m 'Add AmazingFeature')

Poussez vers la branche (git push origin feature/AmazingFeature)

Ouvrez une Pull Request

📝 Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

🙏 Remerciements
Web Audio API pour la puissante API audio

Email: accueil@pacifique-informatique.com
Issues GitHub : Signaler un problème

Email : votre.email@example.com
