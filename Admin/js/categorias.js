const SUPABASE_URL = 'https://mfylvijpbibacmpfwynv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1meWx2aWpwYmliYWNtcGZ3eW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODk2ODgsImV4cCI6MjA5Mjg2NTY4OH0.KqXfisr_OATVcnwnPBcJFNR9jFm3MUDLQOYKC1puHNI';
let _supabase;

if (typeof supabase !== 'undefined') {
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

let categories = [];
let products = [];

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

        const { data: prodData, error: prodError } = await _supabase.from('producto').select('id_categoria');
        if (prodError) throw prodError;
        products = prodData || [];

        renderCategories();
    } catch (err) {
        console.error("Error fetching data:", err);
        const grid = document.getElementById('categories-grid');
        if (grid) {
            grid.innerHTML = `<p class="col-span-full text-center text-red-500 py-10 font-bold">Error de conexión: ${err.message}</p>`;
        }
    }
}

function setupEventListeners() {
    const btnAdd = document.getElementById('btn-add-category');
    const btnClose = document.getElementById('close-category-modal');
    const btnCancel = document.getElementById('cancel-category-modal');
    const form = document.getElementById('category-form');
    const searchInput = document.getElementById('search-category');

    if (btnAdd) btnAdd.addEventListener('click', () => openModal());
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);
    if (form) form.addEventListener('submit', handleFormSubmit);
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderCategories(e.target.value.toLowerCase());
        });
    }
}

function renderCategories(searchTerm = '') {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const filteredCategories = categories.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm) ||
        (c.descripcion && c.descripcion.toLowerCase().includes(searchTerm))
    );

    filteredCategories.forEach(c => {
        const itemCount = products.filter(p => p.id_categoria === c.id).length;
        const imageSrc = c.url_imagen || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300&h=200';

        const card = document.createElement('div');
        card.className = "bg-white border border-[#e6e2de] rounded-xl shadow-[0_2px_12px_rgba(45,42,38,0.02)] overflow-hidden flex flex-col group relative";
        card.innerHTML = `
            <div class="h-32 relative overflow-hidden">
                <img alt="${c.nombre}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${imageSrc}" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                    <h3 class="font-serif text-xl font-bold text-white">${c.nombre}</h3>
                    <span class="bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-2 py-1 rounded">${itemCount} Items</span>
                </div>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
                <p class="font-sans text-[14px] text-[#6b625b] mb-4 line-clamp-2">${c.descripcion || 'Sin descripción.'}</p>
                <div class="flex justify-between items-center pt-4 border-t border-[#f0ebe1]">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 ${c.esta_activo ? 'bg-[#edf2e0] text-[#556926]' : 'bg-[#f5f3f0] text-[#6b625b]'} text-[11px] font-bold rounded-full">
                        <span class="w-1.5 h-1.5 rounded-full ${c.esta_activo ? 'bg-[#556926]' : 'bg-[#8c827a]'}"></span>
                        ${c.esta_activo ? 'Activo' : 'Inactivo'}
                    </span>
                    <div class="flex gap-2">
                        <button onclick="editCategory(${c.id})" class="text-[#8c827a] hover:text-[#b34000] transition-colors p-1" title="Editar">
                            <span class="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onclick="deleteCategory(${c.id})" class="text-[#8c827a] hover:text-red-600 transition-colors p-1" title="Eliminar">
                            <span class="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Add "New Category" placeholder card
    const addCard = document.createElement('button');
    addCard.className = "bg-[#fdfbf7] border-2 border-dashed border-[#e6e2de] rounded-xl flex flex-col items-center justify-center p-8 min-h-[280px] hover:bg-white hover:border-[#b34000]/50 transition-colors group cursor-pointer text-left";
    addCard.innerHTML = `
        <div class="w-12 h-12 rounded-full bg-[#b34000]/10 flex items-center justify-center mb-4 group-hover:bg-[#b34000]/20 transition-colors">
            <span class="material-symbols-outlined text-[#b34000] text-[24px]">add</span>
        </div>
        <span class="font-serif text-xl font-bold text-[#2d2a26] group-hover:text-[#b34000] transition-colors">Nueva Categoría</span>
        <span class="font-sans text-[14px] text-[#6b625b] mt-2 text-center">Haz clic para añadir una nueva sección al menú</span>
    `;
    addCard.onclick = () => openModal();
    grid.appendChild(addCard);
}

function openModal(editId = null) {
    const modal = document.getElementById('category-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('category-form');

    if (editId !== null) {
        title.textContent = 'Editar Categoría';
        const c = categories.find(x => x.id === editId);
        if (c) {
            document.getElementById('category-id').value = c.id;
            document.getElementById('category-name').value = c.nombre;
            document.getElementById('category-desc').value = c.descripcion || '';
            document.getElementById('category-image').value = c.url_imagen || '';
            document.getElementById('category-status').value = c.esta_activo ? 'Activo' : 'Inactivo';
        }
    } else {
        title.textContent = 'Nueva Categoría';
        form.reset();
        document.getElementById('category-id').value = '';
    }

    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('category-modal');
    if (modal) modal.classList.add('hidden');
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const idVal = document.getElementById('category-id').value;
    const name = document.getElementById('category-name').value;
    const desc = document.getElementById('category-desc').value;
    const image = document.getElementById('category-image').value;
    const status = document.getElementById('category-status').value;

    const payload = {
        nombre: name,
        descripcion: desc,
        url_imagen: image,
        esta_activo: status
    };

    try {
        if (idVal) {
            // Edit
            const { error } = await _supabase.from('categoria_producto').update(payload).eq('id', idVal);
            if (error) throw error;
        } else {
            // Add
            const { error } = await _supabase.from('categoria_producto').insert([payload]);
            if (error) throw error;
        }

        closeModal();
        await fetchData();
    } catch (err) {
        console.error("Error saving category:", err);
        alert("Ocurrió un error al guardar la categoría.");
    }
}

window.editCategory = function (id) {
    openModal(id);
}

window.deleteCategory = async function (id) {
    if (confirm("¿Estás seguro de que deseas eliminar esta categoría? Esto podría afectar a los productos asociados.")) {
        try {
            const { error } = await _supabase.from('categoria_producto').delete().eq('id', id);
            if (error) throw error;
            await fetchData();
        } catch (err) {
            console.error("Error deleting category:", err);
            alert("Ocurrió un error al eliminar la categoría.");
        }
    }
}
