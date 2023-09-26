let routes = {};
let templates = {};

const route = (path, template) => {
    console.log('fonction route()', {routes, path, template})
    if (typeof template === 'function') {
        return routes[path] = template;
    }
    else if (typeof template === 'string') {
        return routes[path] = templates[template];
    } else {
        return;
    };
};

const template = (name, templateFunction) => {
    console.log('fonction template', {name, templateFunction, template: templates[name]})
    return templates[name] = templateFunction;
};

const resolveRoute = (route) => {
    console.log('fonction resolveRoute()', {route, selectedRoute:routes[route]});
    try {
        return routes[route];
    } catch (e) {
        throw new Error(`Route ${route} not found`);
    };
};

const router = (evt) => {
    let url = window.location.hash.slice(1) || '/';
    let route = resolveRoute(url);
    //console.log("fonction router()", {evt, route, url});
    route();
};

export {route, template, router};
