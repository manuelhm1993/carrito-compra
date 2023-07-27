// -------------------- Declaracion de variables
const contenedorMain = document.querySelector('main.container');

// -------------------- Template carrito
const carrito = document.querySelector('#carrito');
const templateItemCarrito = document.querySelector('#template-item-carrito').content;
const fragmentCarrito = document.createDocumentFragment();

// -------------------- Template total compra
const totalCompra = document.querySelector('#total-compra');
const templateTotalCompra = document.querySelector('#template-total-compra').content;
const fragmentTotalCompra = document.createDocumentFragment();

// -------------------- Crear un array global que almacena la compra
const carritoArray = [];

// -------------------- Declaracion de funciones
const crearItem = (item) => {
    // -------------------- Crear el nuevo item
    const nuevoItem = {
        id: item.descripcion,
        descripcion: item.descripcion,
        cantidad: 1,
        precio: item.precio
    };

    guardarCarrito(nuevoItem);
    leerCarrito(carritoArray);
};

const guardarCarrito = (nuevoItem) => {
    // -------------------- Comprobar si el producto seleccionado existe en el carrito
    const indiceItem = carritoArray.findIndex((item) => item.id === nuevoItem.id);

    // -------------------- Si el item no existe en el carrito, se agrega al final en caso contrario incrementa la cantidad
    (indiceItem === -1) ? carritoArray.push(nuevoItem) : carritoArray[indiceItem].cantidad++;
};

const leerCarrito = (arrayCompra) => {
    // -------------------- Formatear el carrito
    carrito.textContent = '';
    
    // -------------------- Iterar el array y pintar los elementos en el DOM usando el template
    arrayCompra.forEach(item => {
        // -------------------- Como son varios nodos, no se puede usar ni firstElementChild ni lastElementChild
        const clonTemplateItemCarrito = templateItemCarrito.cloneNode(true);

        clonTemplateItemCarrito.querySelector('li span.lead').textContent = item.descripcion;
        clonTemplateItemCarrito.querySelector('li span.badge').textContent = item.cantidad;
        clonTemplateItemCarrito.querySelector('li div p.lead span').textContent = item.precio;

        fragmentCarrito.appendChild(clonTemplateItemCarrito);
    });

    carrito.appendChild(fragmentCarrito);
};

// -------------------- Delegacion de eventos para los botones del contenedor
contenedorMain.addEventListener('click', (e) => {
    const fuenteEvento = e.target;

    const item = {
        descripcion: fuenteEvento.dataset.item,
        precio: fuenteEvento.dataset.precio
    };

    if(fuenteEvento.classList.value === 'btn btn-outline-primary') {
        crearItem(item);
    }
});

totalCompra.addEventListener('click', (e) => {
    if(e.target.classList.value === 'btn btn-outline-primary') {
        console.log('Compra finalizada')
    }
});
