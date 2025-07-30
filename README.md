# OpenTF Server UI

## Présentation

OpenTF Server UI est une application web d'administration pour le cloud, permettant de gérer un catalogue d'offres de services, leurs propriétés dynamiques, les instances déployées, les catégories, les domaines et les valeurs suggérées. Elle facilite la gestion des utilisateurs, des accès (IAM), et la configuration du système.

## Principales fonctionnalités

- **Gestion du catalogue d'offres** : création, modification, suppression d'offres et de catégories, avec propriétés dynamiques et dépendances.
- **Déploiement et suivi d'instances** : visualisation, édition et soumission d'instances managées, avec affichage du cycle de vie et des statuts métier.
- **Formulaires dynamiques** : génération automatique de formulaires selon les propriétés de l'offre, prise en compte des dépendances et des valeurs suggérées.
- **Gestion des domaines et valeurs suggérées** : administration des domaines métiers et des listes de valeurs pour les propriétés.
- **IAM (gestion des accès)** : gestion des utilisateurs, groupes et méthodes d'authentification (locale ou OpenID Connect).
- **Configuration système** : accès à la configuration générale et aux tâches planifiées.

L'application s'interface avec une API REST backend pour toutes les opérations métier et d'administration.

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
