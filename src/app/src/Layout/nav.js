function navigation(template) {
    const nav = document.createElement("nav")
    nav.id = "mainNav";
    nav.className = "mainNav";


    const links = [
        {text: "Inscription", href: "http://localhost/listerr/src/app/src/user/pages/registration.html", id: "register"},
        {text: "Connexion", href: "http://localhost/listerr/src/app/src/user/pages/login.html", id: "login"},
        {text: "Votre profil", href: "http://localhost/listerr/src/app/src/user/pages/profil.html", id: "profil"},
        {text: "Listes", href: "http://localhost/listerr/src/app/src/list/pages/list.html", id: "list"},
        {text: "Déconnexion", id: "logout"},
    ];

    const ul = document.createElement("ul");

    links.forEach(linkData => {
        const a = document.createElement("a");
        const li = document.createElement("li");

        if(linkData.href !== undefined) {
            a.setAttribute("href", linkData.href);
            a.id = linkData.id;
            a.innerText = linkData.text;
        } else {
            const a = document.createElement("div");
            a.id = linkData.id;
            a.innerText = linkData.text;
            li.appendChild(a);
        };
        li.appendChild(a);
        ul.appendChild(li);
    });
    nav.appendChild(ul);
    template.appendChild(nav);

    const user = localStorage.getItem('user');
    const dataUser = JSON.parse(user);

    if (dataUser.is_admin){
        
        const navAdmin = document.createElement("nav")
        navAdmin.id = "mainNavAdmin";
        navAdmin.className = "mainNavAdmin";

        const linksAdmin = [
            {text: "Liste d'utilisateurs", href: "http://localhost/listerr/src/app/src/admin/pages/profils.html", id: "user"},
        ];

        linksAdmin.forEach(linkData => {
            const a = document.createElement("a");
            const li = document.createElement("li");

            if(linkData.href !== undefined) {
                a.setAttribute("href", linkData.href);
                a.id = linkData.id;
                a.innerText = linkData.text;
            } else {
                const a = document.createElement("div");
                a.id = linkData.id;
                a.innerText = linkData.text;
                li.appendChild(a);
            };
            li.appendChild(a);
            ul.appendChild(li);
        });
        navAdmin.appendChild(ul);
        template.appendChild(navAdmin);
    }
};
export default navigation;