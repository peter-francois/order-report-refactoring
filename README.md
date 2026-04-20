# Order Report Refactoring
 
> Refactoring d'un pipeline de facturation client en TypeScript : lecture de fichiers CSV (clients, produits, commandes, zones, promotions), calcul des totaux avec remises, taxes et frais de port, et génération d'un rapport texte + export JSON.

---
 
## Structure du Dépôt
 
```
order-report-refactoring/
│
├── README.md
├── .gitignore
├── <fichier(s) de configuration>       (package.json, etc.)
│
├── legacy/                             ❌ NON MODIFIER
│   ├── <script_legacy>
│   ├── data/
│   └── expected/
│       └── report.txt
│
├── src/                                
│   └── ...
│
└── tests/                              
    └── ...
```
 
---
 
## Installation
 
### Prérequis
- Node version 22.16
- Git version 2.24
### Commandes
```bash
# Commandes pour installer les dépendances

npm install
```
 
---
 
## Exécution
 
### Exécuter le code refactoré
```bash
# Commande pour lancer votre code

npm run legacy
```
 
### Exécuter les tests
```bash
# Commande pour lancer tous les tests

npm run test
```

### Linter
```bash
# Vérifier les erreurs ESLint

npm run lint          
```

### Formatter
```bash
# Formater avec Prettier

npm run format        
```