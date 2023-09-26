'use strict'

async function fetchRead() {
    try {
        const url = "http://localhost/listerr/src/api/?route=user_profil";
        const token = localStorage.getItem('token');

        return await fetch(url, {
            method: 'get',
            headers: {'Authorization': token},
            }).then(response => response.json());

    } catch (error) {
        console.error('Erreur lors de la requête fetch :', error);
        return null;
    }
};


async function fetchUpdate() {
    try {
        const url = "http://localhost/listerr/src/api/?route=user_update";
        const token = localStorage.getItem('token');

        return await fetch(url, {
            method: 'get',
            headers: {'Authorization': token},
            }).then(response => response.text());

    } catch (error) {
        console.error('Erreur lors de la requête fetch :', error);
        return null;
    }
};

async function fetchLogin(form) {
    try {
        const url = 'http://localhost/listerr/src/api/?route=user_login';
        return await fetch(url, {
            method: 'post',
            body: new FormData(form)
        }).then(response => response.json());

    } catch (error) {
        console.error('Erreur lors de la requête fetch :', error);
        return null;
    }
}


async function fetchRegister(form) {
    try {
        const url = 'http://localhost/listerr/src/api/?route=user_register';
        return await fetch(url, {
            method: 'POST',
            body: new FormData(form)
        }).then(response => response.json());

    } catch (error) {
        console.error('Erreur lors de la requête fetch :', error);
        return null;
    }
}


async function fetchLogout() {
    try {
        const url = "http://localhost/listerr/src/api/?route=user_logout";
        const token = localStorage.getItem('token');
        console.log(token);
        return await fetch(url, {
            method: 'get',
            headers: {'Authorization': token},
        }).then(response => response.json());

    } catch (error) {
        console.error('Erreur lors de la requête fetch :', error);
        return null;
    }
};


async function fetchDelete() {
    try {
        const url = "http://localhost/listerr/src/api/?route=user_delete";
        const token = localStorage.getItem('token');

        return await fetch(url, {
            method: 'get',
            headers: {'Authorization': token},
            }).then(response => response.json());

    } catch (error) {
        console.error('Erreur lors de la requête fetch :', error);
        return null;
    }
};

export {
    fetchDelete, fetchLogout, fetchRead, fetchRegister, fetchUpdate, fetchLogin
}