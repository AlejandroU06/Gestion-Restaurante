const SUPABASE_URL = 'https://mfylvijpbibacmpfwynv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1meWx2aWpwYmliYWNtcGZ3eW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODk2ODgsImV4cCI6MjA5Mjg2NTY4OH0.KqXfisr_OATVcnwnPBcJFNR9jFm3MUDLQOYKC1puHNI';
let _supabase;

if (typeof supabase !== 'undefined') {
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

document.addEventListener('DOMContentLoaded', () => {
    const registerBtn = document.getElementById('register-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const btnSpinner = document.getElementById('btn-spinner');
    const registerForm = document.querySelector('form');

    const errors = {
        firstName: document.getElementById('first-name-error'),
        lastName: document.getElementById('last-name-error'),
        email: document.getElementById('email-error'),
        phone: document.getElementById('phone-error'),
        password: document.getElementById('password-error'),
        general: document.getElementById('general-error')
    };

    function clearErrors() {
        Object.values(errors).forEach(el => {
            if (el) {
                el.textContent = '';
                el.classList.add('hidden');
            }
        });
    }

    function setLoader(loading) {
        if (registerBtn) {
            registerBtn.disabled = loading;
            if (loading) {
                if (btnText) btnText.textContent = 'Creando cuenta...';
                if (btnIcon) btnIcon.classList.add('hidden');
                if (btnSpinner) btnSpinner.classList.remove('hidden');
            } else {
                if (btnText) btnText.textContent = 'Registrarse';
                if (btnIcon) btnIcon.classList.remove('hidden');
                if (btnSpinner) btnSpinner.classList.add('hidden');
            }
        }
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();
            setLoader(true);

            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;

            // Validación de longitud de contraseña
            if (password.length < 5) {
                if (errors.password) {
                    errors.password.textContent = 'La contraseña debe tener al menos 8 caracteres';
                    errors.password.classList.remove('hidden');
                }
                setLoader(false);
                return;
            }

            const fecha = new Date();
            const localISO = new Date(fecha.getTime() - (fecha.getTimezoneOffset() * 60000)).toISOString().slice(0, -1);

            try {
                if (!_supabase) throw new Error('Supabase client not initialized');

                // Verificar si el correo ya existe
                const { data: existingUser, error: checkError } = await _supabase
                    .from('usuario')
                    .select('email')
                    .eq('email', email)
                    .maybeSingle();

                if (checkError) throw checkError;
                if (existingUser) {
                    if (errors.email) {
                        errors.email.textContent = 'Este correo ya está registrado';
                        errors.email.classList.remove('hidden');
                    }
                    setLoader(false);
                    return;
                }

                const { data, error } = await _supabase
                    .from('usuario')
                    .insert([
                        {
                            nombre: firstName,
                            apellido: lastName,
                            email: email,
                            telefono: phone,
                            contraseña: password,
                            rol: 'Cliente',
                            fecha_registro: localISO
                        }
                    ]);

                if (error) throw error;

                // Redirigir al login
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Error:', error.message);
                let userMessage = 'Error al registrar: ' + error.message;

                // Manejar específicamente la violación de la restricción de contraseña
                if (error.message.includes('usuario_contraseña_check')) {
                    userMessage = 'La contraseña no cumple con los requisitos de seguridad de la base de datos (mínimo 8 caracteres).';
                    if (errors.password) {
                        errors.password.textContent = 'Intente con una contraseña más larga o compleja.';
                        errors.password.classList.remove('hidden');
                    }
                } else if (error.message.includes('fetch')) {
                    userMessage = 'Error de conexión. Verifique su internet.';
                }

                if (errors.general) {
                    errors.general.textContent = userMessage;
                    errors.general.classList.remove('hidden');
                }
                setLoader(false);
            }
        });
    }
});
