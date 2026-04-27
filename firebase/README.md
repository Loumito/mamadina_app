# Firebase Configuration

Ce dossier contient la configuration Firebase pour l'application Mamadina.

## Structure

- `firestore.rules` - Règles de sécurité Firestore
- `storage.rules` - Règles de sécurité Cloud Storage
- `firestore.indexes.json` - Index Firestore
- `firebase.json` - Configuration Firebase
- `functions/` - Cloud Functions

## Configuration

1. Créer un projet Firebase sur https://console.firebase.google.com/
2. Télécharger les fichiers de configuration:
   - `google-services.json` pour Android (placer dans `android/app/`)
   - `GoogleService-Info.plist` pour iOS (placer dans `ios/`)

3. Installer Firebase CLI:
```bash
npm install -g firebase-tools
```

4. Se connecter à Firebase:
```bash
firebase login
```

5. Initialiser le projet:
```bash
firebase init
```

6. Déployer les règles et les fonctions:
```bash
firebase deploy
```

## Cloud Functions

Les Cloud Functions sont dans le dossier `functions/src/`:

- `users.ts` - Gestion des utilisateurs et des rôles
- `tasks.ts` - Notifications et vérifications des tâches
- `notifications.ts` - Notifications push
- `reports.ts` - Génération automatique de rapports

### Installation des dépendances des Functions

```bash
cd functions
npm install
```

### Déploiement des Functions

```bash
firebase deploy --only functions
```

## Sécurité

Les règles de sécurité Firestore et Storage sont configurées pour:
- Authentification requise pour toutes les opérations
- Contrôle d'accès basé sur les rôles (admin, manager, employee, driver)
- Validation des données côté serveur
- Protection contre les accès non autorisés

## Performance

Les index Firestore sont définis dans `firestore.indexes.json` pour optimiser les requêtes fréquentes.
