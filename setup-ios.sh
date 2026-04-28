#!/bin/bash
# Mamadina iOS setup — installs JS dependencies and CocoaPods.
# Run this once on your Mac after cloning, then `npm run ios` to launch.
set -euo pipefail

GREEN='\033[0;32m'; BLUE='\033[0;34m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'

if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}❌ macOS requis pour iOS.${NC}"; exit 1
fi

# 1. Tools
command -v node >/dev/null || { echo -e "${RED}❌ Node.js manquant — https://nodejs.org${NC}"; exit 1; }
command -v xcodebuild >/dev/null || { echo -e "${RED}❌ Xcode manquant — App Store${NC}"; exit 1; }
if ! command -v pod >/dev/null; then
    echo -e "${YELLOW}Installation de CocoaPods…${NC}"; sudo gem install cocoapods
fi
echo -e "${GREEN}✅ Node $(node -v) / $(xcodebuild -version | head -1) / CocoaPods $(pod --version)${NC}"

cd "$(dirname "$0")"
ROOT="$(pwd)"
echo -e "${BLUE}📁 Racine : $ROOT${NC}"

# 2. JS dependencies
echo -e "${BLUE}📦 npm install (~3-5 min)…${NC}"
npm install --legacy-peer-deps

# 3. Pods iOS
echo -e "${BLUE}🍎 pod install (~5-10 min)…${NC}"
cd "$ROOT/ios"
pod install --repo-update
cd "$ROOT"

# 4. Vérifier Firebase
if [[ ! -f "ios/MamadinaApp/GoogleService-Info.plist" ]]; then
    echo -e "${YELLOW}⚠️  ios/MamadinaApp/GoogleService-Info.plist absent.${NC}"
    echo -e "    Téléchargez-le depuis Firebase Console (paramètres du projet)"
    echo -e "    et glissez-le dans Xcode dans le dossier MamadinaApp"
    echo -e "    en cochant 'Copy items if needed'."
fi
if [[ ! -f "android/app/google-services.json" ]]; then
    echo -e "${YELLOW}⚠️  android/app/google-services.json absent (pour Android).${NC}"
fi

cat <<EOF

${GREEN}✅ Installation terminée !${NC}

Pour lancer l'application sur iPhone / simulateur :

  ${BLUE}# Terminal 1 — Metro bundler${NC}
  npm start

  ${BLUE}# Terminal 2 — Build & run${NC}
  npm run ios                    # simulateur par défaut
  npm run ios -- --device        # iPhone connecté en USB

Ou via Xcode (recommandé pour la 1ère exécution sur device) :
  open ios/MamadinaApp.xcworkspace

EOF
