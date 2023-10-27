"use strict";

async function fetchCreateList(form) {
    try {
        const url = "http://localhost/listerr/src/api/?route=create_list";

        return await fetch(url, {
            headers: {
                "Authorization": localStorage.getItem("token"),
                "X-CSRFToken": localStorage.getItem("csrfToken")
            },
            method: "POST",
            body: new FormData(form),
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

async function fetchReadOneListById(id) {
    try {
        const url = "http://localhost/listerr/src/api/?route=read_one_list_by_id";

        return await fetch(`${url}&id=${id}`, {
            headers: {"Authorization": localStorage.getItem("token") || ""},
            method: "GET",
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

async function fetchReadAllLists() {
    try {
        const url = "http://localhost/listerr/src/api/?route=read_lists_one_user";

        return await fetch(url, {
            headers: {"Authorization": localStorage.getItem("token")},
            method: "GET",
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

async function fetchUpdateList(form, id) {
    try {
        const url = "http://localhost/listerr/src/api/?route=update_list";

        return await fetch(url, {
            headers: {
                "Authorization": localStorage.getItem("token"), id,
                "X-CSRFToken": localStorage.getItem("csrfToken")
            },
            method: "POST",
            body: new FormData(form),
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

        return await fetch(url, {
            headers: {"Authorization": token, id},
            method: "POST",
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
