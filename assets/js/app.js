// -------------------- Declaracion de variables
const contenedorMain = document.querySelector('main.container');
const carrito = document.querySelector('#carrito');
const templateItemCarrito = document.querySelector('#template-item-carrito').content;
const fragment = document.createDocumentFragment();

// -------------------- Crear un objeto global que almacena la compra
const carritoObjeto = {};

// -------------------- Declaracion de funciones
const crearItem = (item) => {
    // -------------------- Crear el nuevo item
    const nuevoItem = {
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
        nuevoItem.cantidad = carritoObjeto[nuevoItem.id].cantidad + 1;
    }
    // -------------------- Agregar el nuevo item al carrito
    carritoObjeto[nuevoItem.id] = nuevoItem;
};

const leerCarrito = () => {
    // -------------------- Formatear el carrito
    carrito.textContent = '';
    
    // -------------------- Obtener un array con los valores del objeto
    Object.values(carritoObjeto).forEach(item => {
        // -------------------- Crear los objetos de la plantilla
        const clonTemplateItemCarrito = templateItemCarrito.firstElementChild.cloneNode(true);

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