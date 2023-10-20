"use strict";

import { fetchReadOneListOneUser } from "./actions.js";

function list() {
    const urlParams = new URLSearchParams(document.location.search);
    console.log(document.location.search);
    if (urlParams.has("id")) {
        console.log("coucou vue d'une seule liste");
    
    }

}


document.addEventListener("DOMContentLoaded", () => {
    list();
});
