let products = [
    {
        id: 1,
        name: "Risotto de Trufa",
        price: 28.00,
        category: "Platos Principales",
        status: "activo",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiBFYJYEugkDTh74u1jB_l8-kpTJSEUTBvPRqtXahzV-J1Syi-U6PU4U_KhHlPMugaCBi8BN8eYCYQOF7__kj9Hx1EJYcV1qfiGwADJjUydlAg4UFT64o_cvmaMq9nSBGb2ckMOr_VXIgp21E_WNIhv3ibBqz6j24CV_oTameb5tG9GiTSga4q_eXEsRWyqwxoz-ICZpexPU6s969cBy8NVNTkTqa3V08GeeLiW3zMeTQuI-RCQuMA5xK45Tj9Aw4yxIU1o3LeuQM",
        desc: "Arroz Arborio, setas silvestres, aceite de trufa…"
    },
    {
        id: 2,
        name: "Tartar de Ternera",
        price: 22.00,
        category: "Entrantes",
        status: "activo",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUmGHXajtxKElrFfxJ0m1V9SesrTgMXeqPUHVPMMj6HKGgvKuxvrieSwcaYUuDffoGw2zsS0cR7fdjrF0DYOhnJMQCGIba0JlzXy7b1f10OemOis3lC9LsjlBoudmIp2QDBNmDOnzc5kFHSdo1EYAPrbUmDYgT8ODPtwE0As8ae4Km2g6pL_o5ncWP_sd4KT5hhPWFiXTuHb7MH5m_06-fatw8WKX8L_rWXfd_LOLjE8ga_9Igze9FvM7SWijwV6R2EzXSnFx4UDA",
        desc: "Carne de ternera de primera cortada a mano, alcaparras…"
    },
    {
        id: 3,
        name: "Ensalada de Temporada",
        price: 0,
        category: "Entrantes",
        status: "borrador",
        image: "",
        desc: "Lista final de ingredientes y precios pendientes para el…"
    },
    {
        id: 4,
        name: "Bistro Sunset",
        price: 16.00,
        category: "Bebidas",
        status: "agotado",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=300&h=200",
        desc: "Ginebra, puré de naranja sanguina, licor de flor de…"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
});

function setupEventListeners() {
    const searchInput = document.getElementById('search-product');
    const categorySelect = document.getElementById('filter-category');
    const statusSelect = document.getElementById('filter-status');
    const priceSelect = document.getElementById('filter-price');

    const handleFilters = () => {
        const query = searchInput.value.toLowerCase();
        const cat = categorySelect.value;
        const state = statusSelect ? statusSelect.value : 'all';
        const priceOrder = priceSelect.value;

        let filtered = products.filter(p => {
            const matchName = p.name.toLowerCase().includes(query);
            const matchCat = cat === 'all' || p.category === cat;
            const matchStatus = state === 'all' || p.status === state;
            return matchName && matchCat && matchStatus;
        });

        if (priceOrder === 'default') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (priceOrder === 'desc') {
            filtered.sort((a, b) => b.price - a.price);
        }

        renderProducts(filtered);
    };

    searchInput.addEventListener('input', handleFilters);
    categorySelect.addEventListener('change', handleFilters);
    if(statusSelect) statusSelect.addEventListener('change', handleFilters);
    priceSelect.addEventListener('change', handleFilters);

    const btnAdd = document.getElementById('btn-add-product');
    const btnClose = document.getElementById('close-modal');
    const btnCancel = document.getElementById('cancel-modal');
    const form = document.getElementById('product-form');

    btnAdd.addEventListener('click', () => openModal());
    btnClose.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);
    
    form.addEventListener('submit', handleFormSubmit);
}

function getBadgeHtml(status) {
    if(status === 'activo') return '<span class="px-2 py-0.5 bg-[#d36b36]/80 text-white rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">Activo</span>';
    if(status === 'agotado') return '<span class="px-2 py-0.5 bg-[#fca5a5]/80 text-[#991b1b] rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">Agotado</span>';
    return '<span class="px-2 py-0.5 bg-[#e5dfd8]/90 text-[#5c544c] rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">Borrador</span>';
}

function renderProducts(pl = products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    if(pl.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center text-on-surface-variant py-10 font-bold">No se encontraron productos.</p>';
        return;
    }

    pl.forEach(p => {
        const imageHtml = p.image 
            ? `<img alt="${p.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="${p.image}"/>`
            : `<div class="w-full h-full bg-[#f4f2ee] flex items-center justify-center text-[#c2bbb3] border-b border-[#e6e2de]"><span class="material-symbols-outlined text-4xl">image</span></div>`;

        const priceHtml = p.price > 0 ? `$${p.price.toFixed(2)}` : '--';

        const div = document.createElement('div');
        div.className = "bg-white rounded-[14px] overflow-hidden flex flex-col shadow-[0_2px_12px_rgba(45,42,38,0.04)] border border-[#f0ebe1] group transition-all duration-300 hover:shadow-[0_8px_24px_rgba(192,86,33,0.08)] hover:-translate-y-1";
        div.innerHTML = `
            <div class="relative h-[180px] w-full overflow-hidden">
                ${imageHtml}
                <div class="absolute top-3 right-3 flex gap-1 z-10">
                    ${getBadgeHtml(p.status)}
                </div>
            </div>
            <div class="p-5 flex-1 flex flex-col bg-white">
                <div class="flex justify-between items-start gap-2 mb-2">
                    <h3 class="font-serif text-[17px] font-bold text-[#2d2a26] leading-tight">${p.name}</h3>
                    <span class="font-sans text-[14px] font-bold text-[#c05621] shrink-0 pt-0.5 shadow-sm">${priceHtml}</span>
                </div>
                <p class="font-sans text-[13px] text-[#6b625b] line-clamp-2 leading-[1.6] flex-1">${p.desc}</p>
                
                <div class="mt-4 flex justify-between items-center pt-4 border-t border-dashed border-[#e6e2de]">
                    <span class="font-sans text-[11px] font-bold text-[#2d2a26]">${p.category}</span>
                    <div class="flex gap-1">
                        <button onclick="editProduct(${p.id})" class="p-1.5 text-[#8c827a] hover:text-[#c05621] hover:bg-[#fffcf8] rounded-md transition-colors" title="Editar">
                            <span class="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onclick="deleteProduct(${p.id})" class="p-1.5 text-[#8c827a] hover:text-[#dc2626] hover:bg-[#fef2f2] rounded-md transition-colors" title="Eliminar">
                            <span class="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(div);
    });
}

function openModal(editId = null) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('product-form');
    
    if (editId !== null) {
        title.textContent = 'Editar Producto';
        const p = products.find(x => x.id === editId);
        if(p) {
            document.getElementById('product-id').value = p.id;
            document.getElementById('product-name').value = p.name;
            document.getElementById('product-price').value = p.price;
            document.getElementById('product-category').value = p.category;
            document.getElementById('product-image').value = p.image;
            document.getElementById('product-desc').value = p.desc;
        }
    } else {
        title.textContent = 'Agregar Producto';
        form.reset();
        document.getElementById('product-id').value = '';
    }
    
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.add('hidden');
}

function handleFormSubmit(e) {
    e.preventDefault();
    const idVal = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const image = document.getElementById('product-image').value;
    const desc = document.getElementById('product-desc').value;

    if (idVal) {
        // Edit 
        const p = products.find(x => x.id === parseInt(idVal));
        if (p) {
            p.name = name;
            p.price = price;
            p.category = category;
            p.image = image;
            p.desc = desc;
        }
    } else {
        // Add
        const newId = products.length > 0 ? Math.max(...products.map(x => x.id)) + 1 : 1;
        products.push({ id: newId, name, price, category, image, desc });
    }

    closeModal();
    // Trigger re-render considering current filters
    const searchInput = document.getElementById('search-product');
    searchInput.dispatchEvent(new Event('input')); 
}

function editProduct(id) {
    openModal(id);
}

function deleteProduct(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.")) {
        products = products.filter(x => x.id !== id);
        // Trigger re-render considering current filters
        const searchInput = document.getElementById('search-product');
        searchInput.dispatchEvent(new Event('input')); 
    }
}