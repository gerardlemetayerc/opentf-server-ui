# Architecture technique

L'application OpenTF Server UI est construite avec React et Vite pour le frontend, et consomme une API REST pour toutes les opérations métier. Les principaux composants sont organisés dans le dossier `src/`.

- **Frontend** : React, Vite, Bootstrap/AdminLTE
- **Backend** : API REST (endpoints `/api/*`)
- **Authentification** : locale et OpenID Connect (OIDC)

Le routage, la gestion de session et la protection des routes sont assurés côté client. Les appels API sont centralisés via un utilitaire `fetchWithAuth`.
