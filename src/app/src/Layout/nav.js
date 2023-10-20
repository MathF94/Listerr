function navigation(template) {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const nav = document.createElement("nav");
    nav.id = "mainNav";
    nav.className = "mainNav";
    const ul = document.createElement("ul");

    if (token === undefined || token === null || user === null || user === undefined) {
        const links = [
            {text: "Accueil", href: "http://localhost/listerr/src/app/src/home/pages/home.html", id: "home"},
            {text: "Inscription", href: "http://localhost/listerr/src/app/src/user/pages/registration.html", id: "register"},
            {text: "Connexion", href: "http://localhost/listerr/src/app/src/user/pages/login.html", id: "login"},
        ];
        addLinks(links);
    };

    if (user !== undefined && user !== null) {
        const links = [
            {text: "Accueil", href: "http://localhost/listerr/src/app/src/home/pages/home.html", id: "home"},
            {text: "Déconnexion", id: "logout"},
            {text: "Votre profil", href: "http://localhost/listerr/src/app/src/user/pages/profil.html", id: "profil"},
            {text: "Listes de souhaits et de tâches", href: "http://localhost/listerr/src/app/src/list/pages/lists.html", id: "lists"},
        ];
        addLinks(links);
    };

    if(user){
        const dataUser = JSON.parse(user);
        if (dataUser.role === "Admin"){
            const links = [
                {text: "Liste d'utilisateurs", href: "http://localhost/listerr/src/app/src/admin/pages/profils.html", id: "usersProfil"},
            ];
            addLinks(links);
        };
    };

    function addLinks(links) {

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
    }
};

export default navigation;