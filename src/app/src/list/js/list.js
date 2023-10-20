"use strict";

import { fetchReadOneListOneUser } from "./actions.js";

function list() {
    const urlParams = new URLSearchParams(document.location.search);
    const id = urlParams.get("id");
    
    fetchReadOneListOneUser(id)
    .then(response => {
        if (urlParams.has("id")) {
        
        }

    })

}


document.addEventListener("DOMContentLoaded", () => {
    list();
});
