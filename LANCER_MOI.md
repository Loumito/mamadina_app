# 🚀 Comment Lancer l'Application Mamadina

## Étape Unique : Exécuter le Script

Ouvrez un terminal et exécutez :

```bash
cd /Users/lounessadmi/Documents/mamadina_app
./setup-project.sh
```

## Ce que fait le script

1. ✅ Crée un nouveau projet React Native propre
2. ✅ Copie tout votre code dedans
3. ✅ Configure les dépendances
4. ✅ Installe tout automatiquement
5. ✅ Configure Android
6. ✅ Nettoie et prépare pour le lancement

**Durée : ~5-10 minutes**

## Après l'exécution du script

Le nouveau projet sera dans : `/Users/lounessadmi/Documents/MamadinaApp/`

Pour lancer l'application :

```bash
# Terminal 1 : Démarrer Metro
cd /Users/lounessadmi/Documents/MamadinaApp
npm start

# Terminal 2 : Lancer l'app Android
npm run android
```

## 🎯 Options de Test

### Option 1 : Avec Firebase (Complet)

1. Configurez Firebase (voir SETUP.md)
2. Téléchargez `google-services.json`
3. Placez dans `android/app/`
4. Lancez l'app

### Option 2 : Sans Firebase (Test Rapide)

Dans `MamadinaApp/index.js`, remplacez :
```javascript
import App from './App';
```

Par :
```javascript
import App from './AppSimple';
```

Puis lancez l'app - vous verrez l'interface directement !

## 🐛 Si ça ne marche pas

```bash
cd /Users/lounessadmi/Documents/MamadinaApp
npm start -- --reset-cache
cd android && ./gradlew clean && cd ..
npm run android
```

## 📞 Aide

Consultez :
- **QUICKSTART.md** - Guide de démarrage
- **SETUP.md** - Configuration Firebase
- **README.md** - Documentation complète

---

**C'est tout ! Le script fait tout le travail pour vous ! 🎉**
