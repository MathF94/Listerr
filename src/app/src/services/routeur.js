let routes = {}; // objet pour stocker les URLs
let templates = {}; // objet pour stocker les templates (les fonctions qui appellent les templates)

// Fonction qui permet de faire le stockage des URLs dans routes
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

// Fonction qui permet de faire le stockage des fonctions appelant les templates
const template = (name, templateFunction) => {
    templates[name] = templateFunction;
    // console.log('fonction template', {name, templateFunction, template: templates[name]})
    return templates;
};

// Fonction qui retrouve la route et la retourne en fonction du path de la fonction route sinon retourne une erreur
const resolveRoute = (path) => {
    // console.log('fonction resolveRoute()', {path, selectedRoute:routes[path], routes});
    try {
        // retourne le template Cf. ligne 8 ave routes[path] = template
        return routes[path];
    } catch (e) {
        throw new Error(`Route ${path} not found`); // possible de retourner vers E404
    };
};

const router = (evt) => {
    let path = window.location.hash.slice(1) || '/';
    let route = resolveRoute(path);
     console.log("fonction router()", {evt, route, routes, templates, path});
    route();
};

//console.log("route");
export {route, template, router};
