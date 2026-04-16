const state = {
    products: [
        { id: 1, name: "Laptop", price: 999, image: "..." },
        { id: 2, name: "Phone", price: 699, image: "..." },
        { id: 3, name: "Headphones", price: 199, image: "..." }
    ],
    cart: []  // { productId, quantity }
};

function addToCart(productId) {
    const existing = state.cart.find(item => item.productId === productId);
    
    if (existing) {
        existing.quantity++;
    } else {
        state.cart.push({ productId, quantity: 1 });
    }
    
    saveCart();
    renderCart();
}

function updateQuantity(productId, quantity) {
    // Update or remove if quantity is 0
}

function removeFromCart(productId) {
    // Remove item from cart
}

function getCartTotal() {
    return state.cart.reduce((total, item) => {
        const product = state.products.find(p => p.id === item.productId);
        return total + (product.price * item.quantity);
    }, 0);
}

function getCartCount() {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
}