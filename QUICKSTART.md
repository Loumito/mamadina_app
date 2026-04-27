# 🚀 Guide de Démarrage Rapide - Mamadina App

## Option 1 : Test Simple Sans Firebase (Recommandé pour commencer)

Cette option vous permet de tester la structure de l'application sans configurer Firebase.

### 1. Installer les dépendances

```bash
npm install
```

### 2. Commenter temporairement les imports Firebase

Pour tester sans Firebase, modifiez temporairement quelques fichiers :

**Dans `src/api/firebase.ts`**, commentez les imports :
```typescript
// Commentez temporairement ces lignes pour tester sans Firebase
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage';
// import messaging from '@react-native-firebase/messaging';

// Exports temporaires pour éviter les erreurs
export const firebaseAuth = null as any;
export const firebaseFirestore = null as any;
export const firebaseStorage = null as any;
export const firebaseMessaging = null as any;
```

### 3. Lancer l'application

**Sur Android :**
```bash
npx react-native run-android
```

**Sur iOS (Mac uniquement) :**
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

### 4. Ce que vous verrez

L'application va démarrer et afficher l'écran de connexion. Même sans Firebase, vous pouvez :
- Voir l'interface utilisateur
- Tester la navigation entre les onglets (après modification pour sauter l'auth)
- Vérifier que tout compile correctement

---

## Option 2 : Configuration Complète avec Firebase

Pour tester toutes les fonctionnalités, suivez ces étapes :

### 1. Créer un Projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Nommez-le "Mamadina" (ou autre nom)
4. Créez le projet

### 2. Activer les Services Firebase

Dans la console Firebase :

**Authentication :**
- Allez dans Authentication → Commencer
- Activez "E-mail/Mot de passe"

**Firestore Database :**
- Allez dans Firestore Database → Créer une base de données
- Mode "test" pour commencer
- Région : europe-west (ou la plus proche)

**Storage :**
- Allez dans Storage → Commencer
- Mode "test" pour commencer

### 3. Ajouter les Applications

**Pour Android :**
1. Cliquez sur l'icône Android dans Firebase Console
2. Package name : `com.mamadinaapp`
3. Téléchargez `google-services.json`
4. **Important** : Créez d'abord le dossier si nécessaire :
   ```bash
   mkdir -p android/app
   ```
5. Placez le fichier téléchargé dans `android/app/google-services.json`

**Pour iOS (optionnel) :**
1. Cliquez sur l'icône iOS
2. Bundle ID : `com.mamadinaapp`
3. Téléchargez `GoogleService-Info.plist`
4. Placez dans `ios/GoogleService-Info.plist`

### 4. Configurer Android pour Firebase

**Fichier `android/build.gradle`** - Ajoutez la classpath :

```gradle
buildscript {
    ext {
        buildToolsVersion = "34.0.0"
        minSdkVersion = 21
        compileSdkVersion = 34
        targetSdkVersion = 34
        ndkVersion = "25.1.8937393"
        kotlinVersion = "1.8.0"
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin")
        // Ajoutez cette ligne
        classpath("com.google.gms:google-services:4.4.0")
    }
}
```

**Fichier `android/app/build.gradle`** - Ajoutez à la fin :

```gradle
apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"

// ... reste du fichier ...

// Ajoutez cette ligne tout à la fin
apply plugin: "com.google.gms.google-services"
```

### 5. Installer les Dépendances et Lancer

```bash
# Installer les dépendances
npm install

# Lancer sur Android
npx react-native run-android

# Ou sur iOS (après pod install)
cd ios && pod install && cd ..
npx react-native run-ios
```

### 6. Créer le Premier Utilisateur

Une fois l'app lancée, vous devez créer manuellement le premier utilisateur admin :

1. Dans [Firebase Console](https://console.firebase.google.com/) → Authentication
2. Cliquez sur "Ajouter un utilisateur"
3. Email : `admin@mamadina.com`
4. Mot de passe : `admin123` (changez après)
5. Copiez l'UID de l'utilisateur créé

6. Allez dans Firestore Database → Commencer une collection
7. ID de collection : `users`
8. ID de document : (collez l'UID copié)
9. Ajoutez ces champs :

```
email: "admin@mamadina.com"
role: "admin"
firstName: "Admin"
lastName: "Principal"
phone: "0123456789"
isActive: true
permissions: []
createdAt: (timestamp actuel)
updatedAt: (timestamp actuel)
```

### 7. Tester la Connexion

1. Lancez l'application
2. Connectez-vous avec :
   - Email : `admin@mamadina.com`
   - Mot de passe : `admin123`
3. Vous devriez voir le tableau de bord Admin avec 5 onglets

---

## 🐛 Problèmes Courants

### Erreur "Unable to resolve module"

```bash
npm start -- --reset-cache
```

### Erreur Build Android

```bash
cd android
./gradlew clean
cd ..
npm install
npx react-native run-android
```

### Erreur "Duplicate class"

Vérifiez qu'il n'y a pas de dépendances en double dans `android/app/build.gradle`

### Metro Bundler ne démarre pas

```bash
# Arrêter tous les processus Metro
pkill -f "react-native" 

# Redémarrer
npm start -- --reset-cache
```

### Firebase non initialisé

Vérifiez que :
1. Le fichier `google-services.json` est dans `android/app/`
2. La ligne `apply plugin: "com.google.gms.google-services"` est dans `android/app/build.gradle`
3. Vous avez rebuild l'application après avoir ajouté Firebase

---

## 📱 Test Rapide (Sans tout configurer)

Pour voir rapidement l'application sans configurer Firebase :

### 1. Créer une version de test

Créez un fichier `App.test.tsx` :

```typescript
import React from 'react';
import {SafeAreaView, Text, View, StyleSheet} from 'react-native';
import {AdminNavigator} from './src/navigation/AdminNavigator';

function AppTest() {
  return (
    <SafeAreaView style={styles.container}>
      <AdminNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppTest;
```

### 2. Modifier temporairement index.js

```javascript
import {AppRegistry} from 'react-native';
import AppTest from './App.test'; // Au lieu de './App'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppTest);
```

### 3. Lancer

```bash
npx react-native run-android
```

Vous verrez directement l'interface Admin sans authentification !

---

## ✅ Checklist de Test

- [ ] L'application se lance sans erreur
- [ ] L'écran de connexion s'affiche
- [ ] Les onglets de navigation sont visibles
- [ ] Les placeholders des écrans s'affichent
- [ ] Aucune erreur dans la console Metro

## 🎯 Prochaines Étapes

Une fois que l'application se lance correctement :

1. **Développer les vrais écrans** (actuellement des placeholders)
2. **Tester l'authentification** avec Firebase
3. **Implémenter les fonctionnalités** (tâches, messages, GPS)
4. **Ajouter les tests unitaires**

---

## 📞 Besoin d'Aide ?

Si vous rencontrez des problèmes :

1. Vérifiez les logs dans la console Metro
2. Vérifiez les logs Android : `npx react-native log-android`
3. Consultez le fichier SETUP.md pour plus de détails
4. Les erreurs courantes sont listées ci-dessus

**Bon test ! 🚀**
