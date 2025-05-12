'use strict';

/**
 * Génère un formulaire de mise à jour pour une évolution.
 *
 * @param {HTMLElement} elementDOM - L'élément HTML dans lequel le formulaire de mise à jour sera généré.
 */
function displayFormFeature(elementDOM) {
    const sectionForm = document.createElement('section');
    sectionForm.id = 'featureFormSection';

    const titleForm = document.createElement('h3');
    titleForm.id = 'titleFormFeature';

    const formFeature = document.createElement('form');
    formFeature.id = 'formFeature';

    const inputId = document.createElement("input");
    inputId.type = "hidden";
    inputId.name = "updateId";
    inputId.id = "idFeature";
    inputId.value = "";
    inputId.required = true;

    const labelType = document.createElement('label');
    labelType.id  = 'typeFeatureLabel';
    labelType.htmlFor  = 'typeFeatureLabel';
    labelType.innerText = 'Type de mise à jour';

    const selectType = document.createElement('select');
    selectType.id = 'typeFeatureSelect';
    selectType.name = 'typeFeatureSelect';
    selectType.value = 0;

    const optionFeature = document.createElement('option');
    optionFeature.value = 'Type de mise à jour';
    optionFeature.id = 'optEvolution';
    optionFeature.setAttribute('value', 'Evolution');
    optionFeature.innerText = 'Evolution'

    const optionFix = document.createElement('option');
    optionFix.value = 'Type de mise à jour';
    optionFix.id = 'optCorrectif';
    optionFix.setAttribute('value', 'Correctif');
    optionFix.innerText = 'Correctif'

    const optionSuggest = document.createElement('option');
    optionSuggest.value = 'Type de mise à jour';
    optionSuggest.id = 'optSuggestion';
    optionSuggest.setAttribute('value', 'Suggestion');
    optionSuggest.innerText = 'Suggestion'

    const optionBug = document.createElement('option');
    optionBug.value = 'Type de mise à jour';
    optionBug.id = 'optBug';
    optionBug.setAttribute('value', 'Bug (affichage ou blocage)');
    optionBug.innerText = 'Bug (affichage ou blocage)'

    const labelTitle = document.createElement('label');
    labelTitle.id  = 'titleFeatureLabel';
    labelTitle.htmlFor  = 'titleFeatureLabel';
    labelTitle.innerText = '';

    const inputTitle = document.createElement('input');
    inputTitle.type = 'text';
    inputTitle.id = 'titleFeature';
    inputTitle.name = 'titleFeature';
    inputTitle.placeholder = '';
    inputTitle.value = '';
    inputTitle.required = true;

    const labelDescription = document.createElement('label');
    labelDescription.htmlFor  = 'descriptionFeature';
    labelDescription.innerText = 'Description';

    const textAreaDescription = document.createElement('textarea');
    textAreaDescription.name = 'descriptionFeature';
    textAreaDescription.id = 'descriptionFeature';
    textAreaDescription.placeholder = `S'il s'agit d'un bug (affichage ou blocage), merci de bien détailler : \n\n- le type de bug (affichage / blocage) ; \n- la page pour le problème d'affichage ; \n- l'action (création, modification, suppression) pour le blocage.`;
    textAreaDescription.value = '';

    const labelStatus = document.createElement('label');
    labelStatus.id = 'statusFeature'
    labelStatus.htmlFor  = 'statusFeature';
    labelStatus.innerText = `Type d'état`;

    const selectStatus = document.createElement('select');
    selectStatus.id = 'statusFeatureSelect';
    selectStatus.name = 'statusFeature';
    selectStatus.value = 0;

    const optionSwitchOff = document.createElement('option');
    optionSwitchOff.value = 'Etat de mise à jour';
    optionSwitchOff.id = 'optSwitchOff';
    optionSwitchOff.setAttribute('value', `Non consulté par l'Admin`);
    optionSwitchOff.innerText = `Non consulté par l'Admin`;

    const optionClosed = document.createElement('option');
    optionClosed.value = 'Etat de mise à jour';
    optionClosed.id = 'optClosed';
    optionClosed.setAttribute('value', `Soldé par l'Admin`);
    optionClosed.innerText = `Soldé par l'Admin`;

    const optionWait = document.createElement('option');
    optionWait.value = 'Etat de mise à jour';
    optionWait.id = 'optWait';
    optionWait.setAttribute('value', 'En attente');
    optionWait.innerText = 'En attente'

    const optionWip = document.createElement('option');
    optionWip.value = 'Etat de mise à jour';
    optionWip.id = 'optWip';
    optionWip.setAttribute('value', 'En cours de dév.');
    optionWip.innerText = 'En cours de dév.'

    const optionDone = document.createElement('option');
    optionDone.value = 'Etat de mise à jour';
    optionDone.id = 'optDone';
    optionDone.setAttribute('value', 'Produit');
    optionDone.innerText = 'Produit'

    const actionBtnFeature = document.createElement('div');
    actionBtnFeature.id = "actionBtnFeature";

    const featureValidFormBtn = document.createElement('button');
    featureValidFormBtn.id = 'validForm';
    featureValidFormBtn.classList.add('btn');
    featureValidFormBtn.classList.add('valid');
    featureValidFormBtn.type = 'submit';
    featureValidFormBtn.value = 'validForm';
    featureValidFormBtn.innerText = 'Valider';

    const featureCancelFormBtn = document.createElement('button');
    featureCancelFormBtn.id = 'cancelForm';
    featureCancelFormBtn.classList.add('btn');
    featureCancelFormBtn.classList.add('cancel');
    featureCancelFormBtn.type = 'button';
    featureCancelFormBtn.value = 'cancelForm';
    featureCancelFormBtn.innerText = 'Annuler';

    sectionForm.appendChild(titleForm);
    sectionForm.appendChild(formFeature);
    formFeature.appendChild(inputId);
    formFeature.appendChild(labelType);
    formFeature.appendChild(selectType);
    selectType.appendChild(optionFeature);
    selectType.appendChild(optionFix);
    selectType.appendChild(optionSuggest);
    selectType.appendChild(optionBug);
    formFeature.appendChild(labelTitle);
    formFeature.appendChild(inputTitle);
    formFeature.appendChild(labelDescription);
    formFeature.appendChild(textAreaDescription);
    formFeature.appendChild(labelStatus);
    formFeature.appendChild(selectStatus);
    selectStatus.appendChild(optionSwitchOff);
    selectStatus.appendChild(optionWait);
    selectStatus.appendChild(optionWip);
    selectStatus.appendChild(optionDone);
    selectStatus.appendChild(optionClosed);
    formFeature.appendChild(actionBtnFeature);
    actionBtnFeature.appendChild(featureValidFormBtn);
    actionBtnFeature.appendChild(featureCancelFormBtn);

    elementDOM.appendChild(sectionForm);
}

export { displayFormFeature };