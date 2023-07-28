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
let carritoArray = [];

// -------------------- Declaracion de funciones
const crearItem = (item) => {
    // -------------------- Crear el nuevo item
    const nuevoItem = {
        id: item.id,
        descripcion: item.id,
        cantidad: 1,
        precio: item.precio
    };

    guardarCarrito(nuevoItem);
    leerCarrito();
};

// -------------------- Si el item no existe en el carrito, se agrega al final en caso contrario incrementa la cantidad
const guardarCarrito = (nuevoItem) => {
    const indiceItem = carritoArray.findIndex((item) => item.id === nuevoItem.id);

    (indiceItem === -1) ? carritoArray.push(nuevoItem) : carritoArray[indiceItem].cantidad++;
};

// -------------------- Recorre el carritoArray y pinta los items en el DOM
const leerCarrito = () => {
    pintarCarrito();
    pintarTotalCompra();
};

// -------------------- Recorre el carritoArray y pinta la sección del carrito
const pintarCarrito = () => {
    // -------------------- Formatear el carrito
    carrito.textContent = '';
    
    // -------------------- Iterar el array y pintar los elementos en el DOM usando el template
    carritoArray.forEach(item => {
        // -------------------- Como son varios nodos, no se puede usar ni firstElementChild ni lastElementChild
        const clonTemplateItemCarrito = templateItemCarrito.cloneNode(true);

        clonTemplateItemCarrito.querySelector('li span.lead').textContent = item.descripcion;
        clonTemplateItemCarrito.querySelector('li span.badge').textContent = item.cantidad;

        // -------------------- Calcular los totales en js y no en el objeto para seguir un orden lógico
        clonTemplateItemCarrito.querySelector('li div p.lead span').textContent = item.cantidad * item.precio;

        // -------------------- Botones de control de cantidad se capturan y se les agregan los datasets
        clonTemplateItemCarrito.querySelectorAll('li div .btn.btn-sm').forEach((boton) => {
            boton.dataset.item = item.id;
            boton.setAttribute('data-precio', item.precio);// -------------------- Ambas hacen lo mismo
        });

        fragmentCarrito.appendChild(clonTemplateItemCarrito);
    });

    carrito.appendChild(fragmentCarrito);
};

// -------------------- Recorre el carritoArray y calcula el total de la compra
const devolverTotalCompra = () => {
    let totalCompra = 0;

    carritoArray.forEach((item) => {
        totalCompra += (item.cantidad * item.precio);
    });

    return totalCompra;
};

// -------------------- Recorre el carritoArray y pinta la sección de footer con los totales
const pintarTotalCompra = () => {
    totalCompra.textContent = '';

    const clonTemplateTotalCompra = templateTotalCompra.firstElementChild.cloneNode(true);

    // -------------------- Calcular los totales en js y no en el objeto para seguir un orden lógico
    clonTemplateTotalCompra.querySelector('.card .card-body p.lead span').textContent = devolverTotalCompra();

    fragmentTotalCompra.appendChild(clonTemplateTotalCompra);
    totalCompra.appendChild(fragmentTotalCompra);
};

// -------------------- Comprobar si el producto seleccionado existe en el carrito
const devolverIndiceItem = (id) => carritoArray.findIndex((item) => item.id === id);

// -------------------- Sobreescribe el array aumentando la cantidad del item seleccionado
const aumentarCantidad = (id) => {
    carritoArray = carritoArray.map((item) => {
        if(item.id === id) item.cantidad++;
        return item;
    });
};

// -------------------- Disminuye la cantidad del item seleccionado
const disminuirCantidad = (indiceItem) => carritoArray[indiceItem].cantidad--;

// -------------------- Delegacion de eventos se usa el document para delegar el click a todas las secciones
document.addEventListener('click', (e) => {
    const fuenteEvento = e.target;

    // -------------------- Crea un objeto item con sus datasets
    const item = {
        id: fuenteEvento.dataset.item,
        precio: parseFloat(fuenteEvento.dataset.precio)
    };

    // Sustituye: fuenteEvento.classList.value === 'btn btn-outline-primary' con un selector más específico
    if(fuenteEvento.matches('main.container .card .card-body .btn.btn-outline-primary')) {
        crearItem(item);
    }

    // -------------------- Incrementa la cantidad y formatea el DOM
    if(fuenteEvento.matches('#carrito li div .btn.btn-sm.btn-success')) {
        aumentarCantidad(item.id);
        leerCarrito();
    }

    // -------------------- Decrementa la cantidad y formatea el DOM
    if(fuenteEvento.matches('#carrito li div .btn.btn-sm.btn-danger')) {
        const indiceItem = devolverIndiceItem(item.id);

        disminuirCantidad(indiceItem);

        // -------------------- Si la cantidad es = 0, se elimina el item del array
        if(carritoArray[indiceItem].cantidad === 0) {
            carritoArray.splice(indiceItem, 1);
        }

        leerCarrito();
    }

    if(fuenteEvento.matches('#total-compra .card .card-body .btn.btn-outline-primary')) {
        console.log('Compra finalizada');
    }
});
