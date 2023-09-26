class View {
    #wrapperTarget;

    constructor() {
        this.#wrapperTarget = 'main';
    }
    
    setWrapperTarget (value) {
        this.#wrapperTarget = value
    }
    
    load (viewPath) {
        console.log('fonction load()', {viewPath})
        
        const wrapper = document.getElementById(this.#wrapperTarget);
        
        fetch(`${viewPath}.html`,{
            headers: {
                'Content-Type': 'application/text',
            }
        })
        .then(response => response.text())
        .then(html => {
            console.log({html})
            wrapper.innerHTML = html
            console.log(wrapper)
        })
        .catch(e => console.error(e));
    }
}

export default new View();
