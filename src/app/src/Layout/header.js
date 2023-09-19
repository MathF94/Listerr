import navigation from './nav.js';

function initLayout() {
    const template = document.createElement('header')
    template.id = "mainWrapper";
    template.className = "mainWrapper";

    const title = document.createElement('h1')
    title.id = "mainTitle";
    title.className = "mainTitle";
    title.innerText = 'Listerr';
    template.appendChild(title)

    navigation(template);

    const msg = document.createElement('div')
    msg.id = "mainMessage";
    msg.className = "mainMessage";

    template.appendChild(msg)
    document.body.prepend(template);
}

document.addEventListener("DOMContentLoaded", () => {
    initLayout();
})
