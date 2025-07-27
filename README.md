
# OpenTF Server UI

## Présentation

Ce module est une interface d'administration cloud développée avec React, Vite et AdminLTE. Il permet de gérer un catalogue d'offres, les propriétés dynamiques associées, les catégories, les instances managées, les domaines et les valeurs suggérées, ainsi que la configuration et l'IAM (gestion des utilisateurs et des accès).

## Fonctionnalités principales

- **Authentification** : prise en charge de l'authentification locale et OpenID Connect (OIDC), avec gestion de session et protection des routes.
- **Catalogue de services** : affichage, création, modification et suppression d'offres et de catégories.
- **Gestion des propriétés d'offre** : édition dynamique des propriétés via une modal, avec prise en compte des dépendances et des métadonnées.
- **Demande d'instance** : formulaire dynamique basé sur les propriétés d'une offre, avec chargement des valeurs suggérées et dépendances.
- **Domaines & valeurs suggérées** : administration des domaines et des suggestions pour les propriétés.
- **IAM** : gestion des utilisateurs, groupes et configuration des méthodes d'authentification.
- **Configuration système** : accès à la configuration générale et aux tâches planifiées.

## Fonctionnement

L'application fonctionne en SPA (Single Page Application) et communique avec une API REST backend via des endpoints dédiés (`/api/offers`, `/api/offer_categories`, `/api/offers/:id/properties`, `/api/domains`, `/api/suggested_values`, `/api/users/login`, etc.).

L'authentification est gérée globalement via un contexte React, avec stockage du token en localStorage et protection des routes sensibles. Les composants Navbar et Sidebar sont affichés uniquement si l'utilisateur est authentifié.

La gestion des propriétés d'offre se fait dans une modal dédiée, avec rechargement dynamique de la liste après chaque modification. Les formulaires dynamiques pour la demande d'instance s'adaptent aux propriétés et chargent les valeurs suggérées ou dépendantes en temps réel.

La configuration OIDC n'est jamais exposée côté client : seul l'état d'activation est détecté pour afficher ou non l'option d'authentification OpenID.

## Installation & démarrage

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
3. Accéder à l'interface sur `http://localhost:5173` (par défaut).

## Personnalisation

Le module est conçu pour être facilement extensible et personnalisable. Les composants principaux sont situés dans `src/` et peuvent être adaptés selon les besoins métier ou d'intégration.

## Sécurité

La configuration OIDC et les secrets ne sont jamais accessibles côté client. Toute modification des méthodes d'authentification ou de la configuration doit se faire via l'interface d'administration sécurisée.
