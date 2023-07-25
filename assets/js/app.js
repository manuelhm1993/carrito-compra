// -------------------- Declaracion de variables
const contenedorMain = document.querySelector('main.container');
const carrito = document.querySelector('#carrito');
const templateItemCarrito = document.querySelector('#template-item-carrito').content;
const fragment = document.createDocumentFragment();

// -------------------- Crear un objeto global que almacena la compra
const carritoObjeto = {};

// -------------------- Declaracion de funciones
const crearItem = (item) => {
    // -------------------- Traer la compra
    const itemsCompra = carrito.querySelectorAll('li');

    // -------------------- Crear el nuevo item
    nuevoItem = {
        id: item,
        descripcion: item,
        cantidad: 1
    };

    guardarCarrito(nuevoItem);
    leerCarrito();
};

const guardarCarrito = (nuevoItem) => {
    // -------------------- Incrementar la cantidad del item si ya se encuentra agregado
    if(carritoObjeto.hasOwnProperty(nuevoItem.id)) {
        carritoObjeto[nuevoItem.id].cantidad++;
    }
    else {
        // -------------------- Agregar el nuevo item al carrito
        carritoObjeto[nuevoItem.descripcion] = nuevoItem;
    }

    // -------------------- Formatear el carrito
    carrito.textContent = '';
};

const leerCarrito = () => {
    // -------------------- Obtener un array con los valores del objeto
    Object.values(carritoObjeto).forEach(item => {
        // -------------------- Crear los objetos de la plantilla
        const clonTemplateItemCarrito = templateItemCarrito.cloneNode(true);

        clonTemplateItemCarrito.querySelector('li span.lead').textContent = item.descripcion;
        clonTemplateItemCarrito.querySelector('li span.badge').textContent = item.cantidad;

        fragment.appendChild(clonTemplateItemCarrito);
    });

    carrito.appendChild(fragment);
};

// -------------------- Delegacion de eventos para los botones del contenedor
contenedorMain.addEventListener('click', (e) => {
    if(e.target.classList.value === 'btn btn-outline-primary') {
        crearItem(e.target.dataset.item);
    }
});