"use strict";

function redirect(url, duration = 3000) {
    window.setTimeout(function() {
        window.location.href = url
        }, duration)
};

function dialog({title, content, hasTimeOut}) {

    title = title || "Notification" ;
    const h2 = document.createElement("h2");
    h2.innerHTML = title ;
    const dialogSection = document.createElement("section");
    dialogSection.id = "dialog";
    dialogSection.className = "dialog";
    document.body.appendChild(dialogSection);
    const dialog = document.createElement("dialog");
    dialog.open = "open";
    dialog.prepend(h2);

    if (typeof(content) === "string")  {
        const div = document.createElement("div");
        div.innerHTML = content;
        dialog.appendChild(div);
        dialogSection.append(dialog);
    };

    if (["array", "object"].includes(typeof(content))) {
        const ul = document.createElement("ul");
        for(const index in content){
        const li = document.createElement("li");
        const column = content[index];
        li.innerText = column;
        ul.appendChild(li);
        };
        dialog.appendChild(ul);
        dialogSection.appendChild(dialog);
    };

    if (hasTimeOut) {
        const msg = document.createElement('div');
        msg.innerHTML = "Ce message s'effacera dans 5 secondes...";
        dialog.appendChild(msg);
        setTimeout(() => {
            document.body.removeChild(dialogSection);
        }, 5000);
    };
};

export { redirect, dialog };