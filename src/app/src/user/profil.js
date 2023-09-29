'use strict';

import { fetchRead } from "./actions.js";
import { redirect, dialog } from "../services/utils.js";

function read() {

    fetchRead()
    .then(response => {const dataUser = response
        const mainSection = document.createElement('section');
        mainSection.id = "mainSection";
        mainSection.className = "mainSection";
        document.body.appendChild(mainSection);
        const section = document.createElement('section');
        const form = document.querySelector('form');
        const div = document.querySelector('#profilWrapper');
        section.id = "contentSection";

        const mainTitle = document.createElement('h2');
        mainTitle.id = "mainTitle";
        mainTitle.className = "mainTitle";

        const ul = document.createElement('ul');
        const deleteBtn = document.querySelector('#delete');
        const updateBtn = document.querySelector('#update');
        const p = document.createElement('p');

        if (response.status === 'disconnected') {
            console.log('bye');
            mainSection.appendChild(mainTitle);
            mainTitle.innerText = `Profil utilisateur`;
            deleteBtn.classList.add('hide');
            updateBtn.classList.add('hide');
        }

        if (response.status === 'connected' && localStorage.token) {
            mainSection.appendChild(mainTitle);
            mainSection.appendChild(section);
            mainTitle.innerText = `Profil utilisateur`;
            deleteBtn.classList.remove('hide');
            updateBtn.classList.remove('hide');

            for (const index in dataUser) {
                const li = document.createElement('li');
                const column = dataUser[index];

                if (['status', 'id'].includes(index))  {
                    continue;
                }
                li.innerText = `${column.label} : ${column.value}`;

                ul.appendChild(li);
                section.append(ul);
                section.append(div);
            }

            updateBtn.addEventListener('click', function(e){
                redirect("http://localhost/listerr/src/app/src/user/update.html", 0);

            }); // form.addEventListener('submit', function(e)
        }; // (response.status === 'connected' && localStorage.token)
    });
};

document.addEventListener("DOMContentLoaded", () => {
    read();
});
