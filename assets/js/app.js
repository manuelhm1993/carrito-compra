// --------------- Funciones
// 
// --------------- Obtener los productos del catálogo
const fetchProducts = async (url) => {
    try {
        const res = await fetch(url);
        const data = await res.json();

        console.log(res);
        console.log(data);
    } catch (error) {
        console.log(error);
    } finally {

    }
};

// --------------- Delegación de eventos
// 
// --------------- Al cargar el documento
document.addEventListener('DOMContentLoaded', (e) => {
    const url = './API/products.json';

    fetchProducts(url);
});