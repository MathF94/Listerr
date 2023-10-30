"use strict";

import { configPath } from "../services/config.js";

async function fetchReadAll() {
    try {
        const url = `${configPath.apiPath}/?route=admin_read_users`;

        return await fetch(url, {
            method: "GET",
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

export {fetchReadAll};