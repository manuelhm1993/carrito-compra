// --------------- Variables
let productosAPI;

const carritoCompra = {};

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
        clonCatalogoTemplate.querySelector('.card .card-body .card-text span').textContent = producto.price;

        // --------------- Establece el atributo dataset dinámicamente para garantizar mayor seguridad
        clonCatalogoTemplate.querySelector('.card .card-body .btn').dataset.productoId = producto.id;

        fragmentCatalogo.appendChild(clonCatalogoTemplate);
    });

    catalogo.appendChild(fragmentCatalogo);
};

const renderizarCarritoCompra = (carrito) => {
    const seccionCarrito = document.querySelector('#carrito');
    const seccionCarritoTemplate = document.querySelector('#carrito-template').content;
    const fragmentCarrito = document.createDocumentFragment();

    seccionCarrito.textContent = '';

    Object.values(carrito).forEach((item) => {
        const clonSeccionCarritoTemplate = seccionCarritoTemplate.firstElementChild.cloneNode(true);

        clonSeccionCarritoTemplate.querySelector('th').textContent = item.id;
        clonSeccionCarritoTemplate.querySelector('th span').textContent = (item.cantidad * item.price);

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

// --------------- Colocar la primera letra en mayúscula
const capitalize = (palabra) => (palabra.charAt(0).toUpperCase() + palabra.slice(1));

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

    console.log(carritoCompra);
    renderizarCarritoCompra(carritoCompra);
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

    // --------------- Comrpobar si el elemento el atributo data
    if(fuenteEvento.hasAttribute('data-producto-id')) {
        if(fuenteEvento.hasAttribute('aria-label')) {
            if(fuenteEvento.getAttribute('aria-label') === "Agregar") {
                agregarItem(fuenteEvento.dataset.productoId);
            }
        }
        else {
            agregarItem(fuenteEvento.dataset.productoId);
        }
    }
});