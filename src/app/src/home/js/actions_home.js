"use strict";
// permet de voir toutes les listes de tous les utilisateurs sur home.html

async function fetchAllListsByUsers() {
    try {
        const url = "http://localhost/listerr/src/api/?route=read_all_by_users";
        const token = localStorage.getItem("token");
        
        return await fetch(url, {
            method: "GET",
            headers: {"Authorization": token || ""},
            })
            .then(response => response.json())

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

export { fetchAllListsByUsers };
