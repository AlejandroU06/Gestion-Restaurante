import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware para verificar la validez del token JWT.
 * Extrae el token del header Authorization (Bearer).
 */
export const verifyToken = (req, res, next) => {
    // 1. Obtener el header Authorization
    const authHeader = req.headers['authorization'];
    
    // 2. Extraer el token (formato: Bearer <token>)
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            error: 'Acceso denegado', 
            message: 'No se proporcionó un token de autenticación.' 
        });
    }

    // 3. Validar el token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Manejo de errores específicos según la guía de estudio
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    error: 'Token expirado', 
                    message: 'Tu sesión ha expirado, por favor inicia sesión nuevamente.' 
                });
            }
            
            // Tokens inválidos o alterados
            return res.status(403).json({ 
                error: 'Token inválido', 
                message: 'El token proporcionado no es válido o ha sido alterado.' 
            });
        }

        // 4. Guardar los datos decodificados en req.user
        // El payload contiene: userId, email, role
        req.user = decoded;
        
        // Continuar a la siguiente función/ruta
        next();
    });
};
