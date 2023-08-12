const base_url = 'https://ecommercebackend.fundamentos-29.repl.co';

async function getApi() {
    try {
        const data = await fetch(base_url);
        const res = await data.json(); // Pasar de Json a JavaScript como objeto
        return res;     
    } catch (error) {
        console.log(error);
    }
}
// getApi();
async function main() {
    const products = await getApi();
    const section = document.querySelector('.products_Academlo'); //Elegir en donde insertar el codigo
    let html = '';
    for (const product of products) {
        console.log(product);
        html += `
        <div class="product">
            <div class="div_img">
                <img class="product_img" src="${product.image}" alt="imagen de producto"/>
            </div>
            <div class="product_name">
                <span>${product.category} - ${product.name}</span>
            </div>
            <div class="product_price">
                <span>$${product.price}.00</span>
            </div>
            <div class="content_btn_cart">
                <button class="btn_cart">Agregar al carrito</button>
            </div>
        </div>
        `        
    }
    section.innerHTML = html;
}
main();
