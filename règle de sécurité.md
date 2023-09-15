* Ne jamais faire confiance à l'utilisateur ni au HTML ( un input de type email peut être modifié pour vous envoyer du script ou autre )
* Toujours BINDER vos VALUES ( avec les jetons ou les ? ) que ce soit dans la récupération des données d'un formulaire comme pour les donnée du GET, d'un $_COOKIES ou d'un $_SESSION ( recherche d'un article via son id par exemple )
* Toujours utiliser le TRIM
* Toujours utiliser le HTMLSPECIALCHARS ( en sortie ) même si les données proviennent du $_SESSION, d'un $_COOKIES ou autre.

* Sur certains champs bien spécifiques, il est possible d'utiliser STRIPSLAHES ( pas de manière systématique )
* Toujours vérifier la capacité ( size ) du fichier uploadé ( Si vous n'acceptez que des images de moins de 2Mo, l'utilisateur ne doit pas pouvoir vous en envoyer une plus grande )
* Toujours vérifier l'extension du fichier uploadé ( Pas question que l'utilisateur vous envoi un fichier .pdf en guise d'avatar de profil par exemple )
* Toujours utiliser MIMES pour l'upload de fichier ( quelque soit le type de fichier )
* Toujours vérifier le formulaire, chaque champ doit être soumis à une vérification ( si vide, si nombre de caractères suffisant, ... )
* Attention au volume du POST ( 8Mo )
* Evitez d'appeler les names de vos inputs du même nom que les colonnes de vos tables pour ne pas aiguiller un potentiel hacker sur les noms de vos colonnes dans votre bdd.
* Toujours vérifier que l'utilisateur vous fait parvenir des données exploitables ( ex : pour l'age on attend un nombre, donc pas de lettre ou autre ! ). De plus, si vous ne bloquez pas ces données, votre requête SQL va tenter de mettre dans un champ un valeur inadaptée ( ici, elle tentera de mettre des lettres dans une colonne qui attend des nombres "INT")
* S'assurer que la soumission d'un formulaire provient bien de votre site et pas d'un autre. (CRSF : token)
* Toujours utiliser FILTER_VAR pour vérifier les adresses email.
* Vérifier la faille concernant l'email. ( le +1 )
* Toujours utiliser PASSWORD_HASH pour les mots de passe. Ne jamais stocker les mots de passe en clair.

* Ne jamais dire à l'utilisateur où est son erreur lorsqu'il se connecte ( dire simplement : "Erreur d'identification !", ca suffit )
* On ne stocke jamais un mot de passe dans un $_COOKIES ou $_SESSION. ( sauf si hashé, mais même dans ce cas, je vous le déconseille fortement )
* Toutes les pages necessitant d'être connecté pour y accéder doivent faire l'objet d'une vérification de l'état de la connexion. Si la SESSION est expirée, l'utilisateur doit être redirigé vers la page de connexion. ( C'est le cas pour le backOffice de votre site )
* Jamais de lien vers le backOffice sur le FRONT. L'inverse est possible.
* La méthode DELETE se réalise avec un formulaire et non par le biais d'un <a hef="">. il faut bloquer la faille CRSF aussi dans le formulaire