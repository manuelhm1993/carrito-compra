// --------------- Funciones
// 
// --------------- Obtener los productos del catálogo
const fetchProducts = async (url) => {
    try {
        const res = await fetch(url);
        const data = await res.json();

        console.table(data);

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

        const botonAgregar = clonCatalogoTemplate.querySelector('.card .card-body .btn');

        botonAgregar.dataset.producto = producto.id;
        botonAgregar.dataset.precio = producto.price;

        clonCatalogoTemplate.querySelector('.card .card-img-top').src = producto.image;
        clonCatalogoTemplate.querySelector('.card .card-body .card-title').textContent = capitalize(producto.name);
        clonCatalogoTemplate.querySelector('.card .card-body .card-text span').textContent = producto.price;

        fragmentCatalogo.appendChild(clonCatalogoTemplate);
    });

    catalogo.appendChild(fragmentCatalogo);
};

// --------------- Colocar la primera letra en mayúscula
const capitalize = (palabra) => (palabra.charAt(0).toUpperCase() + palabra.slice(1));

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
    if(fuenteEvento.hasAttribute('data-producto')) {
        console.log(fuenteEvento.dataset.producto);
        console.log(fuenteEvento.dataset.precio);
    }
});