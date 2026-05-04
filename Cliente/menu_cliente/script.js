// Supabase Initialization
const SUPABASE_URL = 'https://mfylvijpbibacmpfwynv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1meWx2aWpwYmliYWNtcGZ3eW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODk2ODgsImV4cCI6MjA5Mjg2NTY4OH0.KqXfisr_OATVcnwnPBcJFNR9jFm3MUDLQOYKC1puHNI';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// State
let products = [];
let categories = [];
let currentCategory = 'all';

// Cart Logic
let cart = JSON.parse(localStorage.getItem('bistroFlowCart')) || [];

const cartButton = document.getElementById('cart-button');
const cartPreview = document.getElementById('cart-preview');
const closeCart = document.getElementById('close-cart');
const cartBadge = document.getElementById('cart-badge');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalDisplay = document.getElementById('cart-total');
const clearCartButton = document.getElementById('clear-cart');

// Containers
const productsContainer = document.getElementById('products-container');
const categoriesContainer = document.getElementById('categories-container');
const categoryTitle = document.getElementById('category-title');

async function init() {
    await fetchCategories();
    await fetchProducts();
    
    // Check URL params
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam) currentCategory = catParam;
    
    renderCategories();
    renderProducts();
    updateCart();
}

async function fetchCategories() {
    const { data, error } = await _supabase
        .from('categoria_producto')
        .select('*')
        .eq('esta_activo', true);
    
    if (error) {
        console.error('Error categories:', error);
        return;
    }
    categories = data;
}

async function fetchProducts() {
    const { data, error } = await _supabase
        .from('producto')
        .select('*')
        .eq('estado', 'activo'); // Matches the DB check constraint: borrador, activo, agotado
    
    if (error) {
        console.error('Error products:', error);
        return;
    }
    products = data;
}

function renderCategories() {
    const innerContainer = categoriesContainer ? categoriesContainer.querySelector('.flex') : null;
    if (!innerContainer) return;
    
    let html = `
        <button onclick="filterByCategory('all')" 
            class="px-6 py-2.5 rounded-full ${currentCategory === 'all' ? 'bg-primary-container text-white' : 'bg-[#FDFCF0] text-stone-600 border border-outline-variant/20'} font-label-md flex items-center gap-2 shadow-sm transition-all hover:brightness-110">
            <span class="material-symbols-outlined text-sm">restaurant_menu</span>
            Menú Completo
        </button>
    `;
    
    categories.forEach(cat => {
        html += `
            <button onclick="filterByCategory('${cat.id}')" 
                class="px-6 py-2.5 rounded-full ${currentCategory == cat.id ? 'bg-primary-container text-white' : 'bg-[#FDFCF0] text-stone-600 border border-outline-variant/20'} font-label-md hover:bg-stone-100 transition-all">
                ${cat.nombre}
            </button>
        `;
    });
    
    innerContainer.innerHTML = html;
}

function renderProducts() {
    if (!productsContainer) return;
    
    const filtered = currentCategory === 'all' 
        ? products 
        : products.filter(p => p.id_categoria == currentCategory);
    
    if (currentCategory === 'all') {
        categoryTitle.textContent = 'Menú Completo';
    } else {
        const cat = categories.find(c => c.id == currentCategory);
        categoryTitle.textContent = cat ? cat.nombre : 'Productos';
    }

    productsContainer.innerHTML = '';
    
    if (filtered.length === 0) {
        productsContainer.innerHTML = '<p class="col-span-full text-center py-20 text-stone-400">No hay productos en esta categoría.</p>';
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'group bg-[#FDFCF0] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100/50 flex flex-col';
        card.innerHTML = `
            <div class="relative h-64 overflow-hidden">
                <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="${p.url_imagen || 'https://via.placeholder.com/400x300'}" alt="${p.nombre}">
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                    <span class="text-primary font-bold">$${parseFloat(p.precio).toFixed(2)}</span>
                </div>
            </div>
            <div class="p-6 flex flex-col flex-grow">
                <h3 class="font-headline-md text-on-surface mb-2">${p.nombre}</h3>
                <p class="text-stone-500 font-body-md text-sm mb-6 flex-grow leading-relaxed">${p.descripcion || ''}</p>
                <div class="flex items-center gap-3 mt-auto">
                    <button
                        data-name="${p.nombre}" data-price="${p.precio}" data-image="${p.url_imagen}"
                        class="add-to-cart flex-grow bg-primary text-white font-label-md py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-container transition-colors">
                        <span class="material-symbols-outlined text-lg">add_shopping_cart</span>
                        Agregar
                    </button>
                    <button class="p-3 border border-outline-variant/30 rounded-lg text-stone-400 hover:text-primary transition-all">
                        <span class="material-symbols-outlined text-lg">favorite</span>
                    </button>
                </div>
            </div>
        `;
        productsContainer.appendChild(card);
    });
}

window.filterByCategory = function(id) {
    currentCategory = id;
    renderCategories();
    renderProducts();
};

function updateCart() {
    localStorage.setItem('bistroFlowCart', JSON.stringify(cart));
    renderCart();
    updateBadge();
}

function updateBadge() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    if (cartBadge) {
        cartBadge.textContent = count;
        count > 0 ? cartBadge.classList.remove('hidden') : cartBadge.classList.add('hidden');
    }
    const mobileBar = document.getElementById('mobile-cart-bar');
    if (mobileBar) {
        count > 0 ? mobileBar.classList.remove('hidden') : mobileBar.classList.add('hidden');
        const mc = document.getElementById('mobile-cart-count');
        const mt = document.getElementById('mobile-cart-total');
        if (mc) mc.textContent = count;
        if (mt) mt.textContent = `$${total.toFixed(2)}`;
    }
}

function renderCart() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = cart.length === 0 ? '<p class="text-stone-400 text-center py-4 text-sm">Tu carrito está vacío</p>' : '';
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const div = document.createElement('div');
        div.className = 'flex items-center gap-3 bg-white p-2 rounded-lg border border-stone-50';
        div.innerHTML = `
            <img src="${item.image}" class="w-12 h-12 rounded-md object-cover">
            <div class="flex-1">
                <h4 class="text-xs font-bold">${item.name}</h4>
                <p class="text-[10px] text-stone-500">${item.quantity}x $${parseFloat(item.price).toFixed(2)}</p>
            </div>
            <div class="flex flex-col items-end gap-1">
                <span class="text-xs font-bold text-primary">$${itemTotal.toFixed(2)}</span>
                <div class="flex items-center gap-2">
                    <button onclick="changeQuantity(${index}, -1)" class="material-symbols-outlined text-xs">remove</button>
                    <span class="text-[10px]">${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)" class="material-symbols-outlined text-xs">add</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });
    if (cartTotalDisplay) cartTotalDisplay.textContent = `$${total.toFixed(2)}`;
}

window.changeQuantity = function(i, d) {
    cart[i].quantity += d;
    if (cart[i].quantity <= 0) cart.splice(i, 1);
    updateCart();
};

function addToCart(name, price, image) {
    const item = cart.find(i => i.name === name);
    item ? item.quantity++ : cart.push({ name, price: parseFloat(price), image, quantity: 1 });
    updateCart();
    showCartPreview();
}

function showCartPreview() {
    if (cartPreview) {
        cartPreview.classList.remove('hidden');
        setTimeout(() => cartPreview.classList.add('scale-100', 'opacity-100'), 10);
    }
}

function hideCartPreview() {
    if (cartPreview) {
        cartPreview.classList.remove('scale-100', 'opacity-100');
        setTimeout(() => cartPreview.classList.add('hidden'), 200);
    }
}

if (cartButton) cartButton.onclick = (e) => { e.stopPropagation(); cartPreview.classList.contains('hidden') ? showCartPreview() : hideCartPreview(); };
if (closeCart) closeCart.onclick = hideCartPreview;
document.onclick = (e) => { if (cartPreview && !cartPreview.contains(e.target) && e.target !== cartButton) hideCartPreview(); };
if (clearCartButton) clearCartButton.onclick = () => { cart = []; updateCart(); };
if (document.getElementById('mobile-view-cart')) document.getElementById('mobile-view-cart').onclick = showCartPreview;
document.body.onclick = (e) => {
    const b = e.target.closest('.add-to-cart');
    if (b) addToCart(b.dataset.name, b.dataset.price, b.dataset.image);
};

init();
