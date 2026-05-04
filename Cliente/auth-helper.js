/**
 * auth-helper.js
 * Centraliza la validación de sesión y utilidades de autenticación para el área de Clientes.
 */

(function () {
    const userData = JSON.parse(localStorage.getItem('user'));

    // 1. Verificación de ruta para evitar bucles de redirección
    const isLoginPage = window.location.pathname.includes('/login/');

    if (!userData && !isLoginPage) {
        console.warn('Sesión no encontrada. Redirigiendo al login...');
        // Ajustamos la ruta según la profundidad de la carpeta actual
        const depth = window.location.pathname.split('/').length;
        let redirectPath = '../../login/login.html';
        
        // Si estamos en una subcarpeta de Cliente (ej. Cliente/home_cliente/)
        if (window.location.pathname.includes('/Cliente/')) {
            redirectPath = '../../login/login.html';
        }

        window.location.href = redirectPath;
        return;
    }

    // 2. Lógica de saludo si el usuario existe
    document.addEventListener('DOMContentLoaded', () => {
        if (userData && userData.nombre) {
            const userNameElements = document.querySelectorAll('#user-name');
            userNameElements.forEach(el => {
                el.textContent = userData.nombre;
            });
        }

        // 3. Configurar botón de logout si existe
        const logoutBtn = document.getElementById('logout-button');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    });

    /**
     * Limpia la sesión y redirige al inicio/login
     */
    window.logout = function () {
        localStorage.removeItem('user');
        // También limpiamos el carrito si se desea una sesión limpia
        // localStorage.removeItem('bistroFlowCart'); 
        window.location.href = '../../index.html';
    };

})();
