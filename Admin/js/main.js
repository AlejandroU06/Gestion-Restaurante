class LayoutManager {
    constructor() {
        this.sidebarHTML = `
            <nav class="hidden md:flex flex-col h-screen w-64 border-r border-[#e6e2de] bg-white py-6 fixed left-0 top-0 z-40">
                <div class="px-6 mb-7 flex items-center gap-3">
                    <div class="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-[#8c3022] flex items-center justify-center text-white shadow-sm">
                        <span class="material-symbols-outlined font-bold text-[22px]">restaurant</span>
                    </div>
                    <div>
                        <h1 class="font-serif text-[17px] font-bold text-[#2d2a26] leading-tight">Gestión de Bistro</h1>
                        <p class="font-sans text-[11px] font-bold text-[#6b625b] mt-0.5">Portal de Administrador</p>
                    </div>
                </div>
                
                <div class="px-5 mb-8">
                    <button class="w-full bg-[#c05621] hover:bg-[#a64a1c] text-white flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-[13px] shadow-sm transition-colors">
                        <span class="material-symbols-outlined text-[18px] font-bold">add</span>
                        Nuevo Pedido
                    </button>
                </div>

                <div class="flex-1 flex flex-col gap-1 overflow-y-auto" id="nav-links">
                    <a class="flex items-center gap-4 py-3 pl-6 mr-0 rounded-l-2xl text-[#6b625b] hover:bg-[#f5f0e6] transition-colors relative group ml-2" href="dashboard.html" data-page="dashboard.html">
                        <span class="material-symbols-outlined text-[20px] group-hover:text-[#c05621] transition-colors">dashboard</span>
                        <span class="font-sans text-[14px] font-medium">Dashboard</span>
                    </a>
                    <a class="flex items-center gap-4 py-3 pl-6 mr-0 rounded-l-2xl text-[#6b625b] hover:bg-[#f5f0e6] transition-colors relative group ml-2" href="productos.html" data-page="productos.html">
                        <span class="material-symbols-outlined text-[20px] group-hover:text-[#c05621] transition-colors">inventory_2</span>
                        <span class="font-sans text-[14px] font-medium">Productos</span>
                    </a>
                    <a class="flex items-center gap-4 py-3 pl-6 mr-0 rounded-l-2xl text-[#6b625b] hover:bg-[#f5f0e6] transition-colors relative group ml-2" href="#" data-page="categorias.html">
                        <span class="material-symbols-outlined text-[20px] group-hover:text-[#c05621] transition-colors">category</span>
                        <span class="font-sans text-[14px] font-medium">Categorías</span>
                    </a>
                    <a class="flex items-center gap-4 py-3 pl-6 mr-0 rounded-l-2xl text-[#6b625b] hover:bg-[#f5f0e6] transition-colors relative group ml-2" href="usuarios.html" data-page="usuarios.html">
                        <span class="material-symbols-outlined text-[20px] group-hover:text-[#c05621] transition-colors">groups</span>
                        <span class="font-sans text-[14px] font-medium">Usuarios</span>
                    </a>
                </div>

                <div class="mt-auto pt-6 border-t border-[#e6e2de] flex flex-col gap-1 px-4">
                    <a class="flex items-center gap-3 px-4 py-2 mx-2 rounded-lg text-[#6b625b] hover:bg-[#f5f0e6] transition-colors" href="#">
                        <span class="material-symbols-outlined text-[20px]">settings</span>
                        <span class="font-sans text-[13px] font-medium">Configuración</span>
                    </a>
                    <a class="flex items-center gap-3 px-4 py-2 mx-2 rounded-lg text-[#6b625b] hover:bg-[#f5f0e6] transition-colors" href="#">
                        <span class="material-symbols-outlined text-[20px]">help</span>
                        <span class="font-sans text-[13px] font-medium">Soporte</span>
                    </a>
                </div>
            </nav>
        `;
    }

    init() {
        this.renderSidebar();
        this.highlightActiveLink();
        this.setupMobileMenu();
    }

    renderSidebar() {
        const container = document.getElementById('sidebar-container');
        if (container) {
            container.innerHTML = this.sidebarHTML;
        }
    }

    highlightActiveLink() {
        const path = window.location.pathname;
        const page = path.split("/").pop();
        const links = document.querySelectorAll('#nav-links a');
        
        links.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (page === linkPage || (page === '' && linkPage === 'dashboard.html')) {
                link.classList.remove('text-[#6b625b]', 'hover:bg-[#f5f0e6]');
                // Pill perfectly adhering to the right border edge with light background
                link.classList.add('text-[#c05621]', 'font-bold', 'bg-[#fff6ef]', 'shadow-[0_1px_3px_rgba(192,86,33,0.05)]');
                
                const indicator = document.createElement('div');
                // Absolute positioning, sticks precisely on the right edge spanning full height
                indicator.className = "absolute right-0 top-0 bottom-0 w-1 bg-[#c05621] rounded-l-full shadow-sm";
                link.appendChild(indicator);
                
                const icon = link.querySelector('.material-symbols-outlined');
                if (icon) {
                    icon.classList.add('text-[#c05621]');
                    icon.style.fontVariationSettings = "'FILL' 1";
                }
            }
        });
    }

    setupMobileMenu() {
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const nav = document.querySelector('nav');
        
        if (mobileBtn && nav) {
            mobileBtn.addEventListener('click', () => {
                nav.classList.toggle('hidden');
                nav.classList.toggle('flex');
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const layout = new LayoutManager();
    layout.init();
});
