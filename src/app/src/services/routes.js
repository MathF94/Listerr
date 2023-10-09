import View  from "./view.js";
import {route, template, router} from "./routeur.js"

// fonction template (name, templateFunction) => {}
template("index", function(){
    View.load("./index"); //  View.load(nom de fichier sans extension)
});
// fonction route (path, template) => {}
route("/", "index");

// route registration
template("registration", function(){
    View.load("./registration"); //
});
route("/registration.html", "registration");

// route login
template("login", function(){
    View.load("./login"); //
});
route("/login.html", "login");

// route profil
template("profil", function(){
    View.load("./profil"); //
});
route("/profil.html", "profil");

// (admin) route listes d"utilisateurs
template("users", function(){
    View.load("./profils"); //
});
route("/users.html", "users");

// route update user
template("update", function(){
    View.load("./update"); //
});
route("/update.html", "update");

window.addEventListener("load", router);
window.addEventListener("hashchange", router);
