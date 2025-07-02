# Guide de Déploiement LADL

## Architecture de déploiement

- **Front-end** : Hostinger (React/Vite build statique)
- **Back-end** : Serveur local ou VPS (Node.js/Express)
- **Base de données** : PostgreSQL (Railway, Neon, ou Supabase)

---

## 🚀 Déploiement Frontend sur Hostinger

### 1. Construire le projet

```bash
# Cloner le projet
git clone <votre-repo>
cd LADL

# Installer les dépendances
npm install

# Construire pour la production
npm run build:frontend
```

### 2. Configuration de l'environnement

Créer un fichier `.env.production` :
```bash
VITE_API_URL=http://votre-serveur-backend.com:3000
```

### 3. Upload sur Hostinger

1. **Se connecter à cPanel Hostinger**
2. **Ouvrir File Manager**
3. **Aller dans public_html/**
4. **Supprimer les anciens fichiers**
5. **Uploader TOUT le contenu du dossier `dist/`**
6. **Vérifier que `index.html` est à la racine**

---

## 🖥️ Déploiement Backend

### Option 1: Serveur local (développement)

```bash
# Variables d'environnement dans .env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
ALLOWED_ORIGINS=https://votre-domaine-hostinger.com,http://localhost:5173

# Démarrer le serveur
npm run server:prod
```

### Option 2: VPS (production)

```bash
# Sur votre VPS
git clone <votre-repo>
cd LADL
npm install

# Configurer .env avec vos variables
# Utiliser PM2 pour la production
npm install -g pm2
pm2 start server.cjs --name "ladl-backend"
pm2 startup
pm2 save
```

---

## 🗄️ Configuration Base de Données

### Railway (Recommandé)

1. **Aller sur [Railway.app](https://railway.app)**
2. **Créer un nouveau projet**
3. **Ajouter PostgreSQL**
4. **Copier l'URL de connexion**
5. **L'ajouter dans vos variables d'environnement**

### Autres options
- **Neon** : [neon.tech](https://neon.tech)
- **Supabase** : [supabase.com](https://supabase.com)
- **ElephantSQL** : [elephantsql.com](https://elephantsql.com)

---

## ⚙️ Variables d'environnement

### Backend (.env)
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
ALLOWED_ORIGINS=https://votre-domaine-hostinger.com
PGHOST=localhost
PGPORT=5432
PGDATABASE=ladl
PGPASSWORD=votre_password
```

### Frontend (.env.production)
```bash
VITE_API_URL=http://votre-serveur-backend.com:3000
```

---

## 🧪 Tests

### Test du frontend
```bash
# Servir localement le build
npx serve dist
# Ouvrir http://localhost:3000
```

### Test du backend
```bash
# Test des endpoints
curl http://localhost:3000/api/formules/berline
curl http://localhost:3000/api/reservations
```

---

## 📋 Script de déploiement automatique

Utiliser le script fourni :
```bash
# Frontend seulement
./deploy.sh frontend

# Backend seulement  
./deploy.sh backend

# Tout
./deploy.sh all
```

---

## 🚨 Dépannage

### Problèmes courants

1. **Frontend ne se charge pas**
   - Vérifier que tous les fichiers sont dans public_html/
   - Vérifier l'URL dans .env.production

2. **Erreurs CORS**
   - Ajouter votre domaine Hostinger dans ALLOWED_ORIGINS
   - Vérifier la configuration CORS dans server.cjs

3. **API non accessible**
   - Vérifier que le serveur backend est démarré
   - Vérifier les ports et firewall
   - Tester avec curl

### Logs Backend
```bash
# Avec PM2
pm2 logs ladl-backend

# En mode développement
npm run server
```

### Test des endpoints
```bash
curl http://votre-serveur:3000/api/formules/berline
curl http://votre-serveur:3000/api/reservations
```

---

## ✅ Checklist de déploiement

- [ ] Frontend construit avec `npm run build:frontend`
- [ ] .env.production configuré avec la bonne URL backend
- [ ] Fichiers uploadés sur Hostinger
- [ ] Backend déployé et fonctionnel
- [ ] Base de données PostgreSQL configurée
- [ ] Variables d'environnement backend configurées
- [ ] Tests des endpoints réussis
- [ ] CORS configuré correctement

---

## 📞 Architecture finale

- **Frontend** : https://votre-domaine-hostinger.com
- **Backend** : http://votre-serveur-backend.com:3000
- **Database** : PostgreSQL sur Railway/Neon/Supabase 