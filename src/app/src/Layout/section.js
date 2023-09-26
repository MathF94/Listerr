function section() {

    const section = document.createElement('section');
    section.id = "mainSection";
    section.class = "mainSection";

    document.body.appendChild(section);
}

document.addEventListener("DOMContentLoaded", () => {
    section();
})
