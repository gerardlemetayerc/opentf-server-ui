# Cycle de vie et statuts métier

Les instances suivent un cycle de vie métier représenté par différents statuts :

- **Draft** : Instance en cours de création ou d’édition, non soumise pour validation. L’utilisateur peut modifier toutes les propriétés.
- **WaitingForValidation** : Instance soumise pour validation métier ou technique. Les modifications sont bloquées, en attente d’une action de validation ou de rejet.
- **ImpactAnalysis** : L’instance est en cours d’analyse d’impact : vérification des conséquences métier, techniques ou de sécurité avant validation définitive.
- **Validated** : Instance validée, considérée comme conforme et active. Les actions principales sont autorisées (exploitation, suivi, etc.).
- **Rejected** : Instance rejetée lors de la validation ou de l’analyse d’impact. L’utilisateur peut éventuellement corriger et soumettre à nouveau.
- **Terminated** : Instance clôturée ou supprimée. Plus aucune action n’est possible, l’instance est archivée ou retirée du système.

Le diagramme du cycle de vie est disponible dans l'interface (ReactFlow). Chaque transition est soumise à des règles métier : par exemple, une instance ne peut passer de Draft à Validated sans passer par WaitingForValidation et ImpactAnalysis.

Les transitions sont généralement déclenchées par des actions utilisateur (soumission, validation, rejet, clôture) ou des processus automatisés selon la configuration métier.
