// ─── STATE ───────────────────────────────────────────────────────────────────

const state = {
    products: [
        { id: 1, name: "Laptop", price: 89900, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80", category: "Electronics" },
        { id: 2, name: "Smartphone", price: 55900, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80", category: "Electronics" },
        { id: 3, name: "Wireless Headphones", price: 12900, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", category: "Electronics" },
        { id: 4, name: "Running Shoes", price: 7500, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", category: "Footwear" },
        { id: 5, name: "Backpack", price: 4200, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", category: "Bags" },
        { id: 6, name: "Coffee Maker", price: 8800, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80", category: "Kitchen" },
    ],
    cart: [] // [{ productId, quantity }]
};

// ─── PERSISTENCE ─────────────────────────────────────────────────────────────

function saveCart() {
    localStorage.setItem("taifa_cart", JSON.stringify(state.cart));
}

function loadCart() {
    const saved = localStorage.getItem("taifa_cart");
    state.cart = saved ? JSON.parse(saved) : [];
}

// Load cart from storage immediately
loadCart();

// ─── CART OPERATIONS ─────────────────────────────────────────────────────────

function addToCart(productId) {
    const existing = state.cart.find(item => item.productId === productId);

    if (existing) {
        existing.quantity++;
    } else {
        state.cart.push({ productId, quantity: 1 });
    }

    saveCart();
    updateCartCount();

    const product = state.products.find(p => p.id === productId);
    showToast(`"${product.name}" added to cart!`);
}

function updateQuantity(productId, newQuantity) {
    const qty = parseInt(newQuantity);

    if (qty <= 0) {
        removeFromCart(productId);
        return;
    }

    const item = state.cart.find(i => i.productId === productId);
    if (item) {
        item.quantity = qty;
        saveCart();
        renderCart();
        updateCartCount();
    }
}

function removeFromCart(productId) {
    const product = state.products.find(p => p.id === productId);
    state.cart = state.cart.filter(item => item.productId !== productId);
    saveCart();
    renderCart();
    updateCartCount();
    if (product) showToast(`"${product.name}" removed.`);
}

function clearCart() {
    if (state.cart.length === 0) return;
    state.cart = [];
    saveCart();
    renderCart();
    updateCartCount();
    showToast("Cart cleared.");
}

// ─── CALCULATIONS ─────────────────────────────────────────────────────────────

function getCartTotal() {
    return state.cart.reduce((total, item) => {
        const product = state.products.find(p => p.id === item.productId);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
}

function getCartCount() {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
}

function formatPrice(amount) {
    return "KSh " + amount.toLocaleString("en-KE");
}

// ─── RENDER: PRODUCTS (index.html) ───────────────────────────────────────────

function renderProducts() {
    const grid = document.getElementById("product-grid");
    const countEl = document.getElementById("product-count");
    if (!grid) return;

    if (countEl) countEl.textContent = `${state.products.length} items`;

    grid.innerHTML = state.products.map(product => `
        <div class="product-card" id="product-${product.id}">
            <div class="product-img-wrap">
                <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
                <span class="product-category">${product.category}</span>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${formatPrice(product.price)}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add to Cart
                </button>
            </div>
        </div>
    `).join("");
}

// ─── RENDER: CART (cart.html) ─────────────────────────────────────────────────

function renderCart() {
    const list = document.getElementById("cart-list");
    const emptyMsg = document.getElementById("empty-cart");
    const summary = document.getElementById("order-summary");
    const clearBtn = document.getElementById("clear-btn");
    if (!list) return;

    if (state.cart.length === 0) {
        list.innerHTML = "";
        if (emptyMsg) emptyMsg.style.display = "flex";
        if (summary) summary.style.display = "none";
        if (clearBtn) clearBtn.style.display = "none";
        return;
    }

    if (emptyMsg) emptyMsg.style.display = "none";
    if (summary) summary.style.display = "flex";
    if (clearBtn) clearBtn.style.display = "inline-flex";

    list.innerHTML = state.cart.map(item => {
        const product = state.products.find(p => p.id === item.productId);
        if (!product) return "";
        const lineTotal = product.price * item.quantity;
        return `
            <li class="cart-item" id="cart-item-${product.id}">
                <img src="${product.image}" alt="${product.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <p class="cart-item-name">${product.name}</p>
                    <p class="cart-item-unit-price">${formatPrice(product.price)} each</p>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${product.id}, ${item.quantity - 1})">−</button>
                        <input 
                            type="number" 
                            class="qty-input" 
                            value="${item.quantity}" 
                            min="1"
                            onchange="updateQuantity(${product.id}, this.value)"
                        >
                        <button class="qty-btn" onclick="updateQuantity(${product.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-right">
                    <p class="cart-item-total">${formatPrice(lineTotal)}</p>
                    <button class="remove-btn" onclick="removeFromCart(${product.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        Remove
                    </button>
                </div>
            </li>
        `;
    }).join("");

    // Update order summary
    const total = getCartTotal();
    const count = getCartCount();
    const summaryCount = document.getElementById("summary-count");
    const summarySubtotal = document.getElementById("summary-subtotal");
    const summaryTotal = document.getElementById("summary-total");

    if (summaryCount) summaryCount.textContent = count;
    if (summarySubtotal) summarySubtotal.textContent = formatPrice(total);
    if (summaryTotal) summaryTotal.textContent = formatPrice(total);
}

// ─── CART COUNT BADGE ─────────────────────────────────────────────────────────

function updateCartCount() {
    const badges = document.querySelectorAll("#cart-count");
    const count = getCartCount();
    badges.forEach(badge => {
        badge.textContent = count;
        badge.classList.toggle("has-items", count > 0);
    });
}

// ─── TOAST NOTIFICATION ───────────────────────────────────────────────────────

let toastTimer;
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}