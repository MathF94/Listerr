function fetchUser() {
    return fetch('http://localhost/listerr/src/api/?route=user:login')
    .then(response => response);
}
// à revoir l'écriture du fetch

function submitForm() {
    // fait un fetch pour envoyer les infos de connexion
    // récupérer le retour de l'API (fail ou success) voir avec un console.log dans le .then
    // si c'est success, alors on redirige vers display.html

    const userData = fetchUser();
    const wrapper = document.getElementById('wrapper');
    
    for(index in userData) {
        const column = userData[index];
        
        const bloc = document.createElement('div');
        bloc.innerText = `${index} : ${column}`;
        bloc.style.border = '1px solid brown';
        bloc.style.margin = '5px auto';

        wrapper.append(bloc);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById('btn');
    btn.addEventListener('click', function(){
        submitForm();
    })
});