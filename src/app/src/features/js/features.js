'use strict';

import { displayFormFeature } from '../../services/form_feature.js';

import { displayFormMail } from '../../services/form_mail.js';

import { fetchReadAll } from '../../actions/actions_admin.js'

import {
    fetchCreateFeature,
    fetchReadAllFeatures,
    fetchUpdateFeature,
    fetchUpdateStatusFeature,
    fetchDeleteFeature
} from '../../actions/actions_features.js';

import { fetchSendMailFeature } from '../../actions/actions_mails.js'

import { CSRFToken } from '../../services/CSRFToken.js';

import {
    configPath,
    createOptionMails,
    createOptionLoginMail,
    redirect,
    dialog,
    scroll,
} from '../../services/utils.js';

function features() {
    const featureDiv = document.querySelector('#feature');
    const role = JSON.parse(localStorage.user).role;
    const id = JSON.parse(localStorage.user).id;

    const popIn = document.createElement('div');
    popIn.id = 'popIn';
    popIn.classList.add('popIn');

    const createFeatureBtn = document.createElement('button');
    createFeatureBtn.type = 'button';
    createFeatureBtn.classList.add('btn');
    createFeatureBtn.classList.add('way');

    const mailFeatureBtn = document.createElement('button');
    mailFeatureBtn.type = 'button';
    mailFeatureBtn.classList.add('btn');
    mailFeatureBtn.classList.add('way');

    featureDiv.appendChild(createFeatureBtn);

    // Personnalisation du bouton de création de mails si Admin ou User
    if (role === 'Admin') {
        createFeatureBtn.id = 'newFeature';
        createFeatureBtn.value = 'newFeature';
        createFeatureBtn.innerText = 'Apporter une nouvelle mise à jour';

        mailFeatureBtn.id = 'mailFeature';
        mailFeatureBtn.value = 'mailFeature';
        mailFeatureBtn.innerText = 'Informer de la MAJ';

        featureDiv.appendChild(mailFeatureBtn);
    }

    if (role === 'User') {
        createFeatureBtn.id = 'newSuggestion';
        createFeatureBtn.value = 'newSuggestion';
        createFeatureBtn.innerText = 'Proposer une nouvelle évolution';
    }

    // Permet la création de features
    createFeatureBtn.addEventListener('click', function(e) {
        e.preventDefault();
        featureDiv.appendChild(popIn);
        popIn.style.visibility = 'visible';

        const createFeatureDiv = document.createElement('div');
        createFeatureDiv.id = 'createFeatureDiv';

        popIn.appendChild(createFeatureDiv);

        displayFormFeature(createFeatureDiv);
        const sectionForm = document.querySelector('#featureFormSection');

        createFeatureBtn.disabled = true;
        createFeatureBtn.classList.remove('way');
        createFeatureBtn.classList.add('disable');

        cancelForm.addEventListener('click', function(e){
            e.preventDefault();
            sectionForm.remove();
            createFeatureDiv.remove();
            createFeatureBtn.disabled = false;
            createFeatureBtn.classList.remove('disable');
            createFeatureBtn.classList.add('way');
            popIn.style.visibility = 'hidden';
        })

        if (role === 'Admin') {
            titleFormFeature.innerText = `Formulaire de mise à jour d'évolution / correction`;
            titleFeatureLabel.innerText = 'Votre évolution / correctif';
            titleFeature.placeholder = 'Votre évolution / correctif';
            const optionSuggest = formFeature[1][2];
            const optionBug = formFeature[1][3];
            optionSuggest.remove();
            optionBug.remove();
        }

        if (role === 'User') {
            titleFormFeature.innerText = `Formulaire de suggestion / d'alerte de bug pour l'admin`;
            const optionFeature = formFeature[1][0];
            const optionFix = formFeature[1][1];
            optionFeature.remove();
            optionFix.remove();
            titleFeatureLabel.innerText = 'Titre de la suggestion / du bug (affichage ou blocage)';
            titleFeature.placeholder = 'Titre de la suggestion / du bug (affichage ou blocage)';
            statusFeature.classList.add('hidden');
            statusFeatureSelect.classList.add('hidden');
        }

        CSRFToken(formFeature.id);
        formFeature.addEventListener('submit', function(e) {
            e.preventDefault();
            // Validation de pattern du formulaire
            const inputTitle = document.querySelector('#titleFeature');
            const inputDescription = document.querySelector('#descriptionFeature');
            inputTitle.addEventListener('invalid', function(e) {
                validate(e.target)
            });
            inputDescription.addEventListener('invalid', function(e) {
                validate(e.target)
            });

            // Remonte en haut de page après action
            scroll();
            fetchCreateFeature(formFeature)
            .then(response => {
                localStorage.removeItem('csrfToken');
                if (response.status === 'mailFeature') {
                    if (role === 'Admin') {
                        dialog({title: 'Création de la future évolution', content: 'Une de plus à faire'});
                    } else {
                        dialog({title: 'Proposition de suggestion / alerte de bug', content: 'Merci de votre idée / alerte !'});
                    }
                    const dialogMsg = document.querySelector('dialog');
                    dialogMsg.classList.add('valid');
                    redirect(`${configPath.basePath}/features/pages/features.html`, 3000);
                }
                if (response.status === 'errors') {
                    dialog({title: 'Erreurs', content: response.errors});
                    const dialogMsg = document.querySelector('dialog');
                    dialogMsg.classList.add('errors');
                    redirect(`${configPath.basePath}/features/pages/features.html`);
                };
            })
        })
    })

    // Permet d'envoyer des mails aux utilisateurs pour alerter des MAJ soldées / produites, etc...
    mailFeatureBtn.addEventListener('click', function(e) {
        e.preventDefault();
        featureDiv.appendChild(popIn);
        popIn.style.visibility = 'visible';

        const createMailFeatureDiv = document.createElement('div');
        createMailFeatureDiv.id = 'createMailFeatureDiv';

        popIn.appendChild(createMailFeatureDiv);

        displayFormMail(createMailFeatureDiv);
        const titleMail = document.querySelector('#titleMail');
        titleMail.innerText = `Paramètres du mail d'information de MAJ`;

        const inputObjectMail = document.querySelector('#inputObjectMail');
        inputObjectMail.value = 'Listerr MAJ - ';

        const textAreaMail = document.querySelector('#descriptionMail');
        textAreaMail.placeholder = 'Description courte de la MAJ';

        fetchReadAll()
        .then((response) => {
            const dataUsers = response.usersList
            const selectRecipients = document.querySelector('#recipients');
            const recipientsListDiv = document.querySelector('#recipientsListDiv');
            const recipientsList = document.querySelector('#recipientsList');
            const recipientsLists = document.querySelector('#recipientsLists');

            const trashMailBtn = document.createElement('button');
            trashMailBtn.id = 'trashMailBtn';
            trashMailBtn.type = 'button';
            trashMailBtn.innerText = '';
            trashMailBtn.classList.add('btn');
            trashMailBtn.classList.add('delete');

            let option = '';
            const arrayRecipient = [];
            const arrayRecipients = [];

            // Filtrer les utilisateurs pour exclure l'admin
            const usersWithoutAdmin = dataUsers.filter(user => user.role !== 'Admin');

            // for (let index = 0; index < dataUsers.length; index++) {
            //     if (dataUsers[index].role === 'Admin') {
            //         const dataSlice = dataUsers.slice(dataUsers[index].id)
            //     }
            // }
            usersWithoutAdmin.forEach(dataUser => {
                const allUsersId = dataUser.id;
                const allUsersLogin = dataUser.login;
                const allUsersEmail = dataUser.email;
                arrayRecipients.push(allUsersEmail);

                option = createOptionLoginMail(allUsersId, allUsersLogin, allUsersEmail)
                selectRecipients.appendChild(option);
            });

            const allMembersOption = createOptionMails();
            selectRecipients.appendChild(allMembersOption);

            // Ajoute les adresses emails pour envoyer un mail
            const validLoginBtn = document.querySelector('#validLoginBtn');
            validLoginBtn.addEventListener('click', function (e) {
                e.preventDefault();
                const optionsValue = recipients.value;
                recipientsListDiv.appendChild(trashMailBtn);

                if (optionsValue === "allMembers") {
                    recipientsList.remove();
                    // Complète la partie "Destinataire(s) retenu(es)"
                    recipientsLists.innerText = "Tous les membres de Listerr";
                    // Complète l'input hidden pour le formulaire
                    inputRecipients.value = JSON.stringify(arrayRecipients);

                } else {
                    recipientsLists.remove();
                    if (!arrayRecipient.includes(optionsValue)) {
                        arrayRecipient.push(optionsValue);
                    }
                    // Complète la partie "Destinataire(s) retenu(es)"
                    recipientsList.innerText = arrayRecipient.join(", ");
                    // Complète l'input hidden pour le formulaire
                    inputRecipients.value =  JSON.stringify(arrayRecipient);
                }
            })

            // Supprime les emails en cas d'erreur d'insertion
            trashMailBtn.addEventListener('click', function(e) {
                e.preventDefault();
                inputRecipients.value = '';
                arrayRecipient.length = 0;
                arrayRecipients.length = 0;
                if (recipientsList) {
                    recipientsListDiv.appendChild(recipientsLists);
                    recipientsList.innerText = '';
                }
                if (recipientsLists) {
                    recipientsListDiv.appendChild(recipientsList);
                    recipientsLists.innerText = '';
                }
                trashMailBtn.remove();
            })

            CSRFToken(mailForm.id);
            mailForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // Validation de pattern du formulaire
                const inputRecipients = document.querySelector('#inputRecipients');
                const inputObjectMail = document.querySelector('#inputObjectMail');
                const textAreaMail = document.querySelector('#descriptionMail');
                inputRecipients.addEventListener('invalid', function(e) {
                    validate(e.target)
                });
                inputObjectMail.addEventListener('invalid', function(e) {
                    validate(e.target)
                });
                textAreaMail.addEventListener('invalid', function(e) {
                    validate(e.target)
                });

                fetchSendMailFeature(mailForm)
                .then(response => {
                    localStorage.removeItem('csrfToken');
                        if (response.status === 'sendMail') {
                            dialog({title: 'Envoi de mail', content: `Le mail d'informations a bien été envoyé`});
                            const dialogMsg = document.querySelector('dialog');
                            dialogMsg.classList.add('valid');
                            redirect(`${configPath.basePath}/features/pages/features.html`, 3000);
                        }

                    if (response.status === 'errors') {
                        dialog({title: 'Erreurs', content: response.errors});
                        const dialogMsg = document.querySelector('dialog');
                        dialogMsg.classList.add('errors');
                        redirect(`${configPath.basePath}/features/pages/features.html`);
                    };
                })
            })

            createFeatureBtn.disabled = true;
            createFeatureBtn.classList.remove('way');
            createFeatureBtn.classList.add('disable');

            mailFeatureBtn.disabled = true;
            mailFeatureBtn.classList.remove('way');
            mailFeatureBtn.classList.add('disable');

            cancelForm.addEventListener('click', function(e){
                e.preventDefault();
                createMailFeatureDiv.remove();
                createFeatureBtn.disabled = false;
                createFeatureBtn.classList.remove('disable');
                createFeatureBtn.classList.add('way');

                mailFeatureBtn.disabled = false;
                mailFeatureBtn.classList.remove('disable');
                mailFeatureBtn.classList.add('way');
                popIn.style.visibility = 'hidden';
            })
        })
    })

    // Affichage des features
    fetchReadAllFeatures()
    .then((response) => {
        const dataFeature = response.allFeatures;
        const featureDiv = document.querySelector('#feature');
        const emptyMessage = document.createElement('p');

        if (response.status === 'standBy') {
            emptyMessage.innerText = `Aucune mise à jour n'a encore été apportée :)`
            featureDiv.firstElementChild.after(emptyMessage);
        }
        if (response.status === 'ReadAllFeatures') {
            const sectionFeature = document.createElement('div');
            sectionFeature.id = 'sectionFeature';

            const table = document.createElement('table');
            table.classList.add('featureList');

            const tHead = document.createElement('thead');
            const trHead = document.createElement('tr');

            const thType = document.createElement('th');
            thType.innerText = 'Type';

            const thstatus = document.createElement('th');
            thstatus.innerText = 'Etat';

            const thAction = document.createElement('th');
            thAction.innerText = 'Action'

            const thTitle = document.createElement('th');
            thTitle.innerText = 'Titre';

            const thDescription = document.createElement('th');
            thDescription.innerText = 'Description';

            const tbody = document.createElement('tbody');

            if (role === 'Admin') {
                featureDiv.appendChild(sectionFeature);
                sectionFeature.appendChild(table);
                table.appendChild(tHead);
                trHead.appendChild(thType);
                trHead.appendChild(thTitle);
                trHead.appendChild(thDescription);
                trHead.appendChild(thstatus);
                trHead.appendChild(thAction);
                tHead.appendChild(trHead);
                table.appendChild(tbody);
            } else {
                featureDiv.appendChild(sectionFeature);
                sectionFeature.appendChild(table);
                table.appendChild(tHead);
                trHead.appendChild(thType);
                trHead.appendChild(thTitle);
                trHead.appendChild(thDescription);
                trHead.appendChild(thAction);
                trHead.appendChild(thstatus);
                tHead.appendChild(trHead);
                table.appendChild(tbody);
            }

            // Création du tableau de features
            for (const index in dataFeature) {
                const objectFeature = dataFeature[index];
                const trBody = document.createElement('tr');
                const tdType = document.createElement('td');
                if (objectFeature.user.login === 'admin') {
                    tdType.innerText = objectFeature.type;
                } else {
                    tdType.innerText = `${objectFeature.type} par ${objectFeature.user.login}`;
                }

                const tdTitle = document.createElement('td');
                tdTitle.innerText = objectFeature.title;

                const tdDescription = document.createElement('td');
                tdDescription.innerText = objectFeature.description;

                const tdStatus = document.createElement('td');
                const divStatus = document.createElement('div');
                divStatus.classList.add('divCercle');
                const pStatus = document.createElement('p');
                pStatus.innerText = objectFeature.status

                if (objectFeature.status === `Non consulté par l'Admin`) {
                    divStatus.classList.add('switchOff');
                }
                if (objectFeature.status === `Soldé par l'Admin`) {
                    divStatus.classList.add('closed');
                }
                if (objectFeature.status === 'En cours de dév.') {
                    divStatus.classList.add('wip');
                }
                if (objectFeature.status === 'Produit') {
                    divStatus.classList.add('done');
                }
                if (objectFeature.status === 'En attente') {
                    divStatus.classList.add('wait');
                }

                const tdAction = document.createElement('td');

                const editBtn = document.createElement('button');
                editBtn.id = `editFeature-${objectFeature.id}`;
                editBtn.type = 'button';
                editBtn.title = 'Modifier la mise à jour';
                editBtn.textContent = '';
                editBtn.value = objectFeature.id;
                editBtn.classList.add('btn');
                editBtn.classList.add('valid');
                editBtn.classList.add('edit');
                editBtn.classList.add('feature');

                const deleteBtn = document.createElement('button');
                deleteBtn.id = `deleteFeature-${objectFeature.id}`;
                deleteBtn.type = 'button';
                deleteBtn.title = 'Supprimer la mise à jour';
                deleteBtn.textContent = '';
                deleteBtn.value = objectFeature.id;
                deleteBtn.classList.add('btn');
                deleteBtn.classList.add('delete');
                deleteBtn.classList.add('feature');

                // Gestion de l'update de la feature
                editBtn.addEventListener('click', function(e) {
                    e.preventDefault();

                    featureDiv.appendChild(popIn);
                    if (parseInt(e.target.value) !== objectFeature.id) {
                        return;
                    }

                    const updateFeatureDiv = document.createElement('div');
                    updateFeatureDiv.id = 'updateFeatureDiv';
                    popIn.appendChild(updateFeatureDiv);

                    displayFormFeature(updateFeatureDiv);

                    popIn.style.visibility = 'visible';
                    const titleFormFeature = document.querySelector('#titleFormFeature');
                    titleFormFeature.innerText = `Formulaire d'édition de la mise à jour`;
                    const titleFeatureLabel = document.querySelector('#titleFeatureLabel')
                    const titleFeature = document.querySelector('#titleFeature')

                    if (role === 'Admin') {
                        titleFeatureLabel.innerText = 'Votre évolution / correctif';
                        titleFeature.placeholder = 'Votre évolution / correctif';
                    }

                    if (role === 'User') {
                        const optionFeature = formFeature[1][0];
                        const optionFix = formFeature[1][1];
                        optionFeature.remove();
                        optionFix.remove();
                        titleFeatureLabel.innerText = 'Votre suggestion / bug (affichage ou blocage)';
                        titleFeature.placeholder = 'Votre suggestion / bug (affichage ou blocage)';
                        statusFeature.classList.add('hidden');
                        statusFeatureSelect.classList.add('hidden');
                    }

                    const updateFormFeature = document.querySelector('#formFeature');

                    // Affichage de la liste de features + suppression du formulaire d'édition
                    cancelForm.addEventListener('click', function() {
                        updateFeatureDiv.remove();
                        popIn.style.visibility = 'hidden';
                    })

                    if (objectFeature.type === 'Evolution') {
                        const selectType = document.querySelector('#typeFeature');
                        selectType.value = 0;
                        const optionFeature = document.querySelector('#optEvolution');
                        optionFeature.setAttribute('value', 'Evolution');
                        optionFeature.selected = true

                    } else if (objectFeature.type === 'Correctif') {
                        const selectType = document.querySelector('#typeFeature');
                        selectType.value = 0;
                        const optionFix = document.querySelector('#optCorrectif');
                        optionFix.setAttribute('value', 'Correctif');
                        optionFix.selected = true

                    } else {
                        const selectType = document.querySelector('#typeFeature');
                        selectType.value = 0;
                        const optionSuggest = document.querySelector('#optSuggestion');
                        optionSuggest.setAttribute('value', 'Suggestion');
                        optionSuggest.selected = true
                    }

                    const inputId = document.querySelector('#idFeature');
                    inputId.value = objectFeature.id;
                    const inputTitle = document.querySelector('#titleFeature');
                    inputTitle.value = objectFeature.title;
                    const inputDescription = document.querySelector('#descriptionFeature');
                    inputDescription.value = objectFeature.description;
                    const inputStatus = document.querySelector('#statusFeatureSelect');
                    inputStatus.value = objectFeature.status;
                    const selectType = document.querySelector('#typeFeature');

                    updateFormFeature.id = 'formUpdateFeature';
                    CSRFToken(updateFormFeature.id);

                    updateFormFeature.addEventListener('submit', function(e) {
                        e.preventDefault();
                        inputTitle.addEventListener('invalid', function(e) {
                            validate(e.target)
                        })
                        inputDescription.addEventListener('invalid', function(e) {
                            validate(e.target)
                        })
                        inputStatus.addEventListener('invalid', function(e) {
                            validate(e.target)
                        })
                        selectType.addEventListener('invalid', function(e) {
                            validate(e.target)
                        })

                        scroll();
                        fetchUpdateFeature(updateFormFeature, objectFeature.id)
                        .then(response => {
                            localStorage.removeItem('csrfToken');
                            if (response.status === 'updateFeature') {
                                if (role === 'Admin') {
                                    dialog({title: `Modification de la mise à jour par l'Admin`, content: `La feature ${objectFeature.type} ${objectFeature.title} a bien été mise à jour.`});
                                } else {
                                    dialog({title: `Modification de la mise à jour`, content: `La feature ${objectFeature.type} ${objectFeature.title} a bien été mise à jour.`});
                                }
                                const dialogMsg = document.querySelector('dialog');
                                dialogMsg.classList.add('valid');
                                redirect(`${configPath.basePath}/features/pages/features.html`);
                            };

                            if (response.status === 'errors') {
                                dialog({title: 'Erreurs', content: response.errors});
                                const dialogMsg = document.querySelector('dialog');
                                dialogMsg.classList.add('errors');
                                redirect(`${configPath.basePath}/features/pages/features.html`);
                            };
                        })
                    })
                })

                 // Gestion de la suppression de la feature
                deleteBtn.addEventListener('click', function (e) {
                    e.preventDefault();

                    if (parseInt(e.target.value) !== objectFeature.id) {
                        console.warn("pas touche");
                        return;
                    } else if (confirm('Voulez-vous vraiment vous supprimer la feature ?') === true) {
                        scroll();
                        fetchDeleteFeature(objectFeature.id)
                        .then((response) => {
                            if (response.status === "deleteFeature") {
                                dialog(
                                    {
                                        title: "Suppression de la feature",
                                        content: `La feature ${objectFeature.type} ${objectFeature.title} a bien été supprimé.`
                                    }
                                );
                                const dialogMsg = document.querySelector("dialog");
                                dialogMsg.classList.add("valid");
                                redirect(`${configPath.basePath}/features/pages/features.html`);
                            }

                            if (response.status === 'errors') {
                                dialog({title: 'Erreurs', content: response.errors});
                                const dialogMsg = document.querySelector('dialog');
                                dialogMsg.classList.add('errors');
                                redirect(`${configPath.basePath}/features/pages/features.html`);
                            };
                        })
                    }
                })

                // Gestion de l'update de la feature uniquement pour l'Admin
                if (role === 'Admin') {
                    tdAction.appendChild(editBtn);
                    tdAction.appendChild(deleteBtn);
                    // Gestion du statut de la mise à jour
                    divStatus.addEventListener('click', e => {
                        e.preventDefault();

                        if (objectFeature.status === `Non consulté par l'Admin`) {
                            objectFeature.status = 'En attente'
                            pStatus.innerText = objectFeature.status
                            divStatus.classList.remove('switchOff');
                            divStatus.classList.add('wait');

                            fetchUpdateStatusFeature(objectFeature.id, objectFeature.status)
                            .then(response => {
                                if (response.status === '[Admin]updateStatusFeature') {
                                    dialog(
                                        {
                                            title: `Modification du statut`,
                                            content: `La feature ${objectFeature.type} - ${objectFeature.title} est ${objectFeature.type} de traitement.`
                                        }
                                    );
                                    const dialogMsg = document.querySelector('dialog');
                                    dialogMsg.classList.add('valid');
                                    redirect(`${configPath.basePath}/features/pages/features.html`);
                                };

                                if (response.status === 'errors') {
                                    dialog({title: 'Erreurs', content: response.errors});
                                    const dialogMsg = document.querySelector('dialog');
                                    dialogMsg.classList.add('errors');
                                    redirect(`${configPath.basePath}/features/pages/features.html`);
                                };
                            });

                        } else if (objectFeature.status === 'En cours de dév.') {
                            objectFeature.status = 'Produit'
                            pStatus.innerText = objectFeature.status
                            divStatus.classList.remove('wip');
                            divStatus.classList.add('done');

                            fetchUpdateStatusFeature(objectFeature.id, objectFeature.status)
                            .then(response => {
                                if (response.status === '[Admin]updateStatusFeature') {
                                    dialog(
                                        {
                                            title: `Modification du statut`,
                                            content: `La feature ${objectFeature.type} - ${objectFeature.title} est ${objectFeature.status}e.`
                                        }
                                    );
                                    const dialogMsg = document.querySelector('dialog');
                                    dialogMsg.classList.add('valid');
                                    redirect(`${configPath.basePath}/features/pages/features.html`);
                                };

                                if (response.status === 'errors') {
                                    dialog({title: 'Erreurs', content: response.errors});
                                    const dialogMsg = document.querySelector('dialog');
                                    dialogMsg.classList.add('errors');
                                    redirect(`${configPath.basePath}/features/pages/features.html`);
                                };
                            });

                        } else if (objectFeature.status === 'Produit') {
                            objectFeature.status = 'En attente'
                            pStatus.innerText = objectFeature.status
                            divStatus.classList.remove('done');
                            divStatus.classList.add('wait');

                            fetchUpdateStatusFeature(objectFeature.id, objectFeature.status)
                            .then(response => {
                                if (response.status === '[Admin]updateStatusFeature') {
                                    dialog(
                                        {
                                            title: `Modification du statut`,
                                            content: `La feature ${objectFeature.type} - ${objectFeature.title} est ${objectFeature.status}.`
                                        }
                                    );
                                    const dialogMsg = document.querySelector('dialog');
                                    dialogMsg.classList.add('valid');
                                    redirect(`${configPath.basePath}/features/pages/features.html`);
                                };

                                if (response.status === 'errors') {
                                    dialog({title: 'Erreurs', content: response.errors});
                                    const dialogMsg = document.querySelector('dialog');
                                    dialogMsg.classList.add('errors');
                                    redirect(`${configPath.basePath}/features/pages/features.html`);
                                };
                            });

                        } else if (objectFeature.status === 'En attente') {
                            objectFeature.status = `Soldé par l'Admin`
                            pStatus.innerText = objectFeature.status
                            divStatus.classList.remove('wait');
                            divStatus.classList.add('closed');

                            fetchUpdateStatusFeature(objectFeature.id, objectFeature.status)
                            .then(response => {
                                if (response.status === '[Admin]updateStatusFeature') {
                                    dialog(
                                        {
                                            title: `Modification du statut`,
                                            content: `La feature ${objectFeature.type} - ${objectFeature.title} est ${objectFeature.status}.`
                                        }
                                    );
                                    const dialogMsg = document.querySelector('dialog');
                                    dialogMsg.classList.add('valid');
                                    redirect(`${configPath.basePath}/features/pages/features.html`);
                                };

                                if (response.status === 'errors') {
                                    dialog({title: 'Erreurs', content: response.errors});
                                    const dialogMsg = document.querySelector('dialog');
                                    dialogMsg.classList.add('errors');
                                    redirect(`${configPath.basePath}/features/pages/features.html`);
                                };
                            });

                        } else if (objectFeature.status === `Soldé par l'Admin`) {
                            objectFeature.status = 'En cours de dév.'
                            pStatus.innerText = objectFeature.status
                            divStatus.classList.remove('closed');
                            divStatus.classList.add('wip');

                            fetchUpdateStatusFeature(objectFeature.id, objectFeature.status)
                            .then(response => {
                                if (response.status === '[Admin]updateStatusFeature') {
                                    dialog(
                                        {
                                            title: `Modification du statut`,
                                            content: `La feature ${objectFeature.type} - ${objectFeature.title} est ${objectFeature.status}`
                                        }
                                    );
                                    const dialogMsg = document.querySelector('dialog');
                                    dialogMsg.classList.add('valid');
                                    redirect(`${configPath.basePath}/features/pages/features.html`);
                                };

                                if (response.status === 'errors') {
                                    dialog({title: 'Erreurs', content: response.errors});
                                    const dialogMsg = document.querySelector('dialog');
                                    dialogMsg.classList.add('errors');
                                    redirect(`${configPath.basePath}/features/pages/features.html`);
                                };
                            });

                        } else {
                            objectFeature.status = 'En cours de dév.'
                            pStatus.innerText = objectFeature.status
                            divStatus.classList.remove('wait');
                            divStatus.classList.add('wip');

                            fetchUpdateStatusFeature(objectFeature.id, objectFeature.status)
                            .then(response => {
                                if (response.status === '[Admin]updateStatusFeature') {
                                    dialog(
                                        {
                                            title: `Modification du statut`,
                                            content: `La feature ${objectFeature.type} - ${objectFeature.title} est ${objectFeature.status}`
                                        }
                                    );
                                    const dialogMsg = document.querySelector('dialog');
                                    dialogMsg.classList.add('valid');
                                    redirect(`${configPath.basePath}/features/pages/features.html`);
                                };

                                if (response.status === 'errors') {
                                    dialog({title: 'Erreurs', content: response.errors});
                                    const dialogMsg = document.querySelector('dialog');
                                    dialogMsg.classList.add('errors');
                                    redirect(`${configPath.basePath}/features/pages/features.html`);
                                };
                            });
                        }
                    })
                }
                if (id === objectFeature.userId) {
                    tdAction.appendChild(editBtn);
                    tdAction.appendChild(deleteBtn);
                }

                trBody.appendChild(tdType);
                trBody.appendChild(tdTitle);
                trBody.appendChild(tdDescription);
                trBody.appendChild(tdStatus);
                trBody.appendChild(tdAction);
                tdStatus.appendChild(divStatus);
                tdStatus.appendChild(pStatus);
                tbody.appendChild(trBody);
            }
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    features();
});
