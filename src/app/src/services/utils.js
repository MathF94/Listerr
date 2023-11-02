"use strict";

/**
 * Configuration des chemins de base pour l'application et l'API.
 * @namespace
 * @property {string} basePath - Le chemin de base de l'application.
 * @property {string} apiPath - Le chemin de base de l'API.
 */
const configPath = {
    basePath: "http://localhost/listerr/src/app/src",
    apiPath: "http://localhost/listerr/src/api"
};

/**
 * Redirige l'utilisateur vers une autre URL.
 * @param {string} url - L'URL vers laquelle rediriger l'utilisateur.
 * @param {number} [duration=2000] - La durée en millisecondes avant la redirection.
 */
function redirect(url, duration = 2000) {
    window.setTimeout(function() {
        window.location.href = url
        }, duration)
};

/**
 * Affiche une boîte de dialogue modale.
 * @param {Object} options - Les options de la boîte de dialogue.
 * @param {string} [options.title="Notification"] - Le titre de la boîte de dialogue.
 * @param {string|Array|Object} options.content - Le contenu de la boîte de dialogue.
 * @param {boolean} [options.hasTimeOut] - Indique si la boîte de dialogue doit disparaître automatiquement après 2 secondes.
 */
function dialog({title, content, hasTimeOut}) {

    title = title || "Notification" ;
    const titleH2 = document.createElement("h2");
    titleH2.innerHTML = title ;
    const dialogSection = document.createElement("section");
    dialogSection.id = "dialog";
    dialogSection.className = "dialog";
    document.body.appendChild(dialogSection);
    const dialog = document.createElement("dialog");
    dialog.open = "open";
    dialog.prepend(titleH2);

    if (typeof(content) === "string")  {
        const div = document.createElement("div");
        div.innerHTML = content;
        dialog.appendChild(div);
        dialogSection.append(dialog);
    };

    if (["array", "object"].includes(typeof(content))) {
        const list = document.createElement("ul");
        for(const index in content){
        const item = document.createElement("li");
        const column = content[index];
        item.innerText = column;
        list.appendChild(item);
        };
        dialog.appendChild(list);
        dialogSection.appendChild(dialog);
    };

    if (hasTimeOut) {
        const msg = document.createElement('div');
        msg.innerHTML = "Ce message s'effacera dans 2 secondes...";
        dialog.appendChild(msg);
        setTimeout(() => {
            document.body.removeChild(dialogSection);
        }, 2000);
    };
};

export { configPath, redirect, dialog };