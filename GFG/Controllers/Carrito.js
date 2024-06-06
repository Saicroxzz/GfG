const cartItemsElement = document.getElementById("cart-items");
const checkoutBtn = document.getElementById("checkout-btn");

// Array para almacenar los productos en el carrito
let cartItems = [];

// Función para agregar un producto al carrito
function addToCart(product) {
    cartItems.push(product);
    renderCart();
}

// Función para renderizar los productos en el carrito
function renderCart() {
    cartItemsElement.innerHTML = "";
    cartItems.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.textContent = `${item.name} - $${item.price}`;
        cartItemsElement.appendChild(itemElement);
    });
}

// Evento al hacer clic en el botón "Pagar"
checkoutBtn.addEventListener("click", () => {
});
