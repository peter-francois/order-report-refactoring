# Order Report Refactoring

> Refactoring d'un pipeline de facturation client en TypeScript : lecture de fichiers CSV (clients, produits, commandes, zones, promotions), calcul des totaux avec remises, taxes et frais de port, et génération d'un rapport texte + export JSON.

---

## Structure du Dépôt

```
order-report-refactoring/
│
├── README.md
├── .gitignore
├── <fichier(s) de configuration>       # package.json, tsconfig.json, etc.
│
├── legacy/                             # ❌ NON MODIFIER - Code original
│   ├── <script_legacy>                 # Script TypeScript et JavaScript original
│   ├── data/                           # Fichiers CSV d'entrée
│   └── expected/
│       └── report.txt                  # Rapport de référence (golden master)
│
├── src/
│   ├── data/
│   │   ├── dataLoader.ts               # DataLoader global pour CSV
│   │   └── csvParser.ts                # Parser CSV avec csv-parse
│   ├── services/                       # Logique métier
│   │   ├── loyaltyService.ts           # Service de fidélité
│   │   ├── orderAggregator.ts          # Agrégateur principal des commandes
│   │   └── discountService.ts          # Service de calcul des remises
│   ├── types/
│   │   ├── interfaces/                 # Interfaces pour les données CSV
│   │   └── enums/                      # Enums pour les constantes métier
│   ├── constants.ts                    # Toutes les valeurs fixes de l'app
│   └── main.ts                         # Point d'entrée de l'application
│
└── tests/
    ├── fixtures/                       # Données de test
    ├── unit/                           # Tests unitaires
    └── golden-master.spec.ts           # Tests de non-régression
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

---

## Choix de refactoring

### Problèmes identifiés dans le legacy

#### Parsing manuel des CSV

**Description :** Le chargement des CSV reposait sur un parsing manuel, peu robuste et difficile à maintenir.  
**Impact :** Cela rendait le code plus fragile et augmentait le risque d’erreurs lors de l’évolution du projet.

#### Présence de magic numbers

**Description :** Plusieurs valeurs numériques étaient écrites directement dans le code, notamment dans le service de discount.  
**Impact :** Cela nuisait à la lisibilité et compliquait la maintenance.

#### Logique trop dispersée dans le point d’entrée

**Description :** Le `main` contenait trop de logique liée au chargement des données.  
**Impact :** Le point d’entrée était trop chargé et moins clair, ce qui rendait le code plus difficile à suivre.

### Solutions apportées

#### Mise en place de golden tests

**Ce que j’ai fait :** J’ai d’abord mis en place des golden tests afin de vérifier que le comportement de l’application restait identique pendant le refactoring.  
**Justification :** Cela permet de garantir la non-régression et de sécuriser les modifications successives.

#### Utilisation de `csv-parse`

**Ce que j’ai fait :** J’ai utilisé `csv-parse` pour traiter les fichiers CSV.  
**Justification :** Cette solution est plus fiable, plus claire et évite de maintenir un parsing artisanal.

#### Création d’un `DataLoader` global

**Ce que j’ai fait :** J’ai centralisé le chargement des données dans un `DataLoader` global, ce qui m’a permis de n’avoir qu’une seule ligne dans le `main` pour cette étape.  
**Justification :** Cela simplifie le point d’entrée de l’application et améliore la lisibilité du code.

#### Création des interfaces, enums et constants

**Ce que j’ai fait :** J’ai créé des interfaces et des enums pour structurer les différents CSV, ainsi qu’un fichier `constants` pour regrouper toutes les valeurs fixes de l’application.  
**Justification :** Cela rend le code plus explicite, plus maintenable et plus cohérent.

#### Créaction et nettoyage du `DiscountService`

**Ce que j’ai fait :** J’ai retiré les _magic numbers_ du service de discount.  
**Justification :** Cela améliore la compréhension du code et facilite les évolutions futures.

### Architecture choisie

J’ai organisé le projet de manière progressive, en commençant par les parties les plus simples et les plus isolées, puis en traitant la logique centrale. Cette approche m’a permis de sécuriser le refactoring étape par étape.

#### Modules / packages créés

- **DataLoader** : centralise le chargement des fichiers CSV.
- **LoyaltyService** : gère la logique liée au programme de fidélité.
- **OrderAggregator** : contient la logique principale d’agrégation des commandes.
- **DiscountService** : applique les règles de remise.
- **Interfaces / Enums / Constants** : structurent les données et évitent les valeurs en dur.

#### Rôle de chaque module

- **DataLoader** : importe les données et les met à disposition du reste de l’application.
- **LoyaltyService** : traite les règles liées à la fidélité.
- **OrderAggregator** : regroupe et transforme les données métiers principales.
- **DiscountService** : calcule les réductions selon les règles définies.
- **Interfaces / Enums / Constants** : apportent de la lisibilité et réduisent les erreurs de typage.

#### Flux de données

Les données sont d’abord chargées par le `DataLoader`, puis transmises aux services concernés selon leur responsabilité. Le `LoyaltyService` est traité en premier, ensuite l’`OrderAggregator` prend en charge le cœur du traitement, puis le `DiscountService` applique les règles de remise.

### Exemples concrets

#### Exemple 1 : Centralisation du chargement des données

**Problème :** Le chargement des CSV était dispersé et alourdissait le `main`.  
**Solution :** J’ai créé un `DataLoader` global pour regrouper cette logique en un seul endroit.

#### Exemple 2 : Suppression des magic numbers

**Problème :** Le `DiscountService` contenait plusieurs valeurs codées en dur.  
**Solution :** J’ai remplacé ces valeurs par des constantes, des interfaces et des enums afin de rendre le code plus clair et plus évolutif.

---

## Reproduction d’un bug legacy

Un bug présent dans le code original a été conservé volontairement afin de reproduire fidèlement le comportement historique de l’application.

Les fichiers CSV utilisent des fins de ligne Windows au format **CRLF**. Dans le code legacy, le découpage était effectué avec `\n` sans nettoyage des valeurs individuelles. Cela laissait donc un caractère `\r` à la fin de la dernière colonne de chaque ligne.

### Conséquence

Cette erreur provoquait l’échec des comparaisons de devise, par exemple `"USD\r" === "USD"`, ce qui désactivait systématiquement la conversion de devise.

### Choix retenu

Ce comportement a été reproduit intentionnellement dans le refactoring afin de rester conforme au **golden master** et de garantir une non-régression par rapport au fonctionnement initial.

---

## Limites et améliorations futures

### Ce qui n’a pas été fait

Par manque de temps, certaines améliorations n’ont pas pu être réalisées :

- Réduction supplémentaire de la duplication entre certains traitements métier.
- Ajout de tests unitaires plus fins sur certaines règles internes.

### Compromis assumés

- **Conservation du bug CRLF :** ce choix a été assumé pour rester fidèle au comportement du legacy et au golden master.
- **Découpage progressif du refactoring :** j’ai priorisé la stabilité et la lisibilité plutôt qu’une réécriture complète.

### Pistes d’amélioration future

**Épurer le main.ts**  et clarifier la vision macro :

- Créer le dossier `report/` avec `reportGenerator.ts` et `jsonExporter.ts`
- Ajouter `taxService.ts` et `shippingService.ts` dans `services/`
- Renforcer la couverture de tests unitaires sur les services métier.
- Simplifier encore davantage les responsabilités de certains modules.

---

## Remarques

Le refactoring a été mené de manière progressive afin de sécuriser chaque étape et de conserver le comportement attendu de l’application. Les golden tests ont joué un rôle central dans cette démarche, en servant de référence tout au long de la transformation du code.
