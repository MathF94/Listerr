"use strict";

/**
 * Configuration des chemins de base pour l'application et l'API.
 * @property {string} basePath - Le chemin de base de l'application.
 * @property {string} apiPath - Le chemin de base de l'API.
 */
const configPath = {
    basePath: "http://localhost/listerr/src/app/src",
    apiPath: "http://localhost/listerr/src/api"
};

const allowedIds = [
    "status",
    "id",
    "userId",
    "user",
    "type",
    "title",
    // "description",
    "cards",
    "createdAt",
    "updatedAt"
];

const type = {
    WishList: 'wish',
    TodoList: 'todo',
    Common: 'common'
};

/**
 * Ajout d'astérisque pour les champs obligatoires des formulaires
 */
const mandatoryStar = document.createElement("span");
mandatoryStar.innerText = "*";
mandatoryStar.classList.add("mandatory");

/**
 * Redirige l'utilisateur vers une autre URL.
 * @param {string} url - L'URL vers laquelle rediriger l'utilisateur.
 * @param {number} [duration=2000] - La durée en millisecondes avant la redirection.
 */
function redirect(url, duration = 2000) {
    window.setTimeout(function () {
        window.location.href = url;
    }, duration);
}

/**
 * Affiche une boîte de dialogue modale.
 * @param {Object} options - Les options de la boîte de dialogue.
 * @param {string} [options.title="Notification"] - Le titre de la boîte de dialogue.
 * @param {string|Array|Object} options.content - Le contenu de la boîte de dialogue.
 */
function dialog({title, content}) {
    const header = document.querySelector("#navWrapper");
    title = title || "Notification";

    const titleH2 = document.createElement("h2");
    titleH2.innerHTML = title;

    const dialogSection = document.createElement("section");
    dialogSection.id = "dialog";
    header.after(dialogSection);

    const dialog = document.createElement("dialog");
    dialog.open = "open";
    dialog.prepend(titleH2);

    if (typeof content === "string") {
        const div = document.createElement("div");
        div.innerHTML = content;
        dialog.appendChild(div);
        dialogSection.append(dialog);
    }

    if (["array", "object"].includes(typeof content)) {
        const list = document.createElement("ul");
        for (const index in content) {
            const item = document.createElement("li");
            const column = content[index];
            item.innerText = column;
            list.appendChild(item);
        }
        dialog.appendChild(list);
        dialogSection.appendChild(dialog);
    }
}

function toolTip(anchor, updatedAt, login) {
    const toolTip = document.createElement("div");
    toolTip.classList.add("tooltip");
    const spanToolTip = document.createElement("span");
    spanToolTip.classList.add("tooltiptext");
    spanToolTip.innerText = `Modifié le ${updatedAt} par ${login}.`;
    toolTip.appendChild(spanToolTip);
    anchor.appendChild(toolTip);
}

function notAllowedRedirection(type) {
    if (type !== "WishList" || type === null) {
        if (!localStorage.token || localStorage.token === undefined) {
            redirect(`${configPath.basePath}/home/pages/home.html`, 0);
        }
    }
}

function scroll() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

function validate(input) {
    const errors = {
        password: "Le mot de passe doit contenir au moins 12 caractères dont une majuscule, un chiffre et un caractère spécial.",
        name: "Le champ 'Nom' ne peut contenir que des lettres, des espaces, des tirets et des apostrophes.",
        firstname: "Le champ 'Prénom' ne peut contenir que des lettres, des espaces, des tirets et des apostrophes.",
        email: "L'adresse email n'est pas valide.",
        titleList: "Le champ 'titre' ne doit pas dépasser 20 caractères.",
        titleCard: "Le champ 'titre' ne doit pas dépasser 20 caractères.",
        priority: "La chaîne ne doit contenir que les chiffres allant de 1 à 5."
    }
    const validityState = input.validity;
    if (validityState.valueMissing) {
        input.setCustomValidity("Ce champs est requis.");
    }
    if (validityState.patternMismatch) {
        input.setCustomValidity(errors[input.id]);
    }
    if (validityState.tooShort || validityState.tooLong) {
        input.setCustomValidity(errors[input.id]);
    }
    if (validityState.rangeOverflow || validityState.rangeUnderflow) {
        input.setCustomValidity(errors[input.id]);
    }
}

export {
    configPath,
    allowedIds,
    type,
    redirect,
    dialog,
    toolTip,
    notAllowedRedirection,
    mandatoryStar,
    scroll,
    validate
};
