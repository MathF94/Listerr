import { navigation } from './nav.js';

function header() {
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

export { header } ;
