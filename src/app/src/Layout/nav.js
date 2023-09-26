function navigation(template) {
    const nav = document.createElement('nav')
    nav.id = "mainNav";
    nav.className = "mainNav";

    const links = [
        {text: 'Inscription', href: 'http://localhost/listerr/src/app/src/user/registration.html', id: 'register'},
        {text: 'Connexion', href: 'http://localhost/listerr/src/app/src/user/login.html', id: 'login'},
        {text: 'Votre profil', href: 'http://localhost/listerr/src/app/src/user/profil.html', id: 'profil'},
        {text: 'Listes', href: 'http://localhost/listerr/src/app/src/list/list.html', id: 'list'},
        {text: 'Déconnexion', id: 'logout'},
    ]

    const ul = document.createElement('ul');

    links.forEach(linkData => {
        const li = document.createElement('li');
        li.style.listStyleType = 'none';
        li.style.padding = '10px 0';

        const a = document.createElement('a');

        if(linkData.href !== undefined) {
            a.setAttribute('href', linkData.href);
            a.id = linkData.id;
            a.innerText = linkData.text;
        } else {
            const a = document.createElement('div');
            a.id = linkData.id;
            a.innerText = linkData.text;
            li.appendChild(a);
        }
        li.appendChild(a);
        ul.appendChild(li);
    })

    nav.appendChild(ul);
    template.appendChild(nav);
}

export default navigation;