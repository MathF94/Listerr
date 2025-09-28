# Présentation

Je m'appelle Mathieu FAGOT, développeur web en reconversion, suite à une expérience professionnelle dans le secteur de la Qualité, depuis 2013.
Ce projet a été créé pendant ma formation, puis continuellement amélioré depuis 2023.

# Listerr

**Listerr** est une application web écrite en **PHP** et **JavaScript vanilla** (sans framework).
Elle permet de gérer :
- des listes de tâches (todo)
- des listes de souhaits (wishlist)
avec des options de partage et de réservation.

## 🔍 Fonctionnalités avancées

- Gestion des comptes : rôles admin et utilisateur
- En tant qu’admin :
  - Suivi des évolutions demandées
  - Validation / refus de suggestions
  - Traitement des alertes de bug envoyées par les utilisateurs
- En tant qu’utilisateur :
  - Envoi de suggestions d’améliorations
  - Signalement de bugs
- Système d’e-mails entre utilisateurs (création de souhaits, mises à jour, etc.)

## Installation

### Pré-requis

- Installation WAMP (recommandé)

OU

- Installation serveur Apache
- Installation serveur MySQL

### Mise en place du code source

Le projet doit être installé dans le répertoire `C:\wamp64\www\`.

### Installation des dépendances

Le projet utilise Composer pour gérer ses dépendances PHP.
Assurez-vous d’avoir [Composer](https://getcomposer.org/) installé sur votre machine.

Pour les installer, lancez la commande suivante dans le répertoire du projet :

```bash
composer install
```

### Mise en place de la base de données

Dans phpMyAdmin, il faut exécuter les scripts SQL qui se trouvent dans le répertoire data/dbinit.

## Première connexion

Pour la première connexion, il faut se rendre à la page home et se connecter en tant qu'Admin :
- login : Admin
- password : passwordAdmin1+

Un utilisateur est d’ores et déjà créé pour commencer à jouer avec les listes :
- login : User
- password : passwordUser2+

Il est possible également de se créer un nouvel utilisateur, à partir de la page home, via le lien **inscription**.
