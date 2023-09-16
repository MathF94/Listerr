async function fetchUser() {
    const url = 'http://localhost/listerr/src/api/?route=user:display&login=user_3';
    try {
        const response =  await fetch(url, {method: 'GET', headers: {'Content-Type': 'application/json'}})
        if (await response){
            return response.json();
        } else {
            console.error('Réponse HTTP non OK :', response.status);
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la requête fetch :', error);
        return null;
    }
};

// async function fetchUser(user) {
//     const url = 'http://localhost/listerr/src/api/?route=user:display';
//     const response = await fetch(url, {method: 'GET', headers: {'Accept': 'application/json'}})
//     .then((response => {
//         return response.json();
//     }))
//     .then((data) => {
//         let user = data;
//     });
// };

    // .then(response => {
    //     response.json()
    //     .then(data => {
    //         console.log(data);
    //     })
// à revoir l'écriture du fetch

function display() {
    
    fetchUser()
        .then(user => {
            if (user) {
                const wrapper = document.getElementById('wrapper');

                for(const key in user) {
                    const value = user[key];
                    const bloc = document.createElement('div');
                    bloc.innerText = `${key}: ${value}`;
                    bloc.style.border = '1px solid brown';
    //         bloc.style.margin = '5px auto';
                    wrapper.appendChild(bloc);
                }
            } else {
                // Gérer le cas d'erreur ou l'absence de données utilisateur
                console.error('Erreur lors de la récupération des données utilisateur.');
            }
        });
            // console.log(user))

    // const userData = fetchUser(user)
    // .then((user) => {
    //     const wrapper = document.getElementById('wrapper');
        
    //     for(index in userData) {
            
    //         const column = userData[index];
    //         const bloc = document.createElement('div');
    //         bloc.innerText = `${index} : ${column}`;
    //         bloc.style.border = '1px solid brown';
    //         bloc.style.margin = '5px auto';
            
    //         wrapper.append(bloc);
    //     }
    // });
}

document.addEventListener("DOMContentLoaded", () => {
    display();
    console.log('test');
});