const contenedorPrincipal = document.querySelector('main.container');
const carrito = document.querySelector('#carrito');
const templateCarrito = document.querySelector('#template-item-carrito').content;
const fragment = document.createDocumentFragment();

const agregarItem = (elemento) => {
    if(elemento.classList.value === 'btn btn-outline-primary') {
        const clonCarrito = templateCarrito.cloneNode(true);

        clonCarrito.querySelector('span.lead').textContent = elemento.dataset.item;
        clonCarrito.querySelector('span.badge').textContent = 1;

        fragment.appendChild(clonCarrito);
        carrito.appendChild(fragment);
    }
};

const incrementarContador = (listaItems, elemento) => {
    let incremento = false;

    for (let item of listaItems) {
        incremento = item.querySelector('span.lead').textContent == elemento.dataset.item;

        if(incremento) {
            item.querySelector('span.badge').textContent = parseInt(item.querySelector('span.badge').textContent, 10) + 1;
            break;
        }
    }

    return incremento;
};

contenedorPrincipal.addEventListener('click', (e) => {
    const elemento = e.target;
    const listaItems = carrito.querySelectorAll('li');

    if((listaItems.length === 0) || (!incrementarContador(listaItems, elemento))) agregarItem(elemento);
});
