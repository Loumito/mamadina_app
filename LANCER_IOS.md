# 🍎 Lancer Mamadina sur iPhone / Simulateur iOS

> Le dossier `ios/` est maintenant scaffoldé directement dans le projet (template React Native 0.73.6 personnalisé pour `MamadinaApp`, avec Firebase et permissions GPS/caméra/photos déjà configurés). Plus besoin de créer un projet à part.

## ✅ Prérequis (sur Mac)

- macOS
- Xcode (App Store) + `xcode-select --install`
- Node.js ≥ 18 (https://nodejs.org)
- CocoaPods : `sudo gem install cocoapods`
- (Optionnel pour appareil physique) iPhone connecté en USB + câble

## 🚀 Installation en 1 commande

```bash
cd /Users/lounessadmi/Documents/mamadina_app
./setup-ios.sh
```

Le script :

1. vérifie Node, Xcode, CocoaPods
2. lance `npm install --legacy-peer-deps` (~3-5 min)
3. lance `pod install --repo-update` dans `ios/` (~5-10 min)
4. signale si `GoogleService-Info.plist` ou `google-services.json` manquent

## 🔥 Configurer Firebase (avant le 1er lancement)

L'app utilise `@react-native-firebase`. Il faut **deux fichiers** Firebase :

### iOS — `GoogleService-Info.plist`

1. https://console.firebase.google.com → votre projet → ⚙️ Paramètres du projet → Vos apps → ajouter une **app iOS** avec bundle id `com.mamadinaapp` (ou modifiez le bundle id dans Xcode si vous préférez).
2. Téléchargez `GoogleService-Info.plist`.
3. Ouvrez `ios/MamadinaApp.xcworkspace` dans Xcode.
4. Glissez le fichier dans le dossier `MamadinaApp` (à côté de `Info.plist`), cochez **Copy items if needed** et la target **MamadinaApp**.

### Android — `google-services.json`

1. Même console → ajouter une **app Android** avec package `com.mamadinaapp`.
2. Téléchargez `google-services.json` et placez-le dans `android/app/`.
3. Décommentez dans `android/build.gradle` la ligne `classpath("com.google.gms:google-services:4.4.0")` et ajoutez `apply plugin: 'com.google.gms.google-services'` à la fin de `android/app/build.gradle`.

> **Sans ces fichiers, l'app crashera au démarrage** car `firebaseAuth = auth()` est appelé dans `src/api/firebase.ts`. Pour tester l'UI sans Firebase, voir « Mode test sans Firebase » plus bas.

## 📱 Lancer l'app

### Méthode 1 — Xcode (recommandé pour la 1ère fois sur iPhone)

```bash
open ios/MamadinaApp.xcworkspace
```

Dans Xcode :

1. Sélectionner la cible **MamadinaApp** + votre iPhone (ou un simulateur)
2. **Signing & Capabilities** → cocher *Automatically manage signing* → choisir votre **Team** (Apple ID gratuit OK)
3. ▶️ **Play**

### Méthode 2 — Terminal (après le 1er build réussi)

```bash
# Terminal 1
npm start

# Terminal 2 (laissez Metro tourner)
npm run ios                            # simulateur par défaut
npm run ios -- --simulator "iPhone 15" # autre simulateur
npm run ios -- --device                # iPhone connecté en USB
```

## 🧪 Mode test sans Firebase

Pour vérifier rapidement que l'UI compile sans configurer Firebase :

`index.js` → remplacez `import App from './App';` par `import App from './AppSimple';`

`AppSimple.tsx` court-circuite l'auth et affiche directement l'interface Admin. **Pensez à remettre `./App` quand vous configurez Firebase.**

## 📍 Permissions iOS déjà configurées

`ios/MamadinaApp/Info.plist` contient :

- `NSLocationWhenInUseUsageDescription`, `NSLocationAlwaysAndWhenInUseUsageDescription`, `NSLocationAlwaysUsageDescription` (GPS pointage + suivi flotte + arrière-plan)
- `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`, `NSPhotoLibraryAddUsageDescription` (pièces jointes tâches/messages)
- `NSMicrophoneUsageDescription` (messages vocaux futurs)
- `UIBackgroundModes` : `location`, `fetch`, `remote-notification`

Modifiez les textes en français comme bon vous semble — Apple les rejette s'ils sont vides ou génériques.

## 🐛 Dépannage

| Symptôme | Solution |
|---|---|
| `pod install` échoue avec « Module 'Firebase' not found » | Le `Podfile` est déjà configuré (`use_frameworks! :static` + `$RNFirebaseAsStaticFramework = true`). Si le souci persiste : `cd ios && pod deintegrate && pod install --repo-update` |
| `App.app crashed at launch` (Firebase) | `GoogleService-Info.plist` manquant ou bundle id incorrect |
| `Unable to boot device` | Débrancher/rebrancher iPhone, redémarrer, puis Xcode → Product → Clean Build Folder |
| `App not trusted` (sur iPhone) | Réglages → Général → VPN et gestion → Faire confiance à [votre dev] |
| Metro ne se connecte pas | iPhone et Mac sur le **même WiFi**, ou USB uniquement |
| Cache bizarre | `npm start -- --reset-cache && cd ios && rm -rf build Pods && pod install` |
| `EXCLUDED_ARCHS` simulateur Apple Silicon | Le `Podfile` ne l'exclut que sur Intel. Sur M1/M2/M3 c'est ignoré, OK. |

## 📊 Logs

```bash
npx react-native log-ios                 # JS logs
log stream --predicate 'process == "MamadinaApp"'  # logs natifs
```

Dans Xcode : la console en bas affiche tout.

## 🔍 Debug

- Simulateur : `Cmd+D` → ouvrir le menu dev → Debug
- iPhone : secouer l'appareil → menu dev

## ✅ Checklist 1er lancement

- [ ] `./setup-ios.sh` s'est terminé sans erreur
- [ ] `GoogleService-Info.plist` glissé dans Xcode (target MamadinaApp cochée)
- [ ] Bundle id Firebase = bundle id Xcode
- [ ] Build réussi dans Xcode (▶️)
- [ ] L'écran de connexion s'affiche (ou l'interface Admin en mode `AppSimple`)

## 📚 Doc

- `README.md` — vue d'ensemble
- `SETUP.md` — Firebase détaillé
- `ARCHITECTURE.md` — modules et flux

---

Bonne build ! 🍎
