// --------------- Variables
let productosAPI;
let carritoCompra = {};

// --------------- Sección carrito compra
const seccionCarrito = document.querySelector('#carrito');
const seccionCarritoTemplate = document.querySelector('#carrito-template').content;

// --------------- Footer carrito compra
const footerCarrito = document.querySelector('#footer-carrito');
const footerCarritoTemplate = document.querySelector('#footer-carrito-template').content;
const footerCarritoVacio = document.querySelector('#footer-carrito tr');

// --------------- Funciones
// 
// --------------- Obtener los productos del catálogo
const fetchProducts = async (url) => {
    try {
        const res = await fetch(url);
        const data = await res.json();

        console.table(data);

        productosAPI = data;

        renderizarCatalogo(data);
    } catch (error) {
        console.log(error);
    } finally {

    }
};

// --------------- Renderizar el catálogo de productos en cards
const renderizarCatalogo = (productos) => {
    const catalogo = document.querySelector('#catalogo');
    const catalogoTemplate = document.querySelector('#catalogo-template').content;
    const fragmentCatalogo = document.createDocumentFragment();

    catalogo.textContent = '';

    productos.forEach((producto) => {
        const clonCatalogoTemplate = catalogoTemplate.firstElementChild.cloneNode(true);

        clonCatalogoTemplate.querySelector('.card .card-img-top').src = producto.image;
        clonCatalogoTemplate.querySelector('.card .card-body .card-title').textContent = capitalize(producto.name);
        clonCatalogoTemplate.querySelector('.card .card-body .card-text span').textContent = formatearPrecio(producto.price);

        // --------------- Establece el atributo dataset dinámicamente para garantizar mayor seguridad
        clonCatalogoTemplate.querySelector('.card .card-body .btn').dataset.productoId = producto.id;

        fragmentCatalogo.appendChild(clonCatalogoTemplate);
    });

    catalogo.appendChild(fragmentCatalogo);
};

// --------------- Renderizar la sección del carrito de la compra con los items
const renderizarCarritoCompra = (carrito) => {
    seccionCarrito.textContent = '';

    const fragmentCarrito = document.createDocumentFragment();

    // --------------- Convertir el objeto en array para poder iterarlo con foreach
    Object.values(carrito).forEach((item) => {
        const clonSeccionCarritoTemplate = seccionCarritoTemplate.firstElementChild.cloneNode(true);

        clonSeccionCarritoTemplate.querySelector('th').textContent = item.id;
        clonSeccionCarritoTemplate.querySelector('th span').textContent = formatearPrecio((item.cantidad * item.price));

        // --------------- Obtener los td e iterarlos con foreach capturando el index
        clonSeccionCarritoTemplate.querySelectorAll('td').forEach((col, index) => {
            switch(index) {
                case 0:
                    col.textContent = capitalize(item.name);
                    break;
                case 1:
                    col.textContent = item.cantidad;
                    break;
                case 2:
                    col.querySelector('button[aria-label="Agregar"]').dataset.productoId = item.id;
                    col.querySelector('button[aria-label="Quitar"]').dataset.productoId = item.id;
                    break;
            }
        });
        
        fragmentCarrito.appendChild(clonSeccionCarritoTemplate);
    });

    seccionCarrito.appendChild(fragmentCarrito);
};

// --------------- Renderizar el footer del carrito de la compra con los totales
const renderizarFooterCarritoCompra = (carritoCompra) => {
    footerCarrito.textContent = '';

    const clonFooterCarritoTemplate = footerCarritoTemplate.firstElementChild.cloneNode(true);
    const carritoArray = Object.values(carritoCompra);

    // --------------- Acumula los totales de cada producto para hacer un total total
    const total = carritoArray.reduce((acc, item) =>  (acc + (item.cantidad * item.price)), 0);

    clonFooterCarritoTemplate.querySelector('th span').textContent = formatearPrecio(total);

    // --------------- Acumula las cantidades totales de cada producto para hacer un total de items
    clonFooterCarritoTemplate.querySelector('td').textContent = carritoArray.reduce((acc, item) => {
        return acc + item.cantidad;
    }, 0);

    footerCarrito.appendChild(clonFooterCarritoTemplate);
};

// --------------- Colocar la primera letra en mayúscula
const capitalize = (palabra) => (palabra.charAt(0).toUpperCase() + palabra.slice(1));

// --------------- Formatea el valor recibido a moneda USA
const formatearPrecio = (value, code = 'en-us', money = 'USD') => value.toLocaleString(code, { 
    style: 'currency', 
    currency: money 
});

// --------------- Agrega un nuevo item al carrito o incrementa su cantidad
const agregarItem = (id) => {
    const productoSolicitado = productosAPI.find((producto) => producto.id === parseInt(id, 10));
    
    if(productoSolicitado) {
        if(carritoCompra.hasOwnProperty(productoSolicitado.id)) {
            carritoCompra[productoSolicitado.id].cantidad++;
        }
        else {
            carritoCompra[productoSolicitado.id] = productoSolicitado;
            carritoCompra[productoSolicitado.id].cantidad = 1;
        }
    }

    renderizarCarritoCompra(carritoCompra);
    renderizarFooterCarritoCompra(carritoCompra);
};

const quitarItem = (id) => {
    const item = carritoCompra[id];

    if((Object.values(carritoCompra).length === 1) && (item.cantidad === 1)) {
        vaciarCarritoCompra();
    }
    else {
        if(item.cantidad > 1) {
            item.cantidad--;
            carritoCompra[id] = item;
        }
        else {
            delete carritoCompra[id];
        }
    
        renderizarCarritoCompra(carritoCompra);
        renderizarFooterCarritoCompra(carritoCompra);
    }
};

// --------------- Vaciar el carrito de la compra
const vaciarCarritoCompra = () => {
    // --------------- Mensaje de advertencia para confirmar la acción
    Swal.fire({
        title: '¿Desea vaciar el carrito de compra?',
        text: "La compra quedará en cero.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, vaciar',
        cancelButtonText: 'No, cancelar'
    })
    .then((result) => {
        if (result.isConfirmed) {
            carritoCompra = {};
    
            seccionCarrito.textContent = '';
            footerCarrito.textContent = '';
        
            footerCarrito.appendChild(footerCarritoVacio);
            
            Swal.fire(
                'Carrito vaciado',
                'Su compra fue eliminada.',
                'success'
            );
        }
    });
};

// --------------- Delegación de eventos
// 
// --------------- Al cargar el documento
document.addEventListener('DOMContentLoaded', (e) => {
    // --------------- La ruta relativa se cuenta a partir del index.html
    const url = './API/products.json';

    fetchProducts(url);
});

// --------------- Al hacer click
document.addEventListener('click', (e) => {
    const fuenteEvento = e.target;

    // --------------- Agregar o quitar item del carrito
    if(fuenteEvento.hasAttribute('data-producto-id')) {
        if(fuenteEvento.hasAttribute('aria-label')) {
            if(fuenteEvento.getAttribute('aria-label') === "Agregar") {
                agregarItem(fuenteEvento.dataset.productoId);
            }

            if(fuenteEvento.getAttribute('aria-label') === "Quitar") {
                quitarItem(fuenteEvento.dataset.productoId);
            }
        }
        else {
            agregarItem(fuenteEvento.dataset.productoId);
        }
    }

    // --------------- Vaciar carrito
    if(fuenteEvento.id === 'vaciar-carrito') {
        vaciarCarritoCompra();
    }
});