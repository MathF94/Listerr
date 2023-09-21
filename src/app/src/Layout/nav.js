function navigation(template) {
    const nav = document.createElement('nav')
    nav.id = "mainNav";
    nav.className = "mainNav";

    const ul = document.createElement('ul');

    const li1 = document.createElement('li');
    const ahref1 = document.createElement('a');
    ahref1.setAttribute('href', 'http://localhost/listerr/src/app/src/user/registration.html');
    ahref1.innerText = 'Inscription';
    li1.appendChild(ahref1);

    const li2 = document.createElement('li');
    const ahref2 = document.createElement('a');
    ahref2.setAttribute('href', 'http://localhost/listerr/src/app/src/user/login.html');
    ahref2.innerText = 'Connexion';
    li2.appendChild(ahref2);

    const li3 = document.createElement('li');
    const ahref3 = document.createElement('a');
    ahref3.setAttribute('href', 'http://localhost/listerr/src/app/src/user/display.html');
    ahref3.innerText = 'Profil utilisateur';
    li3.appendChild(ahref3);

    template.appendChild(nav);

    ul.appendChild(li1);
    ul.appendChild(li2);
    ul.appendChild(li3);

    nav.appendChild(ul);
}

export default navigation;