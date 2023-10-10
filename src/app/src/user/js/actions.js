"use strict"

async function fetchRegister(form) {
    try {
        const url = "http://localhost/listerr/src/api/?route=user_register";
        return await fetch(url, {
            method: "POST",
            body: new FormData(form)
        }).then(response =>
            response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}

async function fetchLogin(form) {
    try {
        const url = "http://localhost/listerr/src/api/?route=user_login";
        return await fetch(url, {
            method: "POST",
            body: new FormData(form)
        }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}

async function fetchRead() {
    try {
        const url = "http://localhost/listerr/src/api/?route=user_profil";
        const token = localStorage.getItem("token");
        return await fetch(url, {
            method: "GET",
            headers: {"Authorization": token},
            }).then(response => {
                response.json()});

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

async function fetchLogout() {
    try {
        const url = "http://localhost/listerr/src/api/?route=user_logout";
        const token = localStorage.getItem("token");
        return await fetch(url, {
            method: "GET",
            headers: {"Authorization": token},
        }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

async function fetchDelete() {
    try {
        const url = "http://localhost/listerr/src/api/?route=user_delete";
        const token = localStorage.getItem("token");
        return await fetch(url, {
            method: "GET",
            headers: {"Authorization": token},
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

async function fetchUpdate(form) {
    try {
        const url = "http://localhost/listerr/src/api/?route=user_update";
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        return await fetch(url, {
            method: "POST",
            body: new FormData(form),
            headers: {"Authorization": token, user},
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

export {
    fetchRegister,
    fetchLogin,
    fetchRead,
    fetchLogout,
    fetchDelete,
    fetchUpdate,
};