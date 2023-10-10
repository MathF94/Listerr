"use strict";

import { fetchLogin } from "./actions.js";
import { redirect, dialog, waitForElm } from "../../services/utils.js";

function login(form) {
    form.addEventListener("submit", function(e){
        e.preventDefault();

        fetchLogin(form)
        .then(response => {
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify({
                id: response.user_id,
                login: response.user_login,
                is_admin: response.user_isAdmin
            }))
            localStorage.getItem("token")

            if (response.status === "success") {
                const login = e.target.children.login.value;
                dialog({title: `<p>Bonjour ${login} !</p>`, content: `<p>Vous êtes bien connecté(e).</p>`});
                redirect("http://localhost/#/profil.html", 3000);
            };

            if (response.status === "fail_data") {
                dialog({title: "Erreurs de données", content: response.message, hasTimeOut: true});
                redirect("http://localhost/#/login.html", 3000);
            };

            if (response.status === "fail") {
                dialog({title: "Erreurs", content: response.errors, hasTimeOut: true});
                redirect("http://localhost/#/login.html", 3000);
            };
        });
    });
};

waitForElm('#form').then((elm) => {
    login(elm);
});
console.log("login");

export default login;
