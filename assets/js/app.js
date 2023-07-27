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
        precio: item.precio,
        total: 0
    };

    guardarCarrito(nuevoItem);
    leerCarrito(carritoArray);
};

const devolverIndiceItem = (nuevoItem) => {
    return carritoArray.findIndex((item) => item.id === nuevoItem.id);
};

const guardarCarrito = (nuevoItem) => {
    // -------------------- Comprobar si el producto seleccionado existe en el carrito
    const indiceItem = devolverIndiceItem(nuevoItem);

    // -------------------- Si el item no existe en el carrito, se agrega al final en caso contrario incrementa la cantidad
    if(indiceItem === -1) {
        carritoArray.push(nuevoItem);

        const indiceAgregado = devolverIndiceItem(nuevoItem);
        
        carritoArray[indiceAgregado].total = carritoArray[indiceAgregado].cantidad * nuevoItem.precio;
    }
    else {
        carritoArray[indiceItem].cantidad++;

        // -------------------- Luego de modificar la cantidad, se calcula cantidad * precio para el total
        carritoArray[indiceItem].total = carritoArray[indiceItem].cantidad * nuevoItem.precio;
    }
};

const leerCarrito = (arrayCompra) => {
    pintarCarrito(arrayCompra);
    pintarTotalCompra(arrayCompra);
};

const pintarCarrito = (arrayCompra) => {
    // -------------------- Formatear el carrito
    carrito.textContent = '';
    
    // -------------------- Iterar el array y pintar los elementos en el DOM usando el template
    arrayCompra.forEach(item => {
        // -------------------- Como son varios nodos, no se puede usar ni firstElementChild ni lastElementChild
        const clonTemplateItemCarrito = templateItemCarrito.cloneNode(true);

        clonTemplateItemCarrito.querySelector('li span.lead').textContent = item.descripcion;
        clonTemplateItemCarrito.querySelector('li span.badge').textContent = item.cantidad;
        clonTemplateItemCarrito.querySelector('li div p.lead span').textContent = item.total;

        fragmentCarrito.appendChild(clonTemplateItemCarrito);
    });

    carrito.appendChild(fragmentCarrito);
};

const devolverTotalCompra = (arrayCompra) => {
    let totalCompra = 0;

    arrayCompra.forEach((item) => {
        totalCompra += item.total;
    });

    return totalCompra;
};

const pintarTotalCompra = (arrayCompra) => {
    totalCompra.textContent = '';

    const clonTemplateTotalCompra = templateTotalCompra.firstElementChild.cloneNode(true);

    clonTemplateTotalCompra.querySelector('.card .card-body p.lead span').textContent = devolverTotalCompra(arrayCompra);

    fragmentTotalCompra.appendChild(clonTemplateTotalCompra);
    totalCompra.appendChild(fragmentTotalCompra);
};

// -------------------- Delegacion de eventos se usa el document para delegar el click a todas las secciones
document.addEventListener('click', (e) => {
    const fuenteEvento = e.target;

    const item = {
        descripcion: fuenteEvento.dataset.item,
        precio: parseFloat(fuenteEvento.dataset.precio)
    };

    // Sustituye: fuenteEvento.classList.value === 'btn btn-outline-primary' con un selector más específico
    if(fuenteEvento.matches('main.container .card .card-body .btn.btn-outline-primary')) {
        crearItem(item);
    }

    if(fuenteEvento.matches('#total-compra .card .card-body .btn.btn-outline-primary')) {
        console.log('Compra finalizada')
    }
});
