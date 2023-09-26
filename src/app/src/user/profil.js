'use strict';

import { fetchRead } from "./actions";

function read() {

    fetchRead()
    .then(response => {const dataUser = response
        console.log(response.status);
        const form = document.querySelector('form');
        const mainSection = document.getElementById('mainSection');
        const section = document.createElement('section');
        section.id = "secondSection";

        const title = document.createElement('h2');
        title.id = "mainTitle";
        title.className = "mainTitle";
        title.innerText = 'Profil utilisateur de ${index}';
        title.style.textAlign = 'center';

        const ul = document.createElement('ul');
        const deleteBtn = document.querySelector('#delete');
        const updateBtn = document.querySelector('#update');
        const p = document.createElement('p');
        p.style.textAlign = 'center';

        if (response.status === 'disconnected') {
            mainSection.appendChild(title);
            title.innerText = `Profil utilisateur`;
            deleteBtn.classList.add('hide');
            updateBtn.classList.add('hide');
        }

        if (response.status === 'connected' && localStorage.token) {
            mainSection.appendChild(title);
            mainSection.append(section);
            deleteBtn.classList.remove('hide');
            updateBtn.classList.remove('hide');

            for(const index in dataUser) {
                const li = document.createElement('li');
                const column = dataUser[index];

                if (index === 'status') {
                    continue;
                }

                if (index === 'Login') {
                    title.innerText = `Profil utilisateur de ${column}`;
                }

                li.innerText = `${index} : ${column}`;
                li.style.margin = '5px auto';
                li.style.listStyleType = 'none';
                ul.style.padding = '5px 0';
                li.style.textAlign = 'center';

                ul.appendChild(li);
            }
            section.append(ul);
            section.append(form);
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    read();
})
