const SUPABASE_URL = 'https://mfylvijpbibacmpfwynv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1meWx2aWpwYmliYWNtcGZ3eW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODk2ODgsImV4cCI6MjA5Mjg2NTY4OH0.KqXfisr_OATVcnwnPBcJFNR9jFm3MUDLQOYKC1puHNI';
let _supabase;
if (typeof supabase !== 'undefined') {
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

let products = [];
let categories = [];
let currentViewMode = 'grid';

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    setupEventListeners();
});

async function fetchData() {
    if (!_supabase) return;
    try {
        const { data: catData, error: catError } = await _supabase.from('categoria_producto').select('*');
        if (catError) throw catError;
        categories = catData || [];

        const { data: prodData, error: prodError } = await _supabase.from('producto').select('*');
        if (prodError) throw prodError;

        products = (prodData || []).map(p => {
            const cat = categories.find(c => c.id === p.id_categoria);
            return {
                id: p.id,
                name: p.nombre,
                price: parseFloat(p.precio) || 0,
                categoryId: p.id_categoria,
                category: cat ? cat.nombre : 'Sin Categoría',
                status: p.estado || "activo",
                image: p.url_imagen || '',
                desc: p.descripcion || ''
            };
        });

        populateCategoryFilters();
        renderProducts();
    } catch (err) {
        console.error("Error fetching data:", err);
    }
}

function populateCategoryFilters() {
    const filterCat = document.getElementById('filter-category');
    const formCat = document.getElementById('product-category');

    if (filterCat) {
        filterCat.innerHTML = '<option value="all">Todas las categorías</option>';
        categories.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.nombre;
            filterCat.appendChild(option);
        });
    }

    if (formCat) {
        formCat.innerHTML = '<option value="">Selecciona una categoría...</option>';
        categories.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.nombre;
            formCat.appendChild(option);
        });
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById('search-product');
    const categorySelect = document.getElementById('filter-category');
    const statusSelect = document.getElementById('filter-status');
    const priceSelect = document.getElementById('filter-price');

    const handleFilters = () => {
        const query = searchInput.value.toLowerCase();
        const catIdStr = categorySelect.value;
        const state = statusSelect ? statusSelect.value : 'all';
        const priceOrder = priceSelect.value;

        let filtered = products.filter(p => {
            const matchName = p.name.toLowerCase().includes(query);
            const matchCat = catIdStr === 'all' || p.categoryId.toString() === catIdStr;
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

    if (searchInput) searchInput.addEventListener('input', handleFilters);
    if (categorySelect) categorySelect.addEventListener('change', handleFilters);
    if (statusSelect) statusSelect.addEventListener('change', handleFilters);
    if (priceSelect) priceSelect.addEventListener('change', handleFilters);

    const btnGrid = document.getElementById('btn-view-grid');
    const btnList = document.getElementById('btn-view-list');

    if(btnGrid) {
        btnGrid.addEventListener('click', () => {
            currentViewMode = 'grid';
            btnGrid.className = "w-9 h-8 flex items-center justify-center bg-[#fdf0e6] text-[#b84a1e] transition-colors";
            btnList.className = "w-9 h-8 flex items-center justify-center text-[#8c827a] hover:bg-[#fdfbf7] border-l border-[#e6e2de] transition-colors";
            renderProducts();
        });
    }

    if(btnList) {
        btnList.addEventListener('click', () => {
            currentViewMode = 'list';
            btnList.className = "w-9 h-8 flex items-center justify-center bg-[#fdf0e6] text-[#b84a1e] border-l border-[#e6e2de] transition-colors";
            btnGrid.className = "w-9 h-8 flex items-center justify-center text-[#8c827a] hover:bg-[#fdfbf7] transition-colors";
            renderProducts();
        });
    }

    const btnAdd = document.getElementById('btn-add-product');
    const btnClose = document.getElementById('close-modal');
    const btnCancel = document.getElementById('cancel-modal');
    const form = document.getElementById('product-form');

    if (btnAdd) btnAdd.addEventListener('click', () => openModal());
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);
    if (form) form.addEventListener('submit', handleFormSubmit);
}

function getBadgeHtml(status) {
    if (status === 'activo') return '<span class="px-2 py-0.5 bg-[#d36b36]/80 text-white rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">Activo</span>';
    if (status === 'agotado') return '<span class="px-2 py-0.5 bg-[#fca5a5]/80 text-[#991b1b] rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">Agotado</span>';
    return '<span class="px-2 py-0.5 bg-[#e5dfd8]/90 text-[#5c544c] rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">Borrador</span>';
}

function renderProducts(pl = products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (pl.length === 0) {
        grid.className = "pb-12";
        grid.innerHTML = '<p class="col-span-full text-center text-[#8c827a] py-10 font-bold">No se encontraron productos.</p>';
        return;
    }

    if (currentViewMode === 'grid') {
        grid.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12";
    } else {
        grid.className = "flex flex-col gap-4 pb-12";
    }

    pl.forEach(p => {
        const imageHtml = p.image
            ? `<img alt="${p.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="${p.image}"/>`
            : `<div class="w-full h-full bg-[#f4f2ee] flex items-center justify-center text-[#c2bbb3] border-b border-[#e6e2de]"><span class="material-symbols-outlined text-4xl">image</span></div>`;

        const priceHtml = p.price > 0 ? `$${p.price.toFixed(2)}` : '--';

        const div = document.createElement('div');

        if (currentViewMode === 'grid') {
            div.className = "bg-white rounded-[14px] overflow-hidden flex flex-col shadow-[0_2px_12px_rgba(45,42,38,0.04)] border border-[#f0ebe1] group transition-all duration-300 hover:shadow-[0_8px_24px_rgba(192,86,33,0.08)] hover:-translate-y-1";
            div.innerHTML = `
                <div class="relative h-[180px] w-full overflow-hidden shrink-0">
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
        } else {
            div.className = "bg-white rounded-[14px] overflow-hidden flex shadow-[0_2px_12px_rgba(45,42,38,0.04)] border border-[#f0ebe1] group transition-all duration-300 hover:shadow-[0_8px_24px_rgba(192,86,33,0.08)]";
            div.innerHTML = `
                <div class="relative h-[120px] w-[160px] shrink-0 overflow-hidden">
                    ${imageHtml}
                </div>
                <div class="p-5 flex-1 flex items-center justify-between gap-6 bg-white">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-3 mb-1">
                            <h3 class="font-serif text-[17px] font-bold text-[#2d2a26] leading-tight truncate">${p.name}</h3>
                            ${getBadgeHtml(p.status)}
                        </div>
                        <p class="font-sans text-[13px] text-[#6b625b] line-clamp-2 leading-[1.6] max-w-xl">${p.desc}</p>
                        <span class="inline-block mt-2 font-sans text-[11px] font-bold text-[#8c827a]">${p.category}</span>
                    </div>
                    
                    <div class="flex flex-col items-end gap-3 shrink-0">
                        <span class="font-sans text-[16px] font-bold text-[#c05621] shadow-sm">${priceHtml}</span>
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
        }
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
        if (p) {
            document.getElementById('product-id').value = p.id;
            document.getElementById('product-name').value = p.name;
            document.getElementById('product-price').value = p.price;
            document.getElementById('product-category').value = p.categoryId;
            document.getElementById('product-status').value = p.status;
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
    if (modal) modal.classList.add('hidden');
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const idVal = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const categoryId = document.getElementById('product-category').value;
    const status = document.getElementById('product-status').value;
    const image = document.getElementById('product-image').value;
    const desc = document.getElementById('product-desc').value;
    const payload = {
        nombre: name,
        precio: price,
        id_categoria: parseInt(categoryId),
        estado: status,
        url_imagen: image,
        descripcion: desc
    };

    try {
        if (idVal) {
            // Edit
            const { error } = await _supabase.from('producto').update(payload).eq('id', idVal);
            if (error) throw error;
        } else {
            // Add
            const { error } = await _supabase.from('producto').insert([payload]);
            if (error) throw error;
        }

        closeModal();
        await fetchData(); // Refresh data from backend
    } catch (err) {
        console.error("Error saving product:", err);
        alert("Ocurrió un error al guardar el producto.");
    }
}

function editProduct(id) {
    openModal(id);
}

async function deleteProduct(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.")) {
        try {
            const { error } = await _supabase.from('producto').delete().eq('id', id);
            if (error) throw error;
            await fetchData(); // Refresh data
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Ocurrió un error al eliminar el producto.");
        }
    }
}