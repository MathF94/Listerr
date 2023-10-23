"use strict";
// permet de créer, lire, modifier, supprimer les listes d'un utilisateurs sur list.html
async function fetchCreateList(form) {
    try {
        const url = "http://localhost/listerr/src/api/?route=create_list";
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

async function fetchReadOneListById(id) {
    try {
        const url = "http://localhost/listerr/src/api/?route=read_one_list_by_id";
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        // console.log(user);
        return await fetch(`${url}&id=${id}`, {
            method: "GET",
            headers: {"Authorization": token, user},
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

async function fetchReadAllLists() {
    try {
        const url = "http://localhost/listerr/src/api/?route=read_lists_one_user";
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        return await fetch(url, {
            method: "GET",
            headers: {"Authorization": token, user},
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

async function fetchUpdateList(form) {
    try {
        const url = "http://localhost/listerr/src/api/?route=update_list";
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

async function fetchDeleteList(id) {
    try {
        const url = "http://localhost/listerr/src/api/?route=delete_list";
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        return await fetch(url, {
            method: "POST",
            headers: {"Authorization": token, id, user},
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

export {
    fetchCreateList,
    fetchReadOneListById,
    fetchReadAllLists,
    fetchUpdateList,
    fetchDeleteList
};
