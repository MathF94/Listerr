function createSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    svg.setAttribute("x", "0px");
    svg.setAttribute("y", "0px");
    svg.setAttribute("width", "34px");
    svg.setAttribute("height", "27px");
    svg.setAttribute("viewBox", "0 0 34 27");
    svg.setAttribute("enable-background", "new 0 0 34 27");
    svg.setAttribute("xml:space", "preserve");

    const rect1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect1.setAttribute("fill", "#218838");
    rect1.setAttribute("width", "34");
    rect1.setAttribute("height", "4");
    svg.appendChild(rect1);

    const rect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect2.setAttribute("y", "11");
    rect2.setAttribute("fill", "#218838");
    rect2.setAttribute("width", "34");
    rect2.setAttribute("height", "4");
    svg.appendChild(rect2);

    const rect3 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect3.setAttribute("y", "23");
    rect3.setAttribute("fill", "#218838");
    rect3.setAttribute("width", "34");
    rect3.setAttribute("height", "4");
    svg.appendChild(rect3);

    return svg;
}

export { createSVG };
