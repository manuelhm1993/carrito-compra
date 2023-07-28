// -------------------- Declaracion de variables
const contenedorMain = document.querySelector('main.container');

// -------------------- Template carrito
const carrito = document.querySelector('#carrito');
const templateItemCarrito = document.querySelector('#template-item-carrito').content;
const fragmentCarrito = document.createDocumentFragment();

// -------------------- Template total compra
const totalCompra = document.querySelector('#total-compra');

// -------------------- Si es un único nodo sin ciclos, no se necesita usar fragment, se puede agregar directo al DOM
const templateTotalCompra = document.querySelector('#template-total-compra').content;

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

// -------------------- Reduce el carritoArray y calcula el total de la compra
const devolverTotalCompra = () => {
    // -------------------- Se da el valor inicial 0 para que el acumulador parta de un número y no un objeto
    const valorInicial = 0;

    const totalCompra = carritoArray.reduce((acumulador, valorActual) => {
        // -------------------- Parte de 0 y luego se hace el cálculo con las propiedades del objeto
        return acumulador + (valorActual.cantidad * valorActual.precio);
    }, valorInicial);

    return totalCompra;
};

// -------------------- Recorre el carritoArray y pinta la sección de footer con los totales
const pintarTotalCompra = () => {
    totalCompra.textContent = '';

    const clonTemplateTotalCompra = templateTotalCompra.firstElementChild.cloneNode(true);

    // -------------------- Calcular los totales en js y no en el objeto para seguir un orden lógico
    clonTemplateTotalCompra.querySelector('.card .card-body p.lead span').textContent = devolverTotalCompra();

    // -------------------- Si es un único nodo sin ciclos, no se necesita usar fragment, se puede agregar directo al DOM
    totalCompra.appendChild(clonTemplateTotalCompra);
};

// -------------------- Sobreescribe el array aumentando la cantidad del item seleccionado
const aumentarCantidad = (id) => {
    carritoArray = carritoArray.map((item) => {
        if(item.id === id) item.cantidad++;
        return item;
    });
};

// -------------------- Disminuye la cantidad del item seleccionado y lo saca del array si cantidad es 0
const disminuirCantidad = (id) => {
    carritoArray = carritoArray.filter((item) => {
        if(item.id === id) {
            item.cantidad--;

            if(item.cantidad === 0) return;
        }
        return item;
    });
}

const formatearFooter = () => {
    if(carritoArray.length === 0) totalCompra.textContent = '';
};

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
        leerCarrito();
    }

    // -------------------- Incrementa la cantidad y formatea el DOM
    if(fuenteEvento.matches('#carrito li div .btn.btn-sm.btn-success')) {
        aumentarCantidad(item.id);
        leerCarrito();
    }

    // -------------------- Decrementa la cantidad y formatea el DOM
    if(fuenteEvento.matches('#carrito li div .btn.btn-sm.btn-danger')) {
        disminuirCantidad(item.id);
        leerCarrito();
        formatearFooter();
    }

    if(fuenteEvento.matches('#total-compra .card .card-body .btn.btn-outline-primary')) {
        console.log('Compra finalizada');
    }
});
