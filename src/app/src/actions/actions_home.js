"use strict";

import { configPath } from "../services/config.js";

async function fetchAllListsByUsers() {
    try {
        const url = `${configPath.apiPath}/?route=read_all_by_users`;

        return await fetch(url, {
            method: "GET",
            headers: {"Authorization": localStorage.getItem("token") || ""},
            })
            .then(response => response.json())

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

export { fetchAllListsByUsers };
