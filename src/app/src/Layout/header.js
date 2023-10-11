import { navigation } from './nav.js';
import { uploadElement } from "../services/utils.js";

function header(mainWrapper) {
    const header = document.createElement('header')
    header.id = "mainWrapper";
    header.className = "mainWrapper";

    const title = document.createElement('h1')
    title.id = "mainTitle";
    title.className = "mainTitle";
    title.innerText = 'Listerr';
    title.style.textAlign = 'Center';
    header.appendChild(title)

    navigation(header);

    document.body.prepend(header);
}

// uploadElement('#mainWrapper')
// .then(mainWrapper => {
//     console.log("coucou");
//     header(mainWrapper);
// })

document.addEventListener("DOMContentLoaded", () => {
    header();
})

export { header } ;
