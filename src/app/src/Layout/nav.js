function navigation(template) {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const nav = document.createElement("nav");
    nav.id = "mainNav";
    nav.className = "mainNav";
    const list = document.createElement("ul");

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
            const link = document.createElement("a");
            const item = document.createElement("li");

            if(linkData.href !== undefined) {
                link.setAttribute("href", linkData.href);
                link.id = linkData.id;
                link.innerText = linkData.text;
            } else {
                const a = document.createElement("div");
                a.id = linkData.id;
                a.innerText = linkData.text;
                item.appendChild(a);
            };
            item.appendChild(link);
            list.appendChild(item);
        });
        nav.appendChild(list);
        template.appendChild(nav);
    }
};

export default navigation;