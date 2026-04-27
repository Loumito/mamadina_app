# Architecture Technique - Mamadina App

## 📐 Vue d'Ensemble de l'Architecture

L'application Mamadina suit une architecture moderne en couches avec séparation claire des responsabilités.

```
┌─────────────────────────────────────────────────┐
│          Interface Utilisateur (UI)              │
│    Screens + Components + Navigation             │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────┐
│          Gestion d'État (Redux)                  │
│    Store + Slices + Persistence                  │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────┐
│          Services Métier                         │
│    Auth + Tasks + Messages + GPS + Reports      │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────┐
│          API Layer (Firebase)                    │
│    Firestore + Storage + Functions + FCM        │
└─────────────────────────────────────────────────┘
```

## 🎯 Patterns et Principes

### 1. Separation of Concerns

Chaque couche a une responsabilité unique :
- **UI** : Affichage et interaction utilisateur
- **State Management** : Gestion de l'état global
- **Services** : Logique métier et communication backend
- **API** : Communication avec Firebase

### 2. Dependency Injection

Les services sont injectés via imports ES6, facilitant les tests et la maintenance.

### 3. Role-Based Access Control (RBAC)

Système de permissions basé sur 4 rôles :
- **Admin** : Accès complet
- **Manager** : Gestion équipe et département
- **Employee** : Consultation et mise à jour tâches personnelles
- **Driver** : Gestion trajets et GPS

### 4. Offline-First

L'application fonctionne en mode hors ligne avec :
- Persistence Firestore automatique
- Redux Persist pour l'état
- Synchronisation automatique au retour en ligne

## 📦 Structure des Modules

### Module d'Authentification

**Composants :**
- `LoginScreen` : Écran de connexion
- `AuthNavigator` : Navigation pour utilisateurs non authentifiés
- `authService` : Service d'authentification Firebase
- `authSlice` : State management de l'authentification

**Flux :**
```
User Input → FormValidation → authService.signIn()
    → Firebase Auth → User Document Fetch
    → Redux Store Update → Navigation Switch
```

### Module Tâches

**Composants :**
- Écrans : Liste, Détails, Création, Édition
- `taskService` : CRUD tâches + Subscriptions temps réel
- `taskSlice` : State management des tâches
- Types : `Task`, `CreateTaskDto`, `UpdateTaskDto`, `TaskFilter`

**Fonctionnalités :**
- Création avec assignation multiple
- Filtrage par statut, priorité, département
- Historique des modifications
- Pièces jointes
- Notifications automatiques (via Cloud Functions)

### Module Messagerie

**Composants :**
- Écrans : Conversations, Chat
- `messageService` : CRUD messages + Temps réel
- `messageSlice` : State des messages et conversations
- Types : `Message`, `Conversation`, `SendMessageDto`

**Fonctionnalités :**
- Conversations privées et de groupe
- Messages texte, images, fichiers
- Indicateurs de lecture
- Notifications push

### Module Flotte GPS

**Composants :**
- Écrans : Véhicules, Trajets, Carte
- `gpsService` : Tracking GPS + Géofencing
- `fleetSlice` : State véhicules et trajets
- Types : `Vehicle`, `Trip`, `Location`

**Fonctionnalités :**
- Tracking GPS en temps réel
- Historique des trajets
- Alertes de déviation et retard
- Géofencing pour pointage

## 🔄 Flux de Données

### 1. Chargement Initial

```
App Start
    → Redux Persist Rehydrate
    → Firebase Auth State Listener
    → User Document Fetch
    → Navigation Routing (basé sur role)
```

### 2. Opération CRUD Standard

```
User Action (UI)
    → Redux Action Dispatch
    → Service Method Call
    → Firebase API Call
    → Response
    → Redux State Update
    → UI Re-render
```

### 3. Temps Réel (Firestore Listeners)

```
Component Mount
    → Subscribe to Firestore Collection
    → Real-time Updates
    → Redux State Update
    → UI Re-render (automatique)
    
Component Unmount
    → Unsubscribe
```

## 🔐 Sécurité Multi-Couches

### Couche 1 : Frontend (React Native)

**Validation des Données :**
- Schémas Yup pour validation formulaires
- Types TypeScript stricts
- Vérification des permissions avant affichage

**Gestion des Tokens :**
- Tokens JWT Firebase automatiques
- Refresh automatique
- Stockage sécurisé via Redux Persist

### Couche 2 : Firebase Rules

**Firestore Rules :**
- Authentification requise
- Vérification des rôles via document utilisateur
- Validation des données côté serveur
- Contrôle d'accès granulaire par collection

**Storage Rules :**
- Validation du type de fichier
- Limite de taille (10 MB)
- Contrôle d'accès par chemin

### Couche 3 : Cloud Functions

**Fonctions Sécurisées :**
- Vérification du caller
- Custom Claims pour rôles
- Rate limiting
- Logs d'audit

## 📊 Gestion d'État Redux

### Store Structure

```typescript
{
  auth: {
    user: User | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    error: string | null,
    fcmToken: string | null
  },
  tasks: {
    tasks: Task[],
    selectedTask: Task | null,
    filter: TaskFilter,
    isLoading: boolean,
    error: string | null
  },
  messages: {
    conversations: Conversation[],
    selectedConversation: Conversation | null,
    messages: {[conversationId]: Message[]},
    unreadCount: number
  },
  fleet: {
    vehicles: Vehicle[],
    trips: Trip[],
    activeTrips: Trip[],
    selectedVehicle: Vehicle | null,
    selectedTrip: Trip | null
  }
}
```

### Slices Redux

Chaque slice contient :
- **Reducers** : Actions synchrones pour modifier l'état
- **Selectors** : Fonctions pour extraire des données
- **Initial State** : État par défaut

### Redux Persist

**Configuration :**
- Whitelist : `['auth']` (seul l'auth est persisté)
- Blacklist : `['tasks', 'messages', 'fleet']` (synchro Firebase)
- Storage : AsyncStorage

## 🌐 Internationalisation (i18n)

### Configuration

**Langues Supportées :**
- Français (par défaut)
- Arabe (avec support RTL)

**Structure des Traductions :**
```json
{
  "common": { ... },
  "auth": { ... },
  "tasks": { ... },
  "messages": { ... },
  "fleet": { ... },
  ...
}
```

**Usage :**
```typescript
import {useTranslation} from 'react-i18next';

const {t} = useTranslation();
const title = t('tasks.title');
```

## 📱 Navigation

### Structure

```
AppNavigator (Root)
    ├── AuthNavigator (Non authentifié)
    │   └── LoginScreen
    │
    └── Role-Based Navigator (Authentifié)
        ├── AdminNavigator (Admin)
        ├── ManagerNavigator (Manager)
        ├── EmployeeNavigator (Employee)
        └── DriverNavigator (Driver)
```

### Navigation Conditionnelle

La navigation change automatiquement basée sur :
1. État d'authentification
2. Rôle utilisateur
3. Permissions

## 🔧 Services Métier

### authService

**Méthodes :**
- `signIn(email, password)` : Connexion
- `signOut()` : Déconnexion
- `resetPassword(email)` : Réinitialisation
- `getCurrentUser()` : Utilisateur actuel
- `updateProfile(userId, data)` : Mise à jour profil
- `onAuthStateChanged(callback)` : Listener état auth

### taskService

**Méthodes :**
- `createTask(data, createdBy)` : Création
- `updateTask(taskId, data, userId)` : Mise à jour
- `deleteTask(taskId)` : Suppression
- `getTasks(filter)` : Liste filtrée
- `subscribeToTasks(filter, callback)` : Temps réel
- `addAttachment(taskId, fileUrl)` : Ajout pièce jointe

### messageService

**Méthodes :**
- `createConversation(data, createdBy)` : Nouvelle conversation
- `sendMessage(data, senderId)` : Envoi message
- `markAsRead(messageId, userId)` : Marquer lu
- `getConversations(userId)` : Liste conversations
- `subscribeToMessages(conversationId, callback)` : Temps réel

### gpsService

**Méthodes :**
- `updateVehicleLocation(vehicleId, location)` : MAJ position
- `addTripLocation(tripId, location)` : Ajout point trajet
- `checkIn(userId, data)` : Pointage arrivée
- `checkOut(attendanceId, data)` : Pointage départ
- `calculateDistance(lat1, lon1, lat2, lon2)` : Calcul distance
- `isWithinGeofence(current, target, radius)` : Vérification zone

## ☁️ Cloud Functions

### Triggers Firestore

**onTaskCreated :**
- Envoi notifications aux assignés
- Création historique
- Logging

**onTaskUpdated :**
- Notification changement de statut
- Mise à jour métriques

**checkOverdueTasks (Scheduled) :**
- Exécution quotidienne (9h)
- Détection tâches en retard
- Mise à jour statuts
- Notifications

### Triggers Notifications

**sendPushNotification :**
- Envoi FCM automatique
- Récupération token utilisateur
- Gestion erreurs

**cleanupOldNotifications (Scheduled) :**
- Exécution quotidienne (2h)
- Suppression notifications > 30 jours

### Fonctions HTTP Callable

**setUserRole :**
- Définition Custom Claims
- Vérification permissions admin
- Mise à jour document Firestore

**createUserWithRole :**
- Création utilisateur Firebase Auth
- Définition rôle et claims
- Création document Firestore

## 📈 Performance et Optimisation

### Firestore

**Optimisations :**
- Index composites pour requêtes complexes
- Pagination (limit 100)
- Offline persistence activée
- Cache size unlimited

**Requêtes Optimisées :**
```typescript
// Bon : Index défini
.where('departmentId', '==', deptId)
.orderBy('createdAt', 'desc')

// Mauvais : Pas d'index
.where('status', '==', 'active')
.where('priority', '==', 'high')
.orderBy('random_field')
```

### React Native

**Optimisations :**
- Mémorisation composants avec `React.memo`
- `useCallback` et `useMemo` pour fonctions/valeurs
- Lazy loading des images
- FlatList au lieu de ScrollView pour listes
- Debouncing des recherches

### Redux

**Optimisations :**
- Selectors mémorisés avec `createSelector`
- Normalisation des données complexes
- Batch updates
- Persistence selective

## 🧪 Tests

### Structure des Tests

```
__tests__/
├── unit/
│   ├── services/
│   ├── utils/
│   └── redux/
├── integration/
│   └── flows/
└── e2e/
    └── scenarios/
```

### Tests Unitaires

**Services :**
```typescript
describe('authService', () => {
  it('should sign in user', async () => {
    const user = await authService.signIn('test@test.com', 'password');
    expect(user).toBeDefined();
    expect(user.email).toBe('test@test.com');
  });
});
```

**Redux :**
```typescript
describe('authSlice', () => {
  it('should set user', () => {
    const state = authReducer(undefined, setUser(mockUser));
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });
});
```

## 📦 Déploiement

### Environnements

**Development :**
- Firebase project : mamadina-dev
- Debugging activé
- Rules en mode test

**Staging :**
- Firebase project : mamadina-staging
- Tests pré-production
- Rules production

**Production :**
- Firebase project : mamadina-prod
- Monitoring activé
- Backups automatiques
- Rules sécurisées

### CI/CD (Recommandé)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    - Lint
    - Test
    - Build Android
    - Build iOS
    - Deploy Firebase
    - Deploy Functions
```

## 🔍 Monitoring et Logs

### Firebase Performance

**Métriques Trackées :**
- App start time
- Screen rendering time
- Network requests
- Custom traces

### Firebase Analytics

**Events Trackés :**
- User sign in/out
- Task created/completed
- Message sent
- Trip started/completed

### Crashlytics

**Configuration :**
- Automatic crash reporting
- Custom logs
- User identification
- Breadcrumbs

## 🚀 Évolutivité

### Scalabilité Verticale

**Firebase :**
- Auto-scaling Firestore
- Unlimited storage
- Functions scale automatiquement

### Scalabilité Horizontale

**Architecture :**
- Microservices via Cloud Functions
- Collections Firestore partitionnables
- CDN pour fichiers statiques

## 📚 Documentation Code

### Conventions

**TypeScript :**
```typescript
/**
 * Creates a new task and assigns it to users
 * @param data - Task creation data
 * @param createdBy - ID of user creating the task
 * @returns Promise with new task ID
 * @throws Error if creation fails
 */
async createTask(data: CreateTaskDto, createdBy: string): Promise<string>
```

**React Components :**
```typescript
/**
 * Button component with different variants and sizes
 * @component
 * @example
 * <Button 
 *   title="Click me" 
 *   onPress={handleClick} 
 *   variant="primary" 
 * />
 */
export const Button: React.FC<ButtonProps> = ({ ... }) => { ... }
```

## 🎓 Ressources et Références

### Documentation Externe

- [React Native Docs](https://reactnative.dev/)
- [Firebase Docs](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TypeScript](https://www.typescriptlang.org/)

### Blogs et Tutoriels

- Firebase Best Practices
- React Native Performance
- Redux Patterns
- Mobile Security

---

**Dernière mise à jour :** Février 2026  
**Version :** 1.0.0  
**Auteur :** Équipe Mamadina
