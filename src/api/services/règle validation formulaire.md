public function validateRegistrationData(array $params, array &$errors): bool
{
    $errors = [];

    if (empty(trim($params['login']))) {
        $errors[] = 'Le champ "Login" est requis.';
    } elseif (strlen($params['login']) > 20) {
        $errors[] = 'Le champ "Login" ne doit pas dépasser 20 caractères.';
    }

    if (empty(trim($params['email']))) {
        $errors[] = 'Le champ "Email" est requis.';
    } elseif (!filter_var($params['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'L\'adresse email n\'est pas valide.';
    }

    if (empty(trim($params['password']))) {
        $errors[] = 'Le champ "Mot de passe" est requis.';
    } elseif (strlen($params['password']) < 12) {
        $errors[] = 'Le mot de passe doit comporter au moins 12 caractères.';
    } elseif (!preg_match('/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{12,}$/', $params['password'])) {
        $errors[] = 'Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial.';
    }

    if (empty(trim($params['name']))) {
        $errors[] = 'Le champ "Nom" est requis.';
    } elseif (strlen($params['name']) < 3 || strlen($params['name']) > 20) {
        $errors[] = 'Le champ "Nom" doit comporter entre 3 et 20 caractères.';
    } elseif (!preg_match("/^[A-Za-z '-]+$/", $params['name'])) {
        $errors[] = 'Le champ "Nom" ne peut contenir que des lettres, des espaces, des tirets et des apostrophes.';
    }

    if (empty(trim($params['firstname']))) {
        $errors[] = 'Le champ "Prénom" est requis.';
    } elseif (strlen($params['firstname']) < 3 || strlen($params['firstname']) > 20) {
        $errors[] = 'Le champ "Prénom" doit comporter entre 3 et 20 caractères.';
    } elseif (!preg_match("/^[A-Za-z '-]+$/", $params['firstname'])) {
        $errors[] = 'Le champ "Prénom" ne peut contenir que des lettres, des espaces, des tirets et des apostrophes.';
    }

    return empty($errors);
}

$errors = [];
if ($this->validateRegistrationData($params, $errors)) {
    // Les données sont valides, continuez le traitement.
} else {
    // Les données sont invalides, utilisez $errors pour afficher les messages d'erreur.
    var_dump($errors);
}