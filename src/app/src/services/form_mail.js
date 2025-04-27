'use strict';

/**
 * Génère une fenêtre de création/envoi de mail pour envoyer les MAJ aux utilisateurs.
 *
 * @param {HTMLElement} elementDOM - L'élément HTML dans lequel la fenêtre de création/envoi de mail sera généré.
 */

function displayFormMail(elementDOM) {
    const sectionMail = document.createElement('section');
    sectionMail.id = 'MailSection';

    const titleMail = document.createElement('h3');
    titleMail.id = 'titleMail';
    titleMail.innerText = `Paramètres du mail d'informations de MAJ`;

    const mailForm = document.createElement('form');
    mailForm.id = 'mailForm';

    const labelRecipients = document.createElement('label');
    labelRecipients.htmlFor  = 'recipient(s)';
    labelRecipients.innerText = 'Destinataire(s)';

    const selectRecipients = document.createElement('select');
    selectRecipients.id = 'recipients';
    selectRecipients.name = 'recipients';
    selectRecipients.value = 0;

    const optionDiv = document.createElement('div');
    optionDiv.id = 'optionDiv';

    const validLoginBtn = document.createElement('button');
    validLoginBtn.id = 'validLoginBtn';
    validLoginBtn.type = 'button';
    validLoginBtn.innerText = '+';
    validLoginBtn.classList.add('btn');
    validLoginBtn.classList.add('way');

    const recipientsListDiv = document.createElement('div');
    recipientsListDiv.id = 'recipientsListDiv';

    const recipientsSmall = document.createElement('small');
    recipientsSmall.id = 'recipientsSmall';
    recipientsSmall.innerText = 'Destinataire(s) retenu(es) : ';

    const recipientsList = document.createElement('small');
    recipientsList.id = 'recipientsList';

    const recipientsLists = document.createElement('small');
    recipientsLists.id = 'recipientsLists';

    const inputRecipients = document.createElement('input');
    inputRecipients.type = 'hidden';
    inputRecipients.name = 'recipients';
    inputRecipients.id = 'inputRecipients';
    inputRecipients.value = recipientsList.textContent;
    inputRecipients.required = true;

        const labelObject = document.createElement('label');
    labelObject.htmlFor  = 'objectMail';
    labelObject.innerHTML = 'Objet du mail';

    const inputObjectMail = document.createElement('input');
    inputObjectMail.type = 'text';
    inputObjectMail.name = 'objectMail';
    inputObjectMail.id = 'inputObjectMail';
    inputObjectMail.value = '';
    inputObjectMail.required = true;

    const labelMailBody = document.createElement('label');
    labelMailBody.htmlFor  = 'descriptionMail';
    labelMailBody.innerText = 'Corps du mail';

    const textAreaMail = document.createElement('textarea');
    textAreaMail.name = 'descriptionMail';
    textAreaMail.id = 'descriptionMail';
    textAreaMail.placeholder = '';
    textAreaMail.required = true;

    const actionBtnMail = document.createElement('div');
    actionBtnMail.id = 'actionBtnMail';

    const mailValidFormBtn = document.createElement('button');
    mailValidFormBtn.id = 'validForm';
    mailValidFormBtn.classList.add('btn');
    mailValidFormBtn.classList.add('valid');
    mailValidFormBtn.type = 'submit';
    mailValidFormBtn.value = 'validForm';
    mailValidFormBtn.innerText = 'Envoyer';

    const mailCancelFormBtn = document.createElement('button');
    mailCancelFormBtn.id = 'cancelForm';
    mailCancelFormBtn.classList.add('btn');
    mailCancelFormBtn.classList.add('cancel');
    mailCancelFormBtn.type = 'button';
    mailCancelFormBtn.value = 'cancelForm';
    mailCancelFormBtn.innerText = 'Annuler';

    sectionMail.appendChild(titleMail);
    sectionMail.appendChild(mailForm);
    mailForm.appendChild(labelRecipients);
    mailForm.appendChild(optionDiv);
    optionDiv.appendChild(selectRecipients);
    optionDiv.appendChild(validLoginBtn);

    mailForm.appendChild(recipientsListDiv);
    recipientsListDiv.appendChild(recipientsSmall);
    recipientsListDiv.appendChild(recipientsList);
    recipientsListDiv.appendChild(recipientsLists);
    recipientsListDiv.appendChild(inputRecipients);
    // recipientsListDiv.appendChild(trashMailBtn);

    mailForm.appendChild(labelObject);
    mailForm.appendChild(inputObjectMail);
    mailForm.appendChild(labelMailBody);
    mailForm.appendChild(textAreaMail);

    mailForm.appendChild(actionBtnMail);
    actionBtnMail.appendChild(mailValidFormBtn);
    actionBtnMail.appendChild(mailCancelFormBtn);

    elementDOM.appendChild(sectionMail);
}

export { displayFormMail };