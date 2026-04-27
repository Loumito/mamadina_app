# Guide de Configuration Détaillé

Ce guide vous accompagne dans la configuration complète de l'application Mamadina.

## 📋 Prérequis

### Outils Nécessaires

1. **Node.js** (version 18 ou supérieure)
   ```bash
   node --version  # Vérifier la version
   ```

2. **npm ou yarn**
   ```bash
   npm --version
   ```

3. **React Native CLI**
   ```bash
   npm install -g react-native-cli
   ```

4. **Git**
   ```bash
   git --version
   ```

### Pour Android

1. **Java JDK 17**
   - Télécharger depuis [Oracle](https://www.oracle.com/java/technologies/downloads/)
   - Définir JAVA_HOME dans les variables d'environnement

2. **Android Studio**
   - Télécharger depuis [developer.android.com](https://developer.android.com/studio)
   - Installer Android SDK (API 33 minimum)
   - Configurer ANDROID_HOME

### Pour iOS (Mac uniquement)

1. **Xcode** (dernière version)
   - Installer depuis l'App Store
   - Installer Command Line Tools : `xcode-select --install`

2. **CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

## 🔧 Installation Étape par Étape

### Étape 1 : Cloner et Installer

```bash
cd /Users/lounessadmi/Documents/mamadina_app
npm install
```

### Étape 2 : Configuration Firebase

#### 2.1 Créer le Projet Firebase

1. Aller sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquer sur "Ajouter un projet"
3. Nommer le projet : "Mamadina"
4. Activer Google Analytics (optionnel)
5. Créer le projet

#### 2.2 Activer les Services

Dans la console Firebase :

**Authentication**
1. Aller dans Authentication
2. Cliquer sur "Commencer"
3. Activer "E-mail/Mot de passe"

**Firestore Database**
1. Aller dans Firestore Database
2. Cliquer sur "Créer une base de données"
3. Choisir "Commencer en mode test"
4. Sélectionner la région (europe-west)

**Storage**
1. Aller dans Storage
2. Cliquer sur "Commencer"
3. Conserver les règles par défaut (vous les mettrez à jour plus tard)

**Cloud Messaging**
1. Aller dans Cloud Messaging
2. Activer le service

#### 2.3 Ajouter les Applications

**Pour Android :**
1. Dans la console Firebase, cliquer sur l'icône Android
2. Package name : `com.mamadinaapp` (ou le vôtre)
3. Télécharger `google-services.json`
4. Placer le fichier dans `android/app/google-services.json`

**Pour iOS :**
1. Dans la console Firebase, cliquer sur l'icône iOS
2. Bundle ID : `com.mamadinaapp` (ou le vôtre)
3. Télécharger `GoogleService-Info.plist`
4. Placer le fichier dans `ios/GoogleService-Info.plist`

### Étape 3 : Configuration Android

#### 3.1 Fichier android/build.gradle

Ajouter classpath Firebase :

```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.4.0'
    }
}
```

#### 3.2 Fichier android/app/build.gradle

Ajouter à la fin du fichier :

```gradle
apply plugin: 'com.google.gms.google-services'
```

#### 3.3 Permissions AndroidManifest.xml

Fichier : `android/app/src/main/AndroidManifest.xml`

```xml
<manifest>
    <!-- Permissions Internet -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Permissions GPS -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
    
    <!-- Permissions Camera et Storage -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    
    <!-- Permissions Notifications -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
</manifest>
```

### Étape 4 : Configuration iOS

#### 4.1 Info.plist

Fichier : `ios/MamadinaApp/Info.plist`

Ajouter les descriptions de permissions :

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Nous avons besoin de votre position pour le pointage et le suivi GPS</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Nous avons besoin de votre position en arrière-plan pour le suivi des trajets</string>

<key>NSCameraUsageDescription</key>
<string>Nous avons besoin d'accéder à votre caméra pour prendre des photos</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Nous avons besoin d'accéder à vos photos pour les joindre aux messages</string>
```

#### 4.2 Installer les Pods

```bash
cd ios
pod install
cd ..
```

### Étape 5 : Déployer Firebase

#### 5.1 Installer Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

#### 5.2 Initialiser le Projet

```bash
cd firebase
firebase init
```

Sélectionner :
- Firestore
- Storage
- Functions

#### 5.3 Déployer les Règles et Functions

```bash
# Déployer les règles
firebase deploy --only firestore:rules
firebase deploy --only storage:rules

# Installer les dépendances des functions
cd functions
npm install
cd ..

# Déployer les functions
firebase deploy --only functions
```

### Étape 6 : Créer le Premier Utilisateur Admin

Une fois l'application déployée, vous devrez créer manuellement le premier admin :

1. Dans Firebase Console → Authentication
2. Ajouter un utilisateur avec email/mot de passe
3. Copier l'UID de l'utilisateur
4. Dans Firestore → Collection `users` → Créer un document avec l'UID
5. Ajouter les champs :

```json
{
  "email": "admin@mamadina.com",
  "role": "admin",
  "firstName": "Admin",
  "lastName": "Principal",
  "phone": "0123456789",
  "isActive": true,
  "permissions": [],
  "createdAt": [timestamp],
  "updatedAt": [timestamp]
}
```

6. Dans Firebase Console → Authentication → Cliquer sur l'utilisateur
7. Définir les Custom Claims via Cloud Function ou Firebase CLI :

```bash
firebase functions:shell
> const admin = require('firebase-admin');
> admin.auth().setCustomUserClaims('USER_UID_HERE', {role: 'admin'})
```

## 🚀 Lancer l'Application

### Android

```bash
# Lancer le serveur Metro
npm start

# Dans un autre terminal
npm run android
```

### iOS

```bash
# Lancer le serveur Metro
npm start

# Dans un autre terminal
npm run ios
```

## 🧪 Tester l'Application

### Tester l'Authentification

1. Lancer l'application
2. Se connecter avec les identifiants admin créés
3. Vérifier que le tableau de bord admin s'affiche

### Tester les Permissions

1. Créer d'autres utilisateurs avec différents rôles
2. Vérifier que chaque rôle voit son interface spécifique
3. Tester les permissions (création tâche, etc.)

### Tester le GPS

1. Activer la localisation sur l'appareil/émulateur
2. Aller dans l'onglet Pointage (Employé) ou Carte (Chauffeur)
3. Vérifier que la position s'affiche

### Tester la Messagerie

1. Créer plusieurs utilisateurs
2. Envoyer des messages entre eux
3. Vérifier les notifications

## 🔒 Configuration de Production

### Android APK Signé

1. Générer une clé de signature :

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore mamadina-release.keystore \
  -alias mamadina \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

2. Placer le keystore dans `android/app/`

3. Créer `android/gradle.properties` :

```properties
MAMADINA_UPLOAD_STORE_FILE=mamadina-release.keystore
MAMADINA_UPLOAD_KEY_ALIAS=mamadina
MAMADINA_UPLOAD_STORE_PASSWORD=***
MAMADINA_UPLOAD_KEY_PASSWORD=***
```

4. Modifier `android/app/build.gradle` :

```gradle
android {
    signingConfigs {
        release {
            storeFile file(MAMADINA_UPLOAD_STORE_FILE)
            storePassword MAMADINA_UPLOAD_STORE_PASSWORD
            keyAlias MAMADINA_UPLOAD_KEY_ALIAS
            keyPassword MAMADINA_UPLOAD_KEY_PASSWORD
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

5. Construire l'APK :

```bash
cd android
./gradlew bundleRelease
```

L'APK se trouve dans `android/app/build/outputs/bundle/release/`

### Configuration Firestore en Production

1. Dans Firebase Console → Firestore Database → Règles
2. Remplacer par le contenu de `firebase/firestore.rules`
3. Publier les règles

### Configuration Storage en Production

1. Dans Firebase Console → Storage → Règles
2. Remplacer par le contenu de `firebase/storage.rules`
3. Publier les règles

## ⚠️ Problèmes Courants

### Build Android échoue

```bash
cd android
./gradlew clean
cd ..
rm -rf node_modules
npm install
npm run android
```

### Metro Bundler ne démarre pas

```bash
npm start -- --reset-cache
```

### Erreur "Duplicate class" sur Android

Vérifier les dépendances dupliquées dans `android/app/build.gradle`

### Pod install échoue sur iOS

```bash
cd ios
rm -rf Pods Podfile.lock
pod cache clean --all
pod install
cd ..
```

### Firebase non initialisé

Vérifier que :
1. Les fichiers `google-services.json` et `GoogleService-Info.plist` sont présents
2. Les plugins Firebase sont bien appliqués dans les fichiers Gradle
3. L'application a été reconstruite après l'ajout des fichiers

## 📞 Support

Pour toute aide :
- Consulter la [documentation Firebase](https://firebase.google.com/docs)
- Consulter la [documentation React Native](https://reactnative.dev/)
- Créer une issue sur le repository

## ✅ Checklist Finale

- [ ] Node.js installé
- [ ] Dependencies installées (`npm install`)
- [ ] Projet Firebase créé
- [ ] Services Firebase activés (Auth, Firestore, Storage, Functions, Messaging)
- [ ] Fichiers de configuration Firebase téléchargés et placés
- [ ] Règles Firestore et Storage déployées
- [ ] Cloud Functions déployées
- [ ] Premier utilisateur admin créé
- [ ] Permissions Android/iOS configurées
- [ ] Application testée sur émulateur/appareil
- [ ] Build de production testé

Félicitations ! Votre application Mamadina est maintenant configurée et prête à l'emploi ! 🎉
