// --------------- Variables
const carritoCompra = [];
let productosAPI;

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

// --------------- Colocar la primera letra en mayúscula
const capitalize = (palabra) => (palabra.charAt(0).toUpperCase() + palabra.slice(1));

// --------------- Agrega un nuevo item al carrito
const agregarItem = (id) => {
    // --------------- Busca el producto en la BBDD, pero se debe parsear ya que el dataset es un string
    const itemSolicitado = productosAPI.find((producto) => producto.id === parseFloat(id));

    if(itemSolicitado) {
        // --------------- Si el producto está disponible, se busca en el carrito si está agregaado
        const item = carritoCompra.find((item) => item.id === itemSolicitado.id);

        // --------------- Si el producto solicitado no está en el carrito se agrega
        if(!item) {
            itemSolicitado.cantidad = 1;
            itemSolicitado.total = itemSolicitado.price;
            carritoCompra.push(itemSolicitado);
        }
        // --------------- Si el producto solicitado está en el carrito se incrementa la cantidad
        else {
            item.cantidad++;
            item.total = item.cantidad * item.price;
        }
    }

    console.log(carritoCompra);
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
        agregarItem(fuenteEvento.dataset.productoId);
    }
});