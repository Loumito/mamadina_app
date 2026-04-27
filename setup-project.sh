#!/bin/bash

# Script d'installation automatique de Mamadina App
# Ce script va créer un projet React Native fonctionnel avec tout notre code

set -e  # Arrêter si erreur

echo "🚀 Installation de Mamadina App..."
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Dossiers
CURRENT_DIR=$(pwd)
PARENT_DIR=$(dirname "$CURRENT_DIR")
NEW_PROJECT="$PARENT_DIR/MamadinaApp"

echo -e "${BLUE}📍 Dossier actuel : $CURRENT_DIR${NC}"
echo -e "${BLUE}📁 Nouveau projet sera créé dans : $NEW_PROJECT${NC}"
echo ""

# Vérifier que node est installé
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé !${NC}"
    echo "Installez Node.js depuis : https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node -v)${NC}"
echo ""

# Supprimer l'ancien projet s'il existe
if [ -d "$NEW_PROJECT" ]; then
    echo -e "${BLUE}🗑️  Suppression de l'ancien projet...${NC}"
    rm -rf "$NEW_PROJECT"
fi

# Étape 1 : Créer un nouveau projet React Native
echo -e "${BLUE}📦 Étape 1/6 : Création du projet React Native (peut prendre 2-3 min)...${NC}"
cd "$PARENT_DIR"
npx @react-native-community/cli@latest init MamadinaApp --skip-install --pm npm

if [ ! -d "$NEW_PROJECT" ]; then
    echo -e "${RED}❌ Erreur lors de la création du projet${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Projet React Native créé${NC}"
echo ""

# Étape 2 : Copier notre code
echo -e "${BLUE}📋 Étape 2/6 : Copie de notre code...${NC}"
cd "$NEW_PROJECT"

# Supprimer les fichiers générés qu'on va remplacer
rm -rf src App.tsx

# Copier nos fichiers
cp -r "$CURRENT_DIR/src" ./
cp "$CURRENT_DIR/App.tsx" ./
cp "$CURRENT_DIR/AppSimple.tsx" ./
cp "$CURRENT_DIR/tsconfig.json" ./
cp "$CURRENT_DIR/babel.config.js" ./
cp "$CURRENT_DIR/.eslintrc.js" ./
cp "$CURRENT_DIR/.prettierrc.js" ./
cp "$CURRENT_DIR/.gitignore" ./

# Copier la documentation
cp "$CURRENT_DIR/README.md" ./
cp "$CURRENT_DIR/SETUP.md" ./
cp "$CURRENT_DIR/QUICKSTART.md" ./
cp "$CURRENT_DIR/ARCHITECTURE.md" ./
cp "$CURRENT_DIR/IMPLEMENTATION_COMPLETE.md" ./
cp "$CURRENT_DIR/.env.example" ./

# Copier Firebase
mkdir -p firebase
cp -r "$CURRENT_DIR/firebase/"* ./firebase/ 2>/dev/null || true

echo -e "${GREEN}✅ Code copié${NC}"
echo ""

# Étape 3 : Fusionner package.json
echo -e "${BLUE}📝 Étape 3/6 : Mise à jour des dépendances...${NC}"

# Sauvegarder le package.json généré
cp package.json package.json.generated

# Créer un nouveau package.json avec nos dépendances
cat > package.json << 'EOF'
{
  "name": "mamadina-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.6",
    "typescript": "^5.3.3",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/stack": "^6.3.29",
    "@react-navigation/bottom-tabs": "^6.5.20",
    "@react-navigation/drawer": "^6.6.15",
    "react-native-screens": "^3.31.1",
    "react-native-safe-area-context": "^4.10.1",
    "react-native-gesture-handler": "^2.16.2",
    "@reduxjs/toolkit": "^2.2.1",
    "react-redux": "^9.1.0",
    "redux-persist": "^6.0.0",
    "@react-native-firebase/app": "^19.2.2",
    "@react-native-firebase/auth": "^19.2.2",
    "@react-native-firebase/firestore": "^19.2.2",
    "@react-native-firebase/storage": "^19.2.2",
    "@react-native-firebase/messaging": "^19.2.2",
    "react-native-maps": "^1.14.0",
    "@react-native-community/geolocation": "^3.2.1",
    "react-native-background-geolocation": "^4.16.2",
    "react-native-paper": "^5.12.3",
    "react-native-vector-icons": "^10.0.3",
    "i18next": "^23.10.1",
    "react-i18next": "^14.1.0",
    "@react-native-async-storage/async-storage": "^1.23.1",
    "react-native-document-picker": "^9.1.1",
    "react-native-image-picker": "^7.1.1",
    "react-native-chart-kit": "^6.12.0",
    "react-native-svg": "^15.1.0",
    "date-fns": "^3.3.1",
    "yup": "^1.4.0",
    "formik": "^2.4.5",
    "@react-native-community/netinfo": "^11.3.1"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "@babel/preset-env": "^7.24.0",
    "@babel/runtime": "^7.24.0",
    "@react-native/babel-preset": "^0.73.21",
    "@react-native/eslint-config": "^0.73.2",
    "@react-native/metro-config": "^0.73.5",
    "@react-native/typescript-config": "^0.73.1",
    "@types/react": "^18.2.65",
    "@types/react-test-renderer": "^18.0.7",
    "babel-jest": "^29.7.0",
    "babel-plugin-module-resolver": "^5.0.0",
    "eslint": "^8.57.0",
    "jest": "^29.7.0",
    "prettier": "^3.2.5",
    "react-test-renderer": "18.2.0"
  },
  "engines": {
    "node": ">=18"
  }
}
EOF

echo -e "${GREEN}✅ package.json mis à jour${NC}"
echo ""

# Étape 4 : Installer les dépendances
echo -e "${BLUE}📦 Étape 4/6 : Installation des dépendances (peut prendre 5 min)...${NC}"
npm install

echo -e "${GREEN}✅ Dépendances installées${NC}"
echo ""

# Étape 5 : Configurer Android
echo -e "${BLUE}🤖 Étape 5/6 : Configuration Android...${NC}"

# Copier nos configurations Android
cp -r "$CURRENT_DIR/android/app/src" ./android/app/ 2>/dev/null || true
cp "$CURRENT_DIR/android/app/build.gradle" ./android/app/ 2>/dev/null || true
cp "$CURRENT_DIR/android/build.gradle" ./android/ 2>/dev/null || true

echo -e "${GREEN}✅ Android configuré${NC}"
echo ""

# Étape 6 : Nettoyer
echo -e "${BLUE}🧹 Étape 6/6 : Nettoyage...${NC}"
cd android
./gradlew clean > /dev/null 2>&1 || true
cd ..

echo -e "${GREEN}✅ Nettoyage terminé${NC}"
echo ""

# Résumé
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ INSTALLATION TERMINÉE !${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}📱 Pour lancer l'application :${NC}"
echo ""
echo "   cd $NEW_PROJECT"
echo "   npm start                  # Dans un terminal"
echo "   npm run android            # Dans un autre terminal"
echo ""
echo -e "${BLUE}📝 Documentation disponible :${NC}"
echo "   - README.md                - Vue d'ensemble"
echo "   - QUICKSTART.md           - Démarrage rapide"
echo "   - SETUP.md                - Configuration complète"
echo "   - ARCHITECTURE.md         - Architecture technique"
echo ""
echo -e "${BLUE}🔥 Pour tester sans Firebase :${NC}"
echo "   Modifiez index.js :"
echo "   import App from './AppSimple';"
echo ""
echo -e "${GREEN}Bon développement ! 🚀${NC}"
echo ""
