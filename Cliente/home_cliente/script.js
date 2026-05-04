// Cart Logic
let cart = JSON.parse(localStorage.getItem('bistroFlowCart')) || [];

const cartButton = document.getElementById('cart-button');
const cartPreview = document.getElementById('cart-preview');
const closeCart = document.getElementById('close-cart');
const cartBadge = document.getElementById('cart-badge');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalDisplay = document.getElementById('cart-total');
const clearCartButton = document.getElementById('clear-cart');

function updateCart() {
    localStorage.setItem('bistroFlowCart', JSON.stringify(cart));
    renderCart();
    updateBadge();
}

function updateBadge() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Desktop Badge
    if (count > 0) {
        cartBadge.textContent = count;
        cartBadge.classList.remove('hidden');
    } else {
        cartBadge.classList.add('hidden');
    }

    // Mobile Bar
    const mobileBar = document.getElementById('mobile-cart-bar');
    const mobileCount = document.getElementById('mobile-cart-count');
    const mobileTotal = document.getElementById('mobile-cart-total');

    if (mobileBar && count > 0) {
        mobileBar.classList.remove('hidden');
        if (mobileCount) mobileCount.textContent = count;
        if (mobileTotal) mobileTotal.textContent = `$${total.toFixed(2)}`;
    } else if (mobileBar) {
        mobileBar.classList.add('hidden');
    }
}

function renderCart() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-stone-400 text-center py-4 text-sm">Tu carrito está vacío</p>';
        cartTotalDisplay.textContent = '$0.00';
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'flex items-center gap-3 bg-white p-2 rounded-lg border border-stone-50';
        itemElement.innerHTML = `
            <img src="${item.image}" class="w-12 h-12 rounded-md object-cover" alt="${item.name}">
            <div class="flex-1">
                <h4 class="text-xs font-bold text-stone-800">${item.name}</h4>
                <p class="text-[10px] text-stone-500">${item.quantity}x $${item.price.toFixed(2)}</p>
            </div>
            <div class="flex flex-col items-end gap-1">
                <span class="text-xs font-bold text-primary">$${itemTotal.toFixed(2)}</span>
                <div class="flex items-center gap-2">
                    <button onclick="changeQuantity(${index}, -1)" class="material-symbols-outlined text-xs text-stone-400 hover:text-primary">remove</button>
                    <span class="text-[10px]">${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)" class="material-symbols-outlined text-xs text-stone-400 hover:text-primary">add</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    cartTotalDisplay.textContent = `$${total.toFixed(2)}`;
}

window.changeQuantity = function (index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCart();
};

function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price: parseFloat(price), image, quantity: 1 });
    }
    updateCart();

    showCartPreview();
}

function showCartPreview() {
    if (!cartPreview) return;
    cartPreview.classList.remove('hidden');
    setTimeout(() => {
        cartPreview.classList.remove('scale-95', 'opacity-0');
        cartPreview.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function hideCartPreview() {
    if (!cartPreview) return;
    cartPreview.classList.remove('scale-100', 'opacity-100');
    cartPreview.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        cartPreview.classList.add('hidden');
    }, 200);
}

if (cartButton) {
    cartButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (cartPreview.classList.contains('hidden')) {
            showCartPreview();
        } else {
            hideCartPreview();
        }
    });
}

if (closeCart) {
    closeCart.addEventListener('click', hideCartPreview);
}

document.addEventListener('click', (e) => {
    if (cartPreview && !cartPreview.contains(e.target) && e.target !== cartButton) {
        hideCartPreview();
    }
});

if (clearCartButton) {
    clearCartButton.addEventListener('click', () => {
        cart = [];
        updateCart();
    });
}

const mobileViewCartBtn = document.getElementById('mobile-view-cart');
if (mobileViewCartBtn) {
    mobileViewCartBtn.addEventListener('click', showCartPreview);
}

document.body.addEventListener('click', (e) => {
    const button = e.target.closest('.add-to-cart');
    if (button) {
        const { name, price, image } = button.dataset;
        addToCart(name, price, image);
    }
});

// Initialize
updateCart();

// Navigation to Menu with Filters
document.querySelectorAll('[id^="category-"]').forEach(card => {
    card.addEventListener('click', () => {
        const catId = card.id.split('-')[1];
        if (catId) {
            window.location.href = `../menu_cliente/code.html?category=${catId}`;
        }
    });
});
