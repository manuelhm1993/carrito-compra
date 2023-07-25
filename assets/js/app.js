const contenedorMain = document.querySelector('main.container');
const carrito = document.querySelector('#carrito');
const templateItemCarrito = document.querySelector('#template-item-carrito').content;
const fragment = document.createDocumentFragment();

const crearItem = (item) => {
    const itemsCompra = carrito.querySelectorAll('li');

    nuevoItem = {
        id: item,
        descripcion: item,
        cantidad: 1
    };

    carrito.textContent = '';
    let clonTemplateItemCarrito = templateItemCarrito.cloneNode(true);

    clonTemplateItemCarrito.querySelector('li span.lead').textContent = nuevoItem.descripcion;
    clonTemplateItemCarrito.querySelector('li span.badge').textContent = nuevoItem.cantidad;
    fragment.appendChild(clonTemplateItemCarrito);

    carrito.appendChild(fragment);
};

contenedorMain.addEventListener('click', (e) => {
    if(e.target.classList.value === 'btn btn-outline-primary') {
        crearItem(e.target.dataset.item);
    }
});