// -------------------- Declaracion de variables
const contenedorMain = document.querySelector('main.container');
const carrito = document.querySelector('#carrito');
const templateItemCarrito = document.querySelector('#template-item-carrito').content;
const fragment = document.createDocumentFragment();

// -------------------- Crear un array global que almacena la compra
const carritoArray = [];

// -------------------- Declaracion de funciones
const crearItem = (item) => {
    // -------------------- Crear el nuevo item
    const nuevoItem = [item, 1];

    guardarCarrito(nuevoItem);
    leerCarrito();
};

const guardarCarrito = (nuevoItem) => {
    // -------------------- Comprobar si el producto seleccionado existe en el carrito
    const itemSeleccionado = carritoArray.findIndex((item) => item[0] === nuevoItem[0]);

    // -------------------- Si el item no existe en el carrito, se agrega al final en caso contrario incrementa la cantidad
    (itemSeleccionado === -1) ? carritoArray.push(nuevoItem) : carritoArray[itemSeleccionado][1]++;
};

const leerCarrito = () => {
    // -------------------- Formatear el carrito
    carrito.textContent = '';
    
    // -------------------- Iterar el array y pintar los elementos en el DOM usando el template
    carritoArray.forEach(item => {
        // -------------------- Crear los objetos de la plantilla
        const clonTemplateItemCarrito = templateItemCarrito.firstElementChild.cloneNode(true);

        clonTemplateItemCarrito.querySelector('li span.lead').textContent = item[0];
        clonTemplateItemCarrito.querySelector('li span.badge').textContent = item[1];

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