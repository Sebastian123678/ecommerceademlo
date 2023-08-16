// Hacer la conexion de la API
async function getApi() {
    try {
        const data = await fetch('https://ecommercebackend.fundamentos-29.repl.co');
        const res = await data.json(); // Pasar de Json a JavaScript como objeto
        window.localStorage.setItem('products', JSON.stringify(res));
        return res;     
    } catch (error) {
        // Si el link esta incorrecto sale error
        console.log(error);
    }
}

// Hacer click en el carrito y en el producto (activar o desactivar las clases)
function events () {
    // Traer la clase del modal o ventana flotante del producto
    const modal = document.querySelector('.modal');
    // Traer la clase donde esta la imagen del carrito de compras
    const cart_button = document.querySelector('.shopping_cart');
    const menu_cart = document.querySelector('.menu_cart');
    const header_list = document.querySelector('.header_list');
    const menu_open = document.querySelector('.menu_open');
    const menu_close = document.querySelector('.menu_close');
    menu_open.addEventListener("click", function() {
        header_list.classList.add('active');
        menu_open.classList.add('active');
        menu_close.classList.add('active');
    });
    menu_close.addEventListener("click", function() {
        header_list.classList.remove('active');
        menu_open.classList.remove('active');
        menu_close.classList.remove('active');
    });
    header_list.addEventListener("click", function() {
        header_list.classList.remove('active');
        menu_open.classList.remove('active');
        menu_close.classList.remove('active');
    });
    // Evento del click, que sucede cuando hace click el usuario
    cart_button.addEventListener('click', function () {
        // toggle es activar y remover dependiendo lo que esta sucediendo
        menu_cart.classList.toggle('active');
    });
    modal.addEventListener('click', function () {
        // Remover la clase
        modal.classList.remove('active');
    });
}

// Construir los contenedores de cada producto que se trae de la API
function printProducts (db) {
    // Traer la clase donde se va alojar todos los productos
    const productsHTML = document.querySelector('.products_academlo');
    // Con esta variable html se guarda cada uno de los productos
    let html = '';
    // Recorrer cada uno de los productos
    for (const product of db.products) {
        html += `
        <div class="product">
            <div class="div_img">
                <img id=${product.id} class="product_img" src="${product.image}" alt="image product"/>
            </div>
            <div class="product_name">
                <span>${product.name}</span>
            </div>
            <div class="product_price" class="black&white">
            <span><img class="BYW" src="./IMG/red&black.png" alt="ByW">
                $${product.price}.00</span>
            </div>
            
            <div class="content_btn_cart">
                <button id=${product.id} class="btn_cart">Agregar al carrito</button>
            </div>
        </div>
        `        
    }
    // Insertar todos los productos en la etiqueta que contiene la clase .products_Academlo
    productsHTML.innerHTML = html;
}

// Visualizar cuando se agrega al carrito de compras en la pestaña derecha
function addToCart (db) {
    // Leer todo el contenido donde tenemos la informacion (productos)
    const productsHTML = document.querySelector('.products_academlo');
    productsHTML.addEventListener('click', function(event) {
        // En donde hizo click el usuario por medio de la clase del boton agregar al carrito
        if (event.target.classList.contains('btn_cart')) {
            // Obtener el id donde el usuario hizo click
            const id = Number(event.target.id);
            // Buscar el producto completo con todos sus items
            const productFind = db.products.find(function(product){
                return product.id === id;
            })
            // Validar que el producto seleccionado tenga stock
            if (productFind.quantity === 0) {
                return alert('Este producto no tiene stock');
            }
            // Si el elemento ya existe en el carrito entonces comience hacer la verificacion
            if (db.cart[productFind.id]) {
                // Validar que no se complete el stock o sobrepase
                if (db.cart[productFind.id]) {
                    // La cantidad disponible sea igual a la cantidad que el usuario a seleccionado y no permitira seguir adicionando al carrito
                    if (productFind.quantity === db.cart[productFind.id].amount){
                        return alert('No tenemos mas en bodega');
                    }
                }
                // Aumenta la base de datos del carrito uno en uno
                db.cart[productFind.id].amount++;
            } else {
                // Sino existe el elemento en el carrito, agreguelo a la base de datos
                productFind.amount = 1;
                db.cart[productFind.id] = productFind;
            }
            // Actualizarlo en el localStorage cuando se realice la operacion
            window.localStorage.setItem('cart', JSON.stringify(db.cart));
            // Llamar la funcion para imprimir en la pestaña
            printToCart(db);
            // LLamar la funcion para imprimir los totales del carrito
            totalCart(db);
        }
    });
}

// Imprimir los productos del carrito de compras
function printToCart(db) {
    // Clase donde vamos a colocar los productos
    const cart_products = document.querySelector('.cart_products');
    let html = '';
    // Recorrer todos los productos que estan en el carrito de compras
    for (const product in db.cart) {
        const {quantity, price, name, image, id, amount} = db.cart[product];
        html += `
            <div class="cart_product">
                <div class="cart_product_image">
                    <img src="${image}" alt="image product"/>
                </div>
                <div class="cart_product_container">
                    <div class="cart_product_description">
                        <h3>${name}</h3>
                        <h4>Precio: $${price}</h4>
                        <p>Stock: ${quantity}</p>
                    </div>
                    <div  id=${id} class="cart_counter">
                        <b class='less'>-</b>
                        <span>${amount}</span>
                        <b class='plus'>+</b>
                        <img class='trash' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAKRJREFUSEvtlcERgCAMBNdOtBMtxUosxVK0FDvRYUZ4xImHIj/5SSR7SQauofJqKudHAXpgBlpHyAaMwOoJVYAFCJC7FSDdW8B+HvSEqLhskUqg4hdAPFA6+1SxLb06ICqXpZsS3f9fD+9rgFWovhM/twKVsLhFP+Byr5625J+BfJqKW6QIjwE5RmOhwdUGu+nd5OBiU4abxXyudSrLVK2R8eqAA04lOBnZrFOdAAAAAElFTkSuQmCC" alt="trash"/>
                    </div>
                </div>
            </div>
        `;
    }
    // Insertar el codigo html
    cart_products.innerHTML = html;
}

// Interacion de los botones de los productos agregados al carrito de compras
function handleCart (db) {
    const cart_products = document.querySelector('.cart_products');
    cart_products.addEventListener('click', function(event){
        // Para agregar al carrito de compras
        if(event.target.classList.contains('plus')){
            const id = Number(event.target.parentElement.id);
            const productFind = db.products.find(function(product){
                return product.id === id;
            });
            if(db.cart[productFind.id]){
                if(productFind.quantity === db.cart[productFind.id].amount){
                    return alert('No tenemos más en bodega');
                }
            }
            db.cart[id].amount++;
        }
        // Para restar elementos del carrito de compras
        if(event.target.classList.contains('less')){
            const id = Number(event.target.parentElement.id);
            // Validar si es 1 entonces borrarlo pq no es que se pueda comprar 0 productos
            if(db.cart[id].amount === 1) {
                const response = confirm('¿Estas seguro que quieres borrar este producto de su compra?');
                if(!response){
                    return;
                }
                delete db.cart[id];
            } else {
                // Descontar cuando la cantidad sea mayor a 1
                db.cart[id].amount--;
            }
        }
        // Para eliminar el articulo del carrito de compras
        if(event.target.classList.contains('trash')) {
            const id = Number(event.target.parentElement.id);
            const response = confirm('¿Estas seguro que quieres borrar este producto de su compra?');
            // Validar o confirmar antes de borrar el articulo del carrito de compras
            if(!response) {
                return;
            }
            delete db.cart[id];
        }
        window.localStorage.setItem('cart', JSON.stringify(db.cart));
        // Actualizar la visualizacion
        printToCart(db);
        totalCart(db);
    });
}

// Imprimir los valores totales del carrito de compras
function totalCart(db) {
    // Identifficar en que clases estan los totales para modificarlos
    const info_span = document.querySelector('.header_cart span');
    const info_total = document.querySelector('.info_total');
    const info_amount = document.querySelector('.info_amount');
    // Inicializar los valores en 0 para el contador de productos y el precio
    let totalProducts = 0;
    let amountProducts = 0;
    // Recorrer los productos que tenemos agregados al carrito
    for (const product in db.cart) {
        // Sumar a las cantidades
        amountProducts += db.cart[product].amount;
        // Multiplicar la cantidad por el precio
        totalProducts += (db.cart[product].amount * db.cart[product].price);
    }
    // Imprimir los valores
    info_total.textContent = 'Total: $'+totalProducts;
    info_amount.textContent = 'Cantidad: '+amountProducts;
    info_span.textContent = amountProducts;
}

// Ejecutar la compra del carrito de compras
function buyCart(db) {
    const btnBuy = document.querySelector('.btn_buy');
    btnBuy.addEventListener('click', function(){
        // Validar si el carrito esta en 0 o no tiene productos
        if (!Object.keys(db.cart).length) {
            return alert('No tienes productos para comprar');
        }
        // Confirmar que el usuario quiere comprar
        const response = confirm('Confirma para comprar');
        // Si el usuario le da cancelar, se detiene la efecucion de la compra
        if (!response) {
            return;
        }
        // Cuando acepte la compra, traemos TODA la base de datos
        for (const product of db.products) {
            const cartProduct = db.cart[product.id];
            // comparamos lo que tenemos en la dase de datos y el carrito de compras
            if (product.id === cartProduct?.id) {
                // Actualizar en nuestra bsase de datos, y disminuir la cantidad que compramos en cada uno de los productos
                product.quantity -= cartProduct.amount;
            }
        }
        // Volver en 0 nuestro carrito de compras, luego de haber hecho la compra
        db.cart = {};
        // Guardar la actualizacion en la base de datos de productos
        window.localStorage.setItem('products', JSON.stringify(db.products));
        // Guardar la actualizacion en la base de datos del carrito de compras
        window.localStorage.setItem('cart', JSON.stringify(db.cart));
        // Volver actualizar la vista de los productos, carrito de compras y el total del carrito de compras
        printProducts(db);
        printToCart(db);
        totalCart(db);
    })
}

// Usar el filtro
function handleList(db) {
    const header_list_item = document.querySelectorAll('.header_list_item');
    // Si selecciona todos
    console.log(header_list_item);
    header_list_item[0].addEventListener('click', function() {
        printProducts(db);
    });
    // Si selecciona shirt
    header_list_item[1].addEventListener('click', function() {
        const productsHTML = document.querySelector('.products_academlo');
        let html = ''; 
        for (const product of db.products) {
            if(product.category==='shirt'){
                html += `
                <div class="product">
                    <div class="div_img">
                        <img id=${product.id} class="product_img" src="${product.image}" alt="image product"/>
                    </div>
                    <div class="product_name">
                        <span>${product.name}</span>
                    </div>
                    <div class="product_price">
                        <span>$${product.price}.00</span>
                    </div>
                    <div class="content_btn_cart">
                        <button id=${product.id} class="btn_cart">Agregar al carrito</button>
                    </div>
                </div>
                `        
            }
        }
        productsHTML.innerHTML = html;
        
    });
    // Si selecciona hoddie
    header_list_item[2].addEventListener('click', function() {
        const productsHTML = document.querySelector('.products_academlo');
        let html = ''; 
        for (const product of db.products) {
            if(product.category==='sweater'){
                html += `
        <div class="product">
            <div class="div_img">
                <img id=${product.id} class="product_img" src="${product.image}" alt="image product"/>
            </div>
            <div class="product_name">
                <span>${product.name}</span>
            </div>
            <div class="product_price">
                <span>$${product.price}.00</span>
            </div>
            <div class="content_btn_cart">
                <button id=${product.id} class="btn_cart">Agregar al carrito</button>
            </div>
        </div>
        `        
            }
        }
        productsHTML.innerHTML = html;
        
    });
    // Si selecciona sweater
    header_list_item[3].addEventListener('click', function() {
        const productsHTML = document.querySelector('.products_academlo');
        let html = ''; 
        for (const product of db.products) {
            if(product.category==='hoddie'){
                html += `
        <div class="product">
            <div class="div_img">
                <img id=${product.id} class="product_img" src="${product.image}" alt="image product"/>
            </div>
            <div class="product_name">
                <span>${product.name}</span>
            </div>
            <div class="product_price">
                <span>$${product.price}.00</span>
            </div>
            <div class="content_btn_cart">
                <button id=${product.id} class="btn_cart">Agregar al carrito</button>
            </div>
        </div>
        `        
            }
        }
        productsHTML.innerHTML = html;
        
    });
}

// Pagina flotante cuando ingresamos a un producto
function modalProduct (db) {
    const productsHTML = document.querySelector('.products_academlo');
    const modal = document.querySelector('.modal');
    const modal_product = document.querySelector('.modal_product');
    
    productsHTML.addEventListener('click', function(event){
        if(event.target.classList.contains('product_img')) {
            const id = Number (event.target.id);
            const productFind = db.products.find (function(product) {
                return product.id === id;
            });
            modal_product.innerHTML = `
                <div class="modal_img_product">
                    <img src='${productFind.image}' alt="image product">
                </div>
                <div class="modal_group">
                    <h3><span>Nombre: </span>${productFind.name}</h3>
                    <h3><span>Descripción: </span>${productFind.description}</h3>
                    <h3><span>Categoria: </span>${productFind.category}</h3>
                    <h3><span>Precio: </span>${productFind.price} | <span>Stock: </span>${productFind.quantity}</h3>
                </div>
                <span class= cerrar>Cerrar</span>
            `;
            modal.classList.add('active');
        }
    });
}

// Funcion principal
async function main () {
    // Trae la API a una base de datos local (localStorage)
    // Crear constante con los datos de la API como un objeto
    const db = {
        // Primero verifica si existe el elemento products en local storage
        products: JSON.parse(window.localStorage.getItem('products')) || await getApi(),
        // Si cart existe o no para inicializarlo en vacio
        cart: JSON.parse(window.localStorage.getItem('cart')) || {}
    }

    // Se ejecutan los eventos
    events();

    // imprimir de la API los productos
    printProducts(db);

    // Agregar los productos al carrito de compras
    addToCart(db);

    // Imprimir los productos en el carrito
    printToCart(db);

    // Eventos en el carrito de compras
    handleCart(db);

    // Totales del carrito de compras o de la compra
    totalCart(db);

    // Comprar
    buyCart(db);

    // Eventos de navBar
    handleList(db);

    // Eventos del modal o ventana flotante del producto
    modalProduct(db);
}

main();