# 🍎 Lancer l'Application Mamadina sur iPhone

## ✅ Prérequis iOS

Avant de commencer, assurez-vous d'avoir :

- ✅ **macOS** (obligatoire pour iOS)
- ✅ **Xcode** installé (depuis l'App Store)
- ✅ **Command Line Tools** : `xcode-select --install`
- ✅ **CocoaPods** : `sudo gem install cocoapods` (si pas installé)
- ✅ **iPhone** connecté en USB avec câble

## 🚀 Installation en 1 Commande

Ouvrez le Terminal et exécutez :

```bash
cd /Users/lounessadmi/Documents/mamadina_app
./setup-ios.sh
```

**Durée : ~10-15 minutes** (installation des pods iOS prend du temps)

## 📱 Lancer sur votre iPhone

### Méthode 1 : Via Xcode (Recommandé pour la 1ère fois)

```bash
cd /Users/lounessadmi/Documents/MamadinaApp
open ios/MamadinaApp.xcworkspace
```

Dans Xcode :
1. Sélectionnez votre iPhone dans la liste des appareils en haut
2. Cliquez sur le bouton **Play** (▶️)
3. La première fois, allez dans **Réglages iPhone** > **Général** > **Gestion des appareils** > **Faire confiance au développeur**

### Méthode 2 : Via Terminal (Après la 1ère fois)

```bash
cd /Users/lounessadmi/Documents/MamadinaApp

# Terminal 1 - Metro Bundler
npm start

# Terminal 2 - Lancer l'app
npm run ios
# Ou spécifier votre iPhone :
npm run ios -- --device "iPhone de Lounès"
```

## 🔧 Configurer votre iPhone

### 1. Activer le Mode Développeur

Sur iOS 16+ :
- **Réglages** > **Confidentialité et sécurité** > **Mode développeur** > **Activer**
- Redémarrer l'iPhone

### 2. Faire Confiance à votre Mac

Quand vous connectez l'iPhone :
- Un message apparaît sur l'iPhone : **"Faire confiance à cet ordinateur ?"**
- Appuyez sur **Faire confiance**
- Entrez le code de l'iPhone

### 3. Code Signing (Première fois dans Xcode)

Dans Xcode :
1. Sélectionnez le projet **MamadinaApp** dans la sidebar
2. Onglet **Signing & Capabilities**
3. Cochez **Automatically manage signing**
4. Sélectionnez votre **Team** (votre Apple ID)
5. Xcode créera automatiquement le profil de provisioning

## 🎯 Deux Modes de Test

### Mode Simple (sans Firebase)

Dans `MamadinaApp/index.js`, changez :
```javascript
import App from './App';
```

En :
```javascript
import App from './AppSimple';
```

Vous verrez directement l'interface Admin ! ✨

### Mode Complet (avec Firebase)

1. Suivez SETUP.md pour configurer Firebase
2. Téléchargez `GoogleService-Info.plist`
3. Glissez-le dans Xcode dans le dossier `MamadinaApp`
4. Cochez "Copy items if needed"
5. Lancez l'app

## 🐛 Problèmes Courants iOS

### "No signing certificate"

**Solution :**
1. Ouvrir Xcode
2. **Preferences** > **Accounts**
3. Ajouter votre Apple ID
4. **Download Manual Profiles**

### "Pod install failed"

**Solution :**
```bash
cd /Users/lounessadmi/Documents/MamadinaApp/ios
pod deintegrate
pod install
```

### "Unable to boot device"

**Solution :**
1. Déconnectez/reconnectez l'iPhone
2. Redémarrez l'iPhone
3. Dans Xcode : **Product** > **Clean Build Folder**

### "App not trusted"

**Solution :**
Sur l'iPhone :
- **Réglages** > **Général** > **Gestion des appareils**
- Appuyez sur votre email
- **Faire confiance à [Votre Nom]**

### Metro Bundler ne se connecte pas

**Solution :**
- iPhone et Mac doivent être sur le **même WiFi**
- Ou désactivez le WiFi et utilisez uniquement l'USB

### L'app crash au démarrage

**Solution :**
```bash
npm start -- --reset-cache
cd ios
rm -rf build
xcodebuild clean -workspace MamadinaApp.xcworkspace -scheme MamadinaApp
cd ..
npm run ios
```

## 📊 Voir les Logs

**Dans Xcode :**
- En bas : Console (affiche les logs React Native)

**Dans Terminal :**
```bash
# Voir les logs React Native
npx react-native log-ios

# Voir tous les logs système
log stream --predicate 'process == "MamadinaApp"'
```

## 🔍 Déboguer

### React Native Debugger

1. Secouez votre iPhone (ou Cmd+D dans simulateur)
2. **Debug** > **Open Debugger**
3. Une page Chrome s'ouvre

### Inspect Element

1. Secouez l'iPhone
2. **Show Inspector**
3. Touchez les éléments pour voir leurs propriétés

## 📝 Notes Importantes

- ⚠️ **Certificat de développeur** : Gratuit avec un Apple ID, mais limité à 3 appareils
- ⚠️ **Rebuild** : Après chaque `pod install`, rebuild dans Xcode
- ⚠️ **Cache** : Si problèmes étranges, nettoyez le cache (`npm start -- --reset-cache`)
- ⚠️ **Premier lancement** : Prend 2-3 minutes (compilation + installation)

## ✅ Checklist de Test

Après le lancement, vérifiez :

- [ ] L'app se lance sans crash
- [ ] L'écran de connexion (ou Admin) s'affiche
- [ ] Les onglets de navigation fonctionnent
- [ ] Pas d'erreurs dans la console Metro
- [ ] L'app reste ouverte sans crash

## 🎉 Vous êtes Prêt !

Une fois que l'app tourne sur votre iPhone :

1. Testez la navigation entre les onglets
2. Si mode Simple : voyez l'interface Admin
3. Si mode Firebase : testez la connexion
4. Développez les écrans selon vos besoins

## 📚 Documentation

- **QUICKSTART.md** - Guide général
- **SETUP.md** - Configuration Firebase
- **ARCHITECTURE.md** - Architecture détaillée
- **README.md** - Vue d'ensemble

---

**Bon développement sur iOS ! 🍎📱**
