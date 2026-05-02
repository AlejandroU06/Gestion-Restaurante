const SUPABASE_URL = 'https://mfylvijpbibacmpfwynv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1meWx2aWpwYmliYWNtcGZ3eW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODk2ODgsImV4cCI6MjA5Mjg2NTY4OH0.KqXfisr_OATVcnwnPBcJFNR9jFm3MUDLQOYKC1puHNI';
let _supabase;
if (typeof supabase !== 'undefined') {
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

let users = [];

// Pagination & Filter State
let currentPage = 1;
const itemsPerPage = 8;

document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
    setupEventListeners();
});

async function fetchUsers() {
    if (!_supabase) return;
    try {
        const { data, error } = await _supabase.from('usuario').select('*');
        if (error) throw error;

        let loggedInUser = null;
        try {
            loggedInUser = JSON.parse(localStorage.getItem('user'));
        } catch (e) { }

        const currentUserId = loggedInUser ? (loggedInUser.id || loggedInUser.Id_usuario || loggedInUser.id_usuario) : null;

        users = data.filter(u => {
            const rowId = u.id || u.Id_usuario || u.id_usuario;
            return rowId !== currentUserId;
        }).map(u => ({
            id: u.id || u.Id_usuario || u.id_usuario,
            name: u.nombre || u.name,
            email: u.email || u.correo || '',
            role: u.rol || u.role,
            registeredAt: u.created_at || '2024-01-01',
            status: u.estado || u.status || 'Activo'
        }));
        // Call applyFiltersAndRender instead of renderUsers directly
        applyFiltersAndRender();
    } catch (err) {
        console.error("Error fetching users:", err);
        const tbody = document.getElementById('users-tbody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-red-500 py-4 font-bold">Error de conexión: ${err.message || JSON.stringify(err)}</td></tr>`;
        }
    }
}

function setupEventListeners() {
    // Search & Filter
    const searchInput = document.getElementById('search-user');
    const roleSelect = document.getElementById('filter-role');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentPage = 1; // Reset to first page on search
            applyFiltersAndRender();
        });
    }

    if (roleSelect) {
        roleSelect.addEventListener('change', () => {
            currentPage = 1; // Reset to first page on filter change
            applyFiltersAndRender();
        });
    }

    // Modal controls
    const btnAdd = document.getElementById('btn-add-user');
    const btnClose = document.getElementById('close-user-modal');
    const btnCancel = document.getElementById('cancel-user-modal');
    const form = document.getElementById('user-form');

    if (btnAdd) btnAdd.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);
    if (form) form.addEventListener('submit', handleAddUser);
}

function updateStats() {
    if (document.getElementById('stat-total')) document.getElementById('stat-total').textContent = users.length;
    if (document.getElementById('stat-meseros')) document.getElementById('stat-meseros').textContent = users.filter(u => u.role === 'Camarero' || u.role === 'Mesero').length;
    if (document.getElementById('stat-cajeros')) document.getElementById('stat-cajeros').textContent = users.filter(u => u.role === 'Cajero' || u.role === 'Anfitrión').length;
}

function renderUsers(list = users) {
    updateStats();

    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-6 text-[13px] text-[#8c827a]">No se encontraron usuarios.</td></tr>';
        return;
    }

    list.forEach(u => {
        const safeName = u.name ? String(u.name) : '';
        const initials = safeName ? safeName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

        // Pill logic matching the image exactly
        let rolePillSrc = '';
        if (u.role === 'Administrador') rolePillSrc = '<span class="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#edf2e0] text-[#556926]">Administrador</span>';
        else if (u.role === 'Mesero') rolePillSrc = '<span class="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#fcepe6] text-[#b34000]">Mesero</span>';
        else rolePillSrc = '<span class="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#f5f3f0] text-[#6b625b]">' + u.role + '</span>';

        // Simulating status
        const isPermiso = u.status === 'Inactivo' || u.status === 'Permiso';
        const statusHTML = isPermiso
            ? '<div class="flex items-center gap-1.5 text-[12px] text-[#8c827a]"><div class="w-1.5 h-1.5 rounded-full bg-[#8c827a]"></div>De Permiso</div>'
            : '<div class="flex items-center gap-1.5 text-[12px] text-[#556926]"><div class="w-1.5 h-1.5 rounded-full bg-[#556926]"></div>Activo</div>';

        // Simulating time
        let timeStr = "Hoy, 08:00 AM";

        const tr = document.createElement('tr');
        tr.className = "hover:bg-[#fbf9f4] transition-colors group";
        tr.innerHTML = `
            <td class="py-3 px-6">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-[#ebe6df] flex items-center justify-center text-[11px] font-bold text-[#6b625b] shrink-0 overflow-hidden">
                        ${u.id === 1 ? '<img src="https://i.pravatar.cc/150?u=sarah" class="w-full h-full object-cover">'
                : (u.id === 3 ? '<img src="https://i.pravatar.cc/150?u=david" class="w-full h-full object-cover">' : initials)}
                    </div>
                    <div class="min-w-0">
                        <p class="font-serif text-[14px] font-bold text-[#2d2a26] leading-tight truncate">${safeName}</p>
                        <p class="font-sans text-[11px] text-[#8c827a] truncate mt-0.5">${u.email}</p>
                    </div>
                </div>
            </td>
            <td class="py-3 px-6">
                ${rolePillSrc}
            </td>
            <td class="py-3 px-6">
                ${statusHTML}
            </td>
            <td class="py-3 px-6 text-[12px] text-[#6b625b]">
                ${timeStr}
            </td>
            <td class="py-3 px-6 text-right">
                <!-- Keep actions visually subtle initially, matching clean vibe of screenshot -->
                <button onclick="deleteUser(${u.id})" class="p-1 rounded text-[#8c827a] hover:text-[#dc2626] hover:bg-[#fef2f2] focus:outline-none transition-colors opacity-0 group-hover:opacity-100" title="Eliminar">
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function applyFiltersAndRender() {
    try {
        const searchInput = document.getElementById('search-user');
        const roleSelect = document.getElementById('filter-role');
        
        const term = searchInput ? searchInput.value.toLowerCase() : '';
        const role = roleSelect ? roleSelect.value : 'Todos los Roles';
        
        let filtered = users.filter(u => {
            const matchesSearch = !term || 
                (u.name && String(u.name).toLowerCase().includes(term)) || 
                (u.email && String(u.email).toLowerCase().includes(term));
            const matchesRole = role === 'Todos los Roles' || u.role === role;
            return matchesSearch && matchesRole;
        });

        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIdx = (currentPage - 1) * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        
        const paginated = filtered.slice(startIdx, endIdx);

        renderUsers(paginated);
        updatePaginationControls(totalItems, startIdx, Math.min(endIdx, totalItems), totalPages);
    } catch (err) {
        console.error("Error in applyFiltersAndRender:", err);
        const tbody = document.getElementById('users-tbody');
        if (tbody) tbody.innerHTML = `<tr><td colspan="5" class="text-red-500 py-4">Error filtering: ${err.message}</td></tr>`;
    }
}

function updatePaginationControls(totalItems, startIdx, endIdx, totalPages) {
    const entriesInfo = document.getElementById('entries-info');
    const paginationControls = document.getElementById('pagination-controls');
    
    if (entriesInfo) {
        if (totalItems === 0) {
            entriesInfo.textContent = 'Mostrando 0 a 0 de 0 entradas';
        } else {
            entriesInfo.textContent = `Mostrando ${startIdx + 1} a ${endIdx} de ${totalItems} entradas`;
        }
    }
    
    if (paginationControls) {
        paginationControls.innerHTML = '';
        
        // Prev button
        const prevBtn = document.createElement('button');
        prevBtn.className = `w-7 h-7 rounded border border-[#e6e2de] flex items-center justify-center transition ${currentPage === 1 ? 'text-[#d6d0cb] cursor-not-allowed' : 'text-[#8c827a] hover:bg-[#fcfaf8] cursor-pointer'}`;
        prevBtn.innerHTML = '&lsaquo;';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                applyFiltersAndRender();
            }
        });
        paginationControls.appendChild(prevBtn);
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            // Simplified logic to show all pages or dots if too many, but for now we'll just show up to 5 around current
            if (totalPages > 5) {
                if (i !== 1 && i !== totalPages && Math.abs(i - currentPage) > 1) {
                    if (i === 2 && currentPage > 3) {
                        const dots = document.createElement('span');
                        dots.className = 'w-7 h-7 flex items-center justify-center text-[#8c827a]';
                        dots.innerHTML = '...';
                        paginationControls.appendChild(dots);
                    } else if (i === totalPages - 1 && currentPage < totalPages - 2) {
                        const dots = document.createElement('span');
                        dots.className = 'w-7 h-7 flex items-center justify-center text-[#8c827a]';
                        dots.innerHTML = '...';
                        paginationControls.appendChild(dots);
                    }
                    continue;
                }
            }

            const pageBtn = document.createElement('button');
            if (i === currentPage) {
                pageBtn.className = 'w-7 h-7 rounded bg-[#b84a1e] text-white flex items-center justify-center font-bold shadow-sm';
            } else {
                pageBtn.className = 'w-7 h-7 rounded border border-[#e6e2de] flex items-center justify-center hover:bg-[#fcfaf8] transition text-[#6b625b]';
            }
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                applyFiltersAndRender();
            });
            paginationControls.appendChild(pageBtn);
        }
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = `w-7 h-7 rounded border border-[#e6e2de] flex items-center justify-center transition ${currentPage === totalPages ? 'text-[#d6d0cb] cursor-not-allowed' : 'text-[#8c827a] hover:bg-[#fcfaf8] cursor-pointer'}`;
        nextBtn.innerHTML = '&rsaquo;';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                applyFiltersAndRender();
            }
        });
        paginationControls.appendChild(nextBtn);
    }
}

function openModal() {
    document.getElementById('user-form').reset();
    document.getElementById('form-error').classList.add('hidden');
    document.getElementById('user-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('user-modal').classList.add('hidden');
}

async function handleAddUser(e) {
    e.preventDefault();
    const errorBox = document.getElementById('form-error');
    errorBox.classList.add('hidden');

    const name = document.getElementById('user-name').value.trim();
    const apellido = document.getElementById('user-apellido').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const pass = document.getElementById('user-password').value;
    const role = document.getElementById('user-role').value;
    const fecha_registro = new Date().toISOString();

    if (!name || !email || !pass || !role) {
        errorBox.textContent = "Todos los campos son obligatorios.";
        errorBox.classList.remove('hidden');
        return;
    }

    try {
        const { data, error } = await _supabase.from('usuario').insert([
            { nombre: name, apellido: apellido, email: email, contraseña: pass, rol: role, fecha_registro: fecha_registro }
        ]).select();

        if (error) throw error;

        closeModal();
        await fetchUsers(); // Refresh the list
    } catch (err) {
        errorBox.textContent = "Error al guardar el usuario en la base de datos.";
        errorBox.classList.remove('hidden');
        console.error(err);
    }
}

async function deleteUser(id) {
    if (confirm("¿Seguro que desea eliminar a este empleado?")) {
        try {
            await _supabase.from('usuario').delete().eq('id', id); // Warning: we don't know if PK is id or Id_usuario!
            // I'll try both to be safe
            await _supabase.from('usuario').delete().eq('Id_usuario', id);
            await fetchUsers();
        } catch (err) {
            console.error("Error deleting:", err);
        }
    }
}
