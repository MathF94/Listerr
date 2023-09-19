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


// .then(response=>{
//     localStorage.setItem('token_user', response.token);
//     console.log(response);
// });
// pour recherche le token =
//          * localStorage.getItem('token_user');
//          * 
//          * pour supprimer
//          * localStorage.removeItem('token_user');
//          * 
//          * dans l'idée, quand on fait le login, avec un fetch, on récupère le token (getItem)
//          * et on l'utilise à la place du login actuel
//          * 
//          * pour le logout, avec un fetch on récupère le token et au retour du logout on fait
//          * un removeItem('token_user')
//          */