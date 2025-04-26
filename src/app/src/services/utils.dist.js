"use strict";

/**
 * Clés autorisées dans les listes et cartes
 */
const allowedIds = [
    "cards",
    "createdAt",
    "id",
    "listId",
    "login",
    "priority",
    "reservationId",
    "status",
    "title",
    "type",
    "updatedAt",
    "userId",
    "user",
];

/**
 * Chemin d'API et chemin d'APP
 */
const configPath = {
        basePath: "{{BASE_PATH}}",
        apiPath: "{{API_PATH}}"
    };

/**
 * Ajout d'astérisque pour les champs obligatoires des formulaires
 */
const mandatoryStar = document.createElement("span");
mandatoryStar.innerText = "*";
mandatoryStar.classList.add("mandatory");

/**
 * Constantes utilisées pour le CSS des wish / todo
 */
const type = {
    WishList: 'wish',
    TodoList: 'todo',
    Common: 'common'
};

/**
 * Permet de rendre utilisables les boutons lors de la modification d'une liste
 * @param {string} selector - La classe pour sélectionner les boutons
 * @param {string} disableClass - la classe à ajouter pour rendre inutilisable le bouton visé
 * @param {string} firstClass - la classe initiale du bouton
 */
function buttonsOff(selector, disableClass, firstClass) {
    const buttons = document.querySelectorAll(selector);

    buttons.forEach(button => {
        button.classList.add(disableClass);
        button.classList.remove(firstClass);
        button.disabled = false;
    })
}

/**
 * Permet de créer l'élément HTML option pour la création d'emails, peu importe le nombre d'utilisateurs
 */
function createOptionMails() {
    const optionMails = document.createElement('option');
    optionMails.value = 'Destinataire(s)';
    optionMails.id = `optMails`;
    optionMails.setAttribute('value', 'allMembers');
    optionMails.innerText = `Tous les membres de Listerr`;
    return optionMails;
}

/**
 * Permet de créer l'élément HTML option pour la création d'emails, peu importe le nombre d'utilisateurs
 * @param {number} id - l'ID d'un utilisateur
 * @param {string} login - le login d'un utilisateur
 * @param {string} email - l'email d'un utilisateur
 */
function createOptionLoginMail(id, login, email) {
    const optionLoginMail = document.createElement('option');
    optionLoginMail.value = 'Destinataire(s)';
    optionLoginMail.id = `optLoginMail-${id}`;
    optionLoginMail.setAttribute('value', `${email}`);
    optionLoginMail.innerText = `${login} : ${email}`;
    return optionLoginMail;
}

/**
 * Permet de retirer les heures des mises à jours de listes / cartes par l'utilisateur
 * Permet de retourner un message en intégrant la date sans heures avec le login de l'utilisateur
 * @param {string} time
 * @param {string} login
 * @returns
 */

function detail(time, login) {
    let date = new Date(time);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let formatedDate = (day < 10 ? '0' : '') + day + '/'
                        + (month < 10 ? '0' : '') + month + '/'
                        + year;
    const message = `Modifié par ${login}, \n le ${formatedDate}`
    return message;
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

/**
 * Permet de rendre inutilisable les boutons lors de la création d'une carte
 * @param {string} selector - La classe pour sélectionner les boutons
 * @param {string} disableClass - la classe à ajouter pour rendre inutilisable le bouton visé
 * @param {string} firstClass - la classe initiale du bouton
 * @param {string} cancelAnchor - bouton pour l'annulation de carte
 */

function manageBtns(selector, disableClass, firstClass, cancelAnchor) {
    const buttons = document.querySelectorAll(selector);

    buttons.forEach(button => {
        button.classList.add(disableClass);
        button.classList.remove(firstClass);
        button.setAttribute("disabled", "true");

        cancelAnchor.addEventListener("click", e => {
            button.classList.add(firstClass)
            button.classList.remove(disableClass);
            button.removeAttribute("disabled");
        })
    });
}

/**
 * Permet d'afficher / masquer le menu dans les listes / cartes
 * @param {number} dataId
 */

function menu(dataId) {
    const el = document.querySelector(`#dropDown-${dataId}`);
    const btn = el.querySelector('.more__btn');
    let visible = false;

    function showMenu(e) {
        e.preventDefault();
        if (!visible) {
            visible = true;
            el.classList.add('show__more__menu');
            document.addEventListener('mousedown', hideMenu, false);
        }
    }

    function hideMenu(e) {
        if (btn.contains(e.target)) {
            return;
        }
        if (visible) {
            if (!el.contains(e.target)) {
                visible = false;
                el.classList.remove('show__more__menu');
                document.removeEventListener('mousedown', hideMenu);
            }
        }
    }
    el.addEventListener('click', showMenu, false);
}

/**
 * Redirige l'utilisateur invité vers la page d'accueil, si la liste n'est pas une wishlist.
 * @param {string} type - Le type de liste
 */
function notAllowedRedirection(type) {
    if (type !== "WishList" || type === null) {
        if (!localStorage.token || localStorage.token === undefined) {
            redirect(`${configPath.basePath}/home/pages/home.html`, 0);
        }
    }
}

/**
 * Redirige l'utilisateur vers une autre URL.
 * @param {string} url - L'URL vers laquelle rediriger l'utilisateur.
 * @param {number} [duration=2000] - La durée en millisecondes avant la redirection.
 */
function redirect(url, duration = 1000) {
    window.setTimeout(function () {
        window.location.href = url;
    }, duration);
}

/**
 * Affiche ou cache le mot de passe en cliquant sur l'oeil.
 */
function reveal() {
    const eyeIcon = document.querySelector("#icon");
    const inputPW = document.querySelector("#password")
    inputPW.classList.add("pl");

    eyeIcon.addEventListener("click", function(e) {
        e.preventDefault();

        if (inputPW.type === "password") {
            inputPW.type = "text";
            eyeIcon.classList.remove("icon");
            eyeIcon.classList.add("closed_eye");
        } else {
            eyeIcon.classList.add("icon");
            eyeIcon.classList.remove("closed_eye");
            inputPW.type = "password";
        }
    })
}

/**
 * Permet de remonter en haut de page après Create Update Delete
 */
function scroll() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

/**
 * Permet de renvoyer les messages d'erreur en cas de non validation des champs
 * @param {string} input
 */
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
    allowedIds,
    configPath,
    mandatoryStar,
    type,
    buttonsOff,
    createOptionMails,
    createOptionLoginMail,
    detail,
    dialog,
    manageBtns,
    menu,
    notAllowedRedirection,
    redirect,
    reveal,
    scroll,
    validate
};
