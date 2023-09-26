import navigation from './nav.js';

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

    const msg = document.createElement('div')
    msg.id = "mainMessage";
    msg.className = "mainMessage";

    header.appendChild(msg)
    document.body.prepend(header);
}

document.addEventListener("DOMContentLoaded", () => {
    header();
})
