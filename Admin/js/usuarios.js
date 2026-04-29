let users = [
    {
        id: 1,
        name: "Sarah Jenkins",
        email: "sarah.j@bistroflow.com",
        role: "Cajero",
        registeredAt: "2023-10-12"
    },
    {
        id: 2,
        name: "Marcus Chen",
        email: "marcus.c@bistroflow.com",
        role: "Mesero",
        registeredAt: "2024-01-05"
    },
    {
        id: 3,
        name: "David Rossi",
        email: "david.r@bistroflow.com",
        role: "Mesero",
        registeredAt: "2024-03-15"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    renderUsers();
    setupEventListeners();
});

function setupEventListeners() {
    // Search filter
    const searchInput = document.getElementById('search-user');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = users.filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
        renderUsers(filtered);
    });

    // Modal controls
    const btnAdd = document.getElementById('btn-add-user');
    const btnClose = document.getElementById('close-user-modal');
    const btnCancel = document.getElementById('cancel-user-modal');
    const form = document.getElementById('user-form');

    btnAdd.addEventListener('click', openModal);
    btnClose.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);
    form.addEventListener('submit', handleAddUser);
}

function updateStats() {
    document.getElementById('stat-total').textContent = users.length;
    document.getElementById('stat-meseros').textContent = users.filter(u => u.role === 'Mesero').length;
    document.getElementById('stat-cajeros').textContent = users.filter(u => u.role === 'Cajero').length;
}

function renderUsers(list = users) {
    updateStats();
    
    const tbody = document.getElementById('users-tbody');
    tbody.innerHTML = '';
    
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-6 text-on-surface-variant">No se encontraron usuarios.</td></tr>';
        return;
    }

    list.forEach(u => {
        // Pill logic matching the image exactly
        let rolePillSrc = '';
        if(u.role === 'Gerente') rolePillSrc = '<span class="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#edf2e0] text-[#556926]">Gerente</span>';
        else if (u.role === 'Camarero') rolePillSrc = '<span class="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#fcepe6] text-[#b34000]">Camarero</span>';
        else rolePillSrc = '<span class="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#f5f3f0] text-[#6b625b]">' + u.role + '</span>';
        
        // Simulating status
        const isPermiso = u.registeredAt === '2024-03-15'; 
        const statusHTML = isPermiso 
            ? '<div class="flex items-center gap-1.5 text-[12px] text-[#8c827a]"><div class="w-1.5 h-1.5 rounded-full bg-[#8c827a]"></div>De Permiso</div>'
            : '<div class="flex items-center gap-1.5 text-[12px] text-[#556926]"><div class="w-1.5 h-1.5 rounded-full bg-[#556926]"></div>Activo</div>';
            
        // Simulating time
        let timeStr = "Hoy, 08:00 AM";
        if(u.id === 2) timeStr = "Ayer, 16:00";
        if(isPermiso) timeStr = "12 Oct, 2023";

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
                        <p class="font-serif text-[14px] font-bold text-[#2d2a26] leading-tight truncate">${u.name}</p>
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

function openModal() {
    document.getElementById('user-form').reset();
    document.getElementById('form-error').classList.add('hidden');
    document.getElementById('user-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('user-modal').classList.add('hidden');
}

function handleAddUser(e) {
    e.preventDefault();
    const errorBox = document.getElementById('form-error');
    errorBox.classList.add('hidden');

    const name = document.getElementById('user-name').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const pass = document.getElementById('user-password').value;
    const role = document.getElementById('user-role').value;

    if (!name || !email || !pass || !role) {
        errorBox.textContent = "Todos los campos son obligatorios.";
        errorBox.classList.remove('hidden');
        return;
    }

    if (role !== 'Cajero' && role !== 'Mesero') {
        errorBox.textContent = "Rol inválido. Debe ser Cajero o Mesero.";
        errorBox.classList.remove('hidden');
        return;
    }
    
    // Simulate current date
    const today = new Date().toISOString().split('T')[0];
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    users.push({
        id: newId,
        name,
        email,
        role,
        registeredAt: today
    });

    closeModal();
    // Dispatch input to render correctly with active search
    document.getElementById('search-user').dispatchEvent(new Event('input'));
}

function deleteUser(id) {
    if (confirm("¿Seguro que desea eliminar a este empleado?")) {
        users = users.filter(u => u.id !== id);
        document.getElementById('search-user').dispatchEvent(new Event('input'));
    }
}