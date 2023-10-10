/**
 * objet pour stocker les URLs // c'est pour "comment accéder au template"
*/
let routes = {};

/**
 * objet pour stocker les templateFunction (les fonctions qui appellent les templates)
 * ici c'est "qu'est-ce qu'on fait avec la route à partir de là"
 */
let templates = {};

// les deux fonctions du haut permettent d'alimenter let routes et let templates
/**
 * Fonction qui permet de faire le stockage des URLs dans routes
 */
const route = (path, template) => {
    // console.log('fonction route()', {routes, path, template})
    if (typeof template === 'function') {
        return routes[path] = template;
    }
    else if (typeof template === 'string') {
        // routes[path] = templates[page html];
        return routes[path] = templates[template];
    } else {
        return;
    };
};

/**
 * Fonction qui permet de faire le stockage des fonctions appelant les templates
 */
const template = (name, templateFunction) => {
    templates[name] = templateFunction;
    // console.log('fonction template', {name, templateFunction, template: templates[name]})
    // return templates;
};

// les deux fonctions du bas permettent de retrouver les routes qui ont été stockées
/**
 * Fonction qui retrouve la route et la retourne en fonction du path de la fonction route sinon retourne une erreur
 * return routes[path] = retourne le template Cf. ligne 8 ave routes[path] = template
 */
const resolveRoute = (path) => {
    // console.log('fonction resolveRoute()', {path, selectedRoute:routes[path], routes});
    try {
        return routes[path];
    } catch (e) {
        throw new Error(`Route ${path} not found`); // possible de retourner vers E404
    };
};

/**
 * Fonction qui retrouve le path pour la fonction resolveRoute()
 * let path = variable qui récupère la coupe dans l'URL de ce qu'il y a derrière le premier #
 *            sinon path = index.html
 * let route = variable qui récupère le résultat de resolveRoute (qui retrouve et retourne la route),
 *             ==> soit "return routes[path]"
 * evt = window.addEventListener("load", router);
 *       window.addEventListener("hashchange", router);
 */

const router = (evt) => {
    let path = window.location.hash.slice(1) || '/';
    let templateFunction = resolveRoute(path);
    // console.log("fonction router()", {evt, route, path});
    templateFunction();
};

export {route, template, router};
