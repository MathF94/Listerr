import View from "./view.js";
import {route, template, router} from "./routeur.js"

// fonction template (name, templateFunction) => {}
// template("index", function(){
//     View.load("./index"); //  View.load(nom de fichier sans extension)
// });
// fonction route (path, template) => {}
// route("/", "index");

// route home
template("home", function(){
    View.load("./home");
});
route("/home.html", "home");

// route registration
template("registration", function(){
    View.load("./registration");
});
route("/registration.html", "registration");

// route login
template("login", function(){
    View.load("./login");
});
route("/login.html", "login");

// route profil
template("profil", function(){
    View.load("./profil");
});
route("/profil.html", "profil");

// (admin) route listes d"utilisateurs
template("users", function(){
    View.load("./profils");
});
route("/profils.html", "users");

// route update user
template("update", function(){
    View.load("./update");
});
route("/update.html", "update");

// route wishlist
template("wish", function(){
    View.load("./wish");
});
route("/wish.html", "wish");

// route todolist
template("todo", function(){
    View.load("./todo");
});
route("/todo.html", "todo");

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
