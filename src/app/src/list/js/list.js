"use strict";

import { fetchReadOneListOneUser } from "./actions.js";

function list() {
    const urlParams = new URLSearchParams(document.location.search);
    if (urlParams.has("id")) {
        const id = urlParams.get("id");

        fetchReadOneListOneUser(id)
        .then(response => {
            console.log(response);
        })
    }
    

}


document.addEventListener("DOMContentLoaded", () => {
    list();
});
