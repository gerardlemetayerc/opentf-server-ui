# Sécurité et bonnes pratiques

- Les secrets et la configuration OIDC ne sont jamais exposés côté client
- Les tokens d'authentification sont stockés en localStorage et invalidés globalement
- Les routes sensibles sont protégées par le contexte d'authentification
- Toute modification de configuration doit passer par l'interface sécurisée

Respectez les bonnes pratiques de sécurité lors de l'intégration et de l'évolution du projet.
