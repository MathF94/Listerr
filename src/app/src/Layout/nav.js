function navigation(template) {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    const nav = document.createElement("nav");
    nav.id = "mainNav";
    nav.className = "mainNav";
    const ul = document.createElement("ul");

    if (token === undefined || token === null || user === null || user === undefined) {

        const links = [
            {text: "Accueil", href: "#/home.html", id: "nav_home"},
            {text: "Inscription", href: "#/registration.html", id: "nav_register"},
            {text: "Connexion", href: "#/login.html", id: "nav_login"},
        ];
        addLinks(links);
    };

    if (user !== undefined && user !== null) {

        const links = [
            {text: "Accueil", href: "#/home.html", id: "nav_home"},
            {text: "Déconnexion", id: "nav_logout"},
            {text: "Votre profil", href: "#/profil.html", id: "nav_profil"},
            {text: "Listes de souhaits", href: "#/wish.html", id: "nav_wishlist"},
            {text: "Listes de tâches", href: "#/todo.html", id: "nav_todolist"},
        ];
        addLinks(links);
    };

    if (user !== undefined && user !== null) {
        const dataUser = JSON.parse(user);
        if (dataUser.is_admin){
            const links = [
                {text: "Liste d'utilisateurs", href: "#/profils.html", id: "nav_usersProfil"},
            ];
            addLinks(links);
        };
    };


    function addLinks(links) {
        console.log(token);
        console.log(user);
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

export { navigation };