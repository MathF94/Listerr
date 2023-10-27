// équivalent d'actions.js
"use strict"

async function fetchCSRF(formId) {
    try {
        const formData = new FormData();
        formData.append("formId", formId);

        const url = "http://localhost/listerr/src/api/?route=csrf";
        return await fetch(url, {
            method: "POST",
            body: formData
        })
        .then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}

function CSRFToken(formId) {
    fetchCSRF(formId)
    .then(response => {
        if (response.status === "success") {
            localStorage.setItem("csrfToken", response.csrfToken);
        };
    });
}

export { CSRFToken };