# Porfolio-Web
Mon Portfolio ainsi que mes tarifs

Démarrage rapide

- Ouvrir `index.html` dans un navigateur pour prévisualiser la page.
- Fichiers importants:
  - `index.html` — page principale
  - `styles/styles.css` — styles
  - `assets/` — images et ressources

Personnalisation

Remplacez les textes de `index.html` et ajoutez vos projets dans la section `#projects`. Remplacez aussi les fichiers placeholder dans `assets/` par vos vidéos (`project1.mp4`, `project3.mp4`) et images (`project2.jpg`, `project4.jpg`).

La section `Showreel` contenait initialement un embed TikTok et a été téléchargée/optimisée localement depuis https://www.tiktok.com/@klub_strasbourg/video/7581938120678067478.

Fichiers ajoutés dans `assets/`:
- `showreel.mp4` — H.264 optimisé
- `showreel.webm` — VP9 alternative
- `showreel.jpg` — poster image

Fichiers optimisés générés:
- `showreel.opt.mp4` — version optimisée (réduite) utilisée par la page
- `showreel.opt.webm` — version WebM optimisée
- `showreel.opt.jpg` — poster optimisé

Si vous préférez rétablir l'embed ou utiliser une autre vidéo, dites-le et j'adapterai la page.

Note: pour garantir l'autoplay, la vidéo est démarrée en mode muet. Utilisez le bouton "Activer le son" sur la vignette ou cliquez sur la vidéo pour l'activer (contrôles clavier pris en charge).

Tests & CI
- Un test headless (Puppeteer) vérifie l'autoplay, le toggle du son et le comportement de clic : `node scripts/test_showreel.js` (ou `npm test`).
- Un workflow GitHub Actions est inclus: `.github/workflows/ci.yml` démarre un serveur statique puis lance le test.

Scripts utiles
- `scripts/download_optimize_video.sh` : télécharge et transcoder une vidéo distante (yt-dlp + ffmpeg) et génère les fichiers `showreel.opt.*`.

Visuel
- La vidéo showreel est maintenant centrée, en avant-plan, et dispose d'un contour animé néon décoratif.

Si vous souhaitez, je peux:
- ajouter un formulaire de contact fonctionnel
- configurer un déploiement (GitHub Pages, Netlify)
- améliorer le design selon vos préférences (couleurs, typo, animations)
