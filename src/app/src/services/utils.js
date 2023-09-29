'use strict';

function redirect(url, duration = 3000) {
    window.setTimeout(function() {
        window.location.href = url
        }, duration)
}

function dialog(message) {
    const dialogSection = document.createElement('section');
    dialogSection.id = "dialog";
    dialogSection.className = "dialog";
    document.body.appendChild(dialogSection);

    const msg = document.createElement('dialog');
    msg.open = 'open';
    msg.innerHTML = `<p>${message}</p>`
    dialogSection.append(msg);
}

export { redirect, dialog};