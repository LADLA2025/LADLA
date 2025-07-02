#!/bin/bash

# Script de déploiement automatique pour LADL
# Usage: ./deploy.sh [frontend|backend|all]

set -e  # Arrêter le script en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher des messages colorés
print_message() {
    echo -e "${BLUE}[DEPLOY]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fonction pour vérifier les prérequis
check_prerequisites() {
    print_message "Vérification des prérequis..."
    
    if ! command -v npm &> /dev/null; then
        print_error "npm n'est pas installé"
        exit 1
    fi
    
    if [ ! -f "package.json" ]; then
        print_error "package.json non trouvé. Assurez-vous d'être dans le dossier racine du projet."
        exit 1
    fi
    
    print_success "Prérequis vérifiés ✓"
}

# Fonction pour construire le frontend
build_frontend() {
    print_message "🏗️ Construction du frontend pour la production..."
    
    # Vérifier si .env.production existe
    if [ ! -f ".env.production" ]; then
        print_warning ".env.production non trouvé. Création d'un fichier exemple..."
        cat > .env.production << EOF
VITE_API_URL=https://ton-url-vercel.vercel.app
EOF
        print_warning "⚠️ N'oubliez pas de mettre à jour VITE_API_URL dans .env.production"
    fi
    
    # Build du frontend
    npm run build:frontend
    
    # Copier .htaccess dans dist
    if [ -f "public/.htaccess" ]; then
        cp public/.htaccess dist/.htaccess
        print_success ".htaccess copié dans dist/"
    else
        print_warning ".htaccess non trouvé dans public/"
    fi
    
    # Afficher la taille du build
    if command -v du &> /dev/null; then
        BUILD_SIZE=$(du -sh dist 2>/dev/null | cut -f1 || echo "unknown")
        print_success "Frontend construit avec succès! Taille: $BUILD_SIZE"
    else
        print_success "Frontend construit avec succès!"
    fi
    
    print_message "📁 Fichiers prêts pour Hostinger dans le dossier 'dist/'"
}

# Fonction pour préparer le backend
prepare_backend() {
    print_message "🔧 Préparation du backend pour Vercel..."
    
    # Vérifier que vercel.json existe
    if [ ! -f "vercel.json" ]; then
        print_error "vercel.json non trouvé. Le backend n'est pas configuré pour Vercel."
        exit 1
    fi
    
    # Vérifier les dépendances backend
    if ! npm list express &> /dev/null; then
        print_error "Dépendances backend manquantes. Exécutez 'npm install'"
        exit 1
    fi
    
    print_success "Backend prêt pour Vercel ✓"
    print_message "📝 N'oubliez pas de configurer les variables d'environnement sur Vercel:"
    echo "   - NODE_ENV=production"
    echo "   - DATABASE_URL=votre_url_postgresql"
    echo "   - ALLOWED_ORIGINS=https://votre-domaine-hostinger.com"
}

# Fonction pour afficher les instructions post-déploiement
show_instructions() {
    print_message "📋 Instructions de déploiement:"
    echo ""
    echo "🎯 HOSTINGER (Frontend):"
    echo "   1. Connectez-vous à votre cPanel Hostinger"
    echo "   2. Ouvrez le File Manager"
    echo "   3. Naviguez vers public_html/"
    echo "   4. Supprimez les anciens fichiers"
    echo "   5. Uploadez TOUT le contenu du dossier 'dist/'"
    echo "   6. Vérifiez que index.html et .htaccess sont à la racine"
    echo ""
    echo "🚀 VERCEL (Backend):"
    echo "   1. Connectez votre repo GitHub à Vercel"
    echo "   2. Configurez les variables d'environnement"
    echo "   3. Déployez automatiquement"
    echo "   4. Notez l'URL Vercel pour mettre à jour .env.production"
    echo ""
    echo "🗄️ BASE DE DONNÉES:"
    echo "   1. Créez une base PostgreSQL sur Neon.tech, Supabase, ou Railway"
    echo "   2. Copiez l'URL de connexion dans les variables Vercel"
    echo "   3. Les tables seront créées automatiquement au premier démarrage"
    echo ""
}

# Fonction pour nettoyer les fichiers temporaires
cleanup() {
    print_message "🧹 Nettoyage..."
    # Ici on pourrait nettoyer des fichiers temporaires si nécessaire
    print_success "Nettoyage terminé ✓"
}

# Fonction principale
main() {
    local command=${1:-"all"}
    
    print_message "🚀 Démarrage du déploiement LADL - Mode: $command"
    echo ""
    
    check_prerequisites
    
    case $command in
        "frontend")
            build_frontend
            ;;
        "backend")
            prepare_backend
            ;;
        "all")
            build_frontend
            echo ""
            prepare_backend
            ;;
        *)
            print_error "Commande inconnue: $command"
            echo "Usage: $0 [frontend|backend|all]"
            exit 1
            ;;
    esac
    
    echo ""
    show_instructions
    
    cleanup
    
    print_success "🎉 Déploiement préparé avec succès!"
}

# Gestion des signaux pour un nettoyage propre
trap cleanup EXIT

# Exécution du script
main "$@" 