function navigation(template) {
    const nav = document.createElement('nav')
    nav.id = "mainNav";
    nav.className = "mainNav";

    const ahref1 = document.createElement('a')
    ahref1.setAttribute('href', 'http://localhost/listerr/src/app/src/user/registration.html');
    ahref1.innerText = 'Inscription';
    const ahref2 = document.createElement('a')
    ahref2.setAttribute('href', 'http://localhost/listerr/src/app/src/user/login.html');
    ahref2.innerText = 'Connexion';
    const ahref3 = document.createElement('a')
    ahref3.setAttribute('href', 'http://localhost/listerr/src/app/src/list/todo.html');
    ahref3.innerText = 'Liste de tâches';
    const ahref4 = document.createElement('a')
    ahref4.setAttribute('href', 'http://localhost/listerr/src/app/src/list/wish.html');
    ahref4.innerText = 'Liste de souhaits';

    template.appendChild(nav)

    nav.appendChild(ahref1);
    nav.appendChild(ahref2);
    nav.appendChild(ahref3);
    nav.appendChild(ahref4);
}

export default navigation;