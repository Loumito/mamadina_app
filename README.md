# Mamadina - Application de Gestion d'Entreprise

Application mobile React Native professionnelle pour la gestion du travail, des tâches, de la messagerie interne et du suivi GPS de la flotte de véhicules.

## 🚀 Fonctionnalités Principales

### Gestion Multi-Rôles
- **Administrateur** : Gestion complète des utilisateurs, départements, tâches et configuration système
- **Responsable** : Gestion des tâches de département, suivi de l'équipe, rapports
- **Employé** : Consultation et mise à jour des tâches, pointage GPS, messagerie
- **Chauffeur** : Gestion des trajets, suivi GPS en temps réel, historique

### Modules

#### 📋 Gestion des Tâches
- Création et affectation de tâches
- Suivi du statut (non commencée, en cours, terminée, en retard)
- Priorités (basse, moyenne, haute, urgente)
- Pièces jointes et historique détaillé
- Notifications automatiques

#### 💬 Messagerie Interne
- Conversations privées et de groupe
- Messages texte, images et fichiers
- Notifications en temps réel
- Indicateurs de lecture

#### 🚛 Gestion de la Flotte
- Enregistrement des véhicules et chauffeurs
- Suivi GPS en temps réel
- Historique des trajets
- Alertes de retard et déviation

#### 📊 Tableaux de Bord et Rapports
- KPIs par rôle utilisateur
- Performance des employés
- Rapports quotidiens/hebdomadaires/mensuels
- Export PDF et Excel

#### 📍 Suivi GPS
- Localisation en temps réel
- Pointage de présence par GPS
- Géofencing
- Historique des déplacements

#### 🌐 Fonctionnalités Avancées
- Mode hors ligne avec synchronisation automatique
- Support multilingue (Français / Arabe)
- Interface RTL pour l'arabe
- Notifications push
- Évaluation automatique des performances

## 🏗️ Architecture Technique

### Stack Technologique

**Frontend Mobile**
- React Native 0.73.x
- TypeScript
- React Navigation 6.x
- Redux Toolkit + Redux Persist
- React Native Paper (UI Components)
- i18next (Internationalisation)

**Backend & Services**
- Firebase Authentication
- Cloud Firestore
- Firebase Cloud Storage
- Firebase Cloud Functions
- Firebase Cloud Messaging (FCM)

**Services GPS**
- react-native-maps
- @react-native-community/geolocation
- react-native-background-geolocation

### Structure du Projet

```
mamadina_app/
├── src/
│   ├── api/                    # Configuration Firebase
│   ├── components/             # Composants réutilisables
│   │   ├── common/            # Boutons, inputs, cards
│   │   ├── task/              # Composants tâches
│   │   ├── messaging/         # Composants messagerie
│   │   ├── gps/               # Composants GPS
│   │   └── dashboard/         # Graphiques
│   ├── screens/               # Écrans par rôle
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── manager/
│   │   ├── employee/
│   │   └── driver/
│   ├── navigation/            # Navigation par rôle
│   ├── store/                 # Redux store et slices
│   ├── hooks/                 # Custom hooks
│   ├── services/              # Services métier
│   ├── utils/                 # Utilitaires
│   ├── types/                 # Types TypeScript
│   ├── i18n/                  # Traductions FR/AR
│   └── constants/             # Constantes et config
├── firebase/                  # Configuration Firebase
│   ├── functions/             # Cloud Functions
│   ├── firestore.rules        # Règles Firestore
│   └── storage.rules          # Règles Storage
├── android/                   # Code natif Android
├── ios/                       # Code natif iOS
└── App.tsx                    # Point d'entrée
```

## 🚦 Installation et Configuration

### Prérequis

- Node.js >= 18
- npm ou yarn
- React Native CLI
- Android Studio (pour Android)
- Xcode (pour iOS, Mac uniquement)
- Compte Firebase

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration Firebase

1. Créer un projet sur [Firebase Console](https://console.firebase.google.com/)
2. Ajouter une application Android et iOS
3. Télécharger les fichiers de configuration :
   - `google-services.json` → `android/app/`
   - `GoogleService-Info.plist` → `ios/`

4. Activer les services Firebase :
   - Authentication (Email/Password)
   - Cloud Firestore
   - Cloud Storage
   - Cloud Messaging
   - Cloud Functions

### 3. Déployer les règles et fonctions Firebase

```bash
cd firebase
npm install
firebase login
firebase init
firebase deploy
```

### 4. Configuration Android

```bash
cd android
./gradlew clean
cd ..
```

### 5. Configuration iOS (Mac uniquement)

```bash
cd ios
pod install
cd ..
```

### 6. Lancer l'application

**Android**
```bash
npm run android
```

**iOS**
```bash
npm run ios
```

## 🔑 Modèle de Données

### Collections Firestore

#### users
```typescript
{
  id: string
  email: string
  role: 'admin' | 'manager' | 'employee' | 'driver'
  firstName: string
  lastName: string
  phone: string
  departmentId?: string
  isActive: boolean
  permissions: string[]
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### tasks
```typescript
{
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed'
  assignedTo: string[]
  assignedBy: string
  departmentId: string
  dueDate: timestamp
  startDate: timestamp
  completedAt?: timestamp
  attachments: string[]
  location?: GeoPoint
  history: Array<{action, userId, timestamp}>
  createdAt: timestamp
}
```

#### vehicles & trips
Voir `src/types/fleet.types.ts` pour les schémas complets.

## 🔐 Sécurité

### Règles Firestore
- Authentification requise pour toutes les opérations
- Contrôle d'accès basé sur les rôles (RBAC)
- Validation des données côté serveur
- Custom Claims pour les rôles utilisateurs

### Règles Storage
- Taille maximale des fichiers : 10 MB
- Validation du type de fichier
- Contrôle d'accès par chemin et rôle

### Bonnes Pratiques
- Mots de passe hashés par Firebase Auth
- Tokens JWT sécurisés
- Communication HTTPS uniquement
- Logs d'audit pour actions critiques

## 🧪 Tests

```bash
npm test
```

## 📱 Déploiement

### Android

1. Générer une clé de signature :
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore mamadina.keystore -alias mamadina -keyalg RSA -keysize 2048 -validity 10000
```

2. Configurer dans `android/gradle.properties`

3. Construire l'APK :
```bash
cd android
./gradlew assembleRelease
```

4. L'APK se trouve dans `android/app/build/outputs/apk/release/`

### iOS

1. Ouvrir le projet dans Xcode
2. Configurer les certificats et profils de provisioning
3. Archive → Distribute App → App Store Connect

## 🌍 Internationalisation

L'application supporte le français et l'arabe avec support RTL.

Pour ajouter une langue :
1. Créer un fichier JSON dans `src/i18n/`
2. Ajouter au fichier `i18n.config.ts`

## 📊 Performance

### Optimisations
- Pagination des listes
- Lazy loading des images
- Optimisation des requêtes Firestore
- Cache local avec AsyncStorage
- Mémorisation des composants React
- Compression des images

### Mode Hors Ligne
- Persistance Firestore activée
- Redux Persist pour l'état
- Synchronisation automatique au retour en ligne

## 🤝 Contribution

Pour contribuer au projet :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est privé et confidentiel.

## 👥 Équipe

Développé pour la gestion d'entreprise moderne avec focus sur la mobilité et l'efficacité opérationnelle.

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contacter l'équipe de développement

## 🗺️ Roadmap

### Version 1.0 (Actuelle)
- ✅ Authentification et gestion des utilisateurs
- ✅ Gestion des tâches
- ✅ Messagerie interne
- ✅ Suivi GPS
- ✅ Gestion de la flotte
- ✅ Rapports de base

### Version 1.1 (Prochaine)
- [ ] Génération avancée de rapports PDF/Excel
- [ ] Graphiques de performance détaillés
- [ ] Intégration calendrier
- [ ] Notifications personnalisables
- [ ] Export de données

### Version 2.0 (Futur)
- [ ] Application web complémentaire
- [ ] Intelligence artificielle pour prédictions
- [ ] Intégration avec ERP
- [ ] Module de facturation
- [ ] Gestion des congés

## 🛠️ Résolution de Problèmes

### Erreurs courantes

**Problème : "Unable to load script from assets"**
```bash
npm start -- --reset-cache
```

**Problème : Build Android échoue**
```bash
cd android && ./gradlew clean && cd ..
```

**Problème : Pods iOS non installés**
```bash
cd ios && pod install && cd ..
```

**Problème : Firebase non initialisé**
Vérifier que les fichiers `google-services.json` et `GoogleService-Info.plist` sont bien présents.

## 📚 Documentation Additionnelle

- [React Native Documentation](https://reactnative.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

---

Made with ❤️ for modern business management
