"use strict";

function redirect(url, duration = 3000) {
    window.setTimeout(function() {
        window.location.href = url
        }, duration)
};

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

export { redirect, dialog };