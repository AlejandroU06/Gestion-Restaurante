import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Lógica para el inicio de sesión y generación de JWT.
 * IMPORTANTE: Nunca incluyas datos sensibles como contraseñas o números de tarjeta en el payload.
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

    // --- Simulación de validación de usuario ---
    // En una app real, aquí buscarías el usuario en la DB y validarías el password con bcrypt
    if (email === "admin@bistroflow.com" && password === "admin123") {
        const userFound = {
            id: "user_001",
            email: "admin@bistroflow.com",
            role: "Administrativo"
        };

        // 1. Generar el payload (sin datos sensibles)
        const payload = {
            userId: userFound.id,
            email: userFound.email,
            role: userFound.role
        };

        // 2. Generar el JWT
        // Se utiliza la clave secreta de variables de entorno y expira en 1 hora
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            message: 'Login exitoso',
            token: token,
            user: payload
        });
    }

    // Si las credenciales no coinciden
    return res.status(401).json({
        message: 'Credenciales inválidas'
    });
};
