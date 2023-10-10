import {route, template, router} from "./routeur.js"


const addRoute = (path, templateName, callback) => {
    // fonction template (name, templateFunction) => {}
    template(templateName, callback);
    // fonction route (path, template) => {}
    route(path, templateName);
}

window.addEventListener("load", router);
window.addEventListener("hashchange", router);

export {addRoute}