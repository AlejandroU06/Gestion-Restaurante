const SUPABASE_URL = 'https://mfylvijpbibacmpfwynv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1meWx2aWpwYmliYWNtcGZ3eW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODk2ODgsImV4cCI6MjA5Mjg2NTY4OH0.KqXfisr_OATVcnwnPBcJFNR9jFm3MUDLQOYKC1puHNI';
let _supabase;

if (typeof supabase !== 'undefined') {
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const btnSpinner = document.getElementById('btn-spinner');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const generalError = document.getElementById('general-error');
    const loginForm = document.getElementById('login-form');

    function clearErrors() {
        if (emailError) emailError.textContent = '', emailError.classList.add('hidden');
        if (passwordError) passwordError.textContent = '', passwordError.classList.add('hidden');
        if (generalError) generalError.textContent = '', generalError.classList.add('hidden');
    }

    function setLoader(loading) {
        if (loginBtn) {
            loginBtn.disabled = loading;
            if (loading) {
                if (btnText) btnText.textContent = 'Iniciando sesión...';
                if (btnIcon) btnIcon.classList.add('hidden');
                if (btnSpinner) btnSpinner.classList.remove('hidden');
            } else {
                if (btnText) btnText.textContent = 'Ingresar';
                if (btnIcon) btnIcon.classList.remove('hidden');
                if (btnSpinner) btnSpinner.classList.add('hidden');
            }
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();

            // Validar reCAPTCHA
            if (typeof grecaptcha !== 'undefined') {
                const captchaResponse = grecaptcha.getResponse();
                if (!captchaResponse) {
                    if (generalError) {
                        generalError.textContent = 'Por favor, completa el captcha "No soy un robot".';
                        generalError.classList.remove('hidden');
                    }
                    return;
                }
            }

            setLoader(true);

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                if (!_supabase) throw new Error('Supabase client not initialized');

                const { data, error } = await _supabase
                    .from('usuario')
                    .select('*')
                    .eq('email', email)
                    .eq('contraseña', password)
                    .maybeSingle();

                if (error) throw error;

                if (!data) {
                    if (generalError) {
                        generalError.textContent = 'Correo o contraseña incorrectos';
                        generalError.classList.remove('hidden');
                    }
                    setLoader(false);
                    return;
                }

                // Guardar sesión básica en localStorage
                localStorage.setItem('user', JSON.stringify(data));

                // Redirigir basado en rol
                if (data.rol === 'Administrativo' || data.role === 'Administrativo') {
                    window.location.href = '../Admin/dashboard.html';
                } else {
                    window.location.href = '../Cliente/home_cliente/code.html';
                }
            } catch (error) {
                console.error('Error:', error.message);
                if (generalError) {
                    generalError.textContent = 'Error de red o del servidor. Intente de nuevo.';
                    if (error.message.includes('fetch')) {
                        generalError.textContent = 'No se pudo conectar con el servidor. Verifique su conexión.';
                    }
                    generalError.classList.remove('hidden');
                }
                setLoader(false);
                if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
            }
        });
    }
});
