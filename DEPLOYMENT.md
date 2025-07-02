# Guide de Déploiement LADL

## 📋 Vue d'ensemble
- **Front-end** : Hostinger (React/Vite)
- **Back-end** : Vercel (Node.js/Express)
- **Base de données** : PostgreSQL (cloud)

## 🚀 Étapes de déploiement

### 1. Base de données PostgreSQL configurée ✅

**Railway PostgreSQL** - DÉJÀ CONFIGURÉ
- **URL de connexion** : `postgresql://postgres:gMThndjjHKucFgOIboQNjtvavpdopMDZ@switchback.proxy.rlwy.net:59722/railway`
- **Host** : switchback.proxy.rlwy.net
- **Port** : 59722
- **Database** : railway
- **User** : postgres
- **Password** : gMThndjjHKucFgOIboQNjtvavpdopMDZ

> ✅ Ta base de données Railway est prête ! Les tables seront créées automatiquement au premier démarrage du serveur.

### 2. Déployer le back-end sur Vercel

1. **Créer un compte Vercel** : [vercel.com](https://vercel.com)

2. **Importer le projet** :
   - Connecter ton repo GitHub
   - Sélectionner le dossier racine du projet

3. **Configurer les variables d'environnement** dans Vercel :
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://postgres:gMThndjjHKucFgOIboQNjtvavpdopMDZ@switchback.proxy.rlwy.net:59722/railway
   ALLOWED_ORIGINS=https://ton-domaine-hostinger.com,http://localhost:5173
   ```
   
   > ⚠️ **IMPORTANT** : Remplace `https://ton-domaine-hostinger.com` par ton vrai domaine Hostinger

4. **Déployer** : Vercel va automatiquement déployer ton back-end

5. **Noter l'URL** : Tu obtiendras une URL comme `https://ladl-backend-xxx.vercel.app`

### 3. Configurer le front-end pour pointer vers Vercel

1. **Créer un fichier `.env.production`** dans le dossier racine :
   ```
   VITE_API_URL=https://ton-url-vercel.vercel.app
   ```

2. **Mettre à jour la configuration CORS** dans `server.cjs` :
   - Remplacer `https://ton-domaine-hostinger.com` par ton vrai domaine

### 4. Construire le front-end

```bash
npm run build:frontend
```

Le dossier `dist/` contiendra tous les fichiers à uploader sur Hostinger.

### 5. Déployer sur Hostinger

1. **Se connecter au cPanel Hostinger**

2. **Aller dans le File Manager**

3. **Naviguer vers le dossier `public_html`** (ou le dossier de ton domaine)

4. **Supprimer les fichiers existants** (si c'est un nouveau domaine)

5. **Uploader tout le contenu du dossier `dist/`** :
   - Sélectionner tous les fichiers dans `dist/`
   - Les uploader dans `public_html/`

6. **S'assurer que `index.html` est à la racine**

### 6. Configurer les redirections (important pour React Router)

Créer un fichier `.htaccess` dans le dossier `public_html/` :

```apache
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static files
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
</IfModule>
```

## 🔧 Variables d'environnement nécessaires

### Vercel (Back-end)
```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:gMThndjjHKucFgOIboQNjtvavpdopMDZ@switchback.proxy.rlwy.net:59722/railway
ALLOWED_ORIGINS=https://ton-domaine-hostinger.com,http://localhost:5173
```

### Front-end (.env.production)
```
VITE_API_URL=https://ton-url-vercel.vercel.app
```

## 🔄 Script de déploiement automatique

Tu peux créer un script pour automatiser le build :

```bash
#!/bin/bash
echo "🏗️ Building frontend for production..."
npm run build:frontend

echo "✅ Build completed!"
echo "📁 Files to upload to Hostinger are in the 'dist/' folder"
echo "🔗 Don't forget to update VITE_API_URL with your Vercel URL"
```

## 🐛 Debugging

### Problèmes courants :

1. **CORS Error** : Vérifier que le domaine Hostinger est dans `ALLOWED_ORIGINS`
2. **404 sur refresh** : S'assurer que `.htaccess` est configuré
3. **API non accessible** : Vérifier que `VITE_API_URL` pointe vers Vercel
4. **Base de données** : Vérifier que `DATABASE_URL` est correcte

### Logs Vercel :
- Dashboard Vercel > Project > Functions > View logs

### Tester l'API :
```bash
curl https://ton-url-vercel.vercel.app/api/formules/berline
```

## 📝 Checklist de déploiement

- [ ] Base de données PostgreSQL cloud configurée
- [ ] Back-end déployé sur Vercel
- [ ] Variables d'environnement Vercel configurées
- [ ] URL Vercel récupérée
- [ ] `.env.production` créé avec `VITE_API_URL`
- [ ] Front-end buildé avec `npm run build:frontend`
- [ ] Fichiers uploadés sur Hostinger
- [ ] `.htaccess` configuré
- [ ] CORS configuré avec le bon domaine
- [ ] Test de l'application en production

## 🎉 C'est fini !

Ton application est maintenant déployée :
- **Front-end** : https://ton-domaine-hostinger.com
- **Back-end** : https://ton-url-vercel.vercel.app 