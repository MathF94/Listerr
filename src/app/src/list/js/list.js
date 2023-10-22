"use strict";

import { fetchReadOneListOneUser } from "./actions.js";

function list() {
    const urlParams = new URLSearchParams(document.location.search);
    if (urlParams.has("id")) {
        const id = urlParams.get("id");

        fetchReadOneListOneUser(id)
        .then(response => { 
            const data = response.data;
            if (response.status === "readOneList") {
                const oneList = document.querySelector("#OneList");
                oneList.id = "oneList";
                oneList.class = "oneList";
                
                const titleH3 = document.createElement("h3");
                titleH3.innerText = data.type
                
                const list = document.createElement("ul");
                
                for (const index in data) {
                    const item = document.createElement("li");
                    const object = data[index];

                    if (["id", "userId", "type"].includes(`${index}`)) {
                        continue;
                    }
                    
                    if ( index === "user" && typeof(data[index]) === "object") {
                        item.innerText = `Par ${data.user.login}`;
                    } else {
                        if (index === "createdAt") {
                            item.innerText = `Créée le ${data.createdAt}`;
                        } else if (index === "updatedAt") {
                            item.innerText = `Modifiée le ${data.updatedAt}`;
                        } else {
                            item.innerText = `${object}`;
                        }
                    }
                    list.appendChild(item);
                    oneList.appendChild(titleH3);
                    oneList.appendChild(list);
                }
            }
        })
    }
    

}


document.addEventListener("DOMContentLoaded", () => {
    list();
});
