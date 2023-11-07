"use strict";
// permet de voir toutes les listes de tous les utilisateurs sur home.html

async function fetchAllListsByUsers() {
    try {
        const url = "http://localhost/listerr/src/api/?route=read_lists_by_users";
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        return await fetch(url, {
            method: "GET",
            headers: {"Authorization": token, user},
            })
            .then(response => response.json())

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

export { fetchAllListsByUsers };

