import express from 'express';
import { login } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Ruta de login (Pública)
router.post('/login', login);

// Ruta protegida de ejemplo (Privada)
router.get('/perfil', verifyToken, (req, res) => {
    // Si llega aquí, es porque el token es válido y req.user está disponible
    res.status(200).json({
        message: 'Acceso concedido al perfil',
        user: req.user
    });
});

export default router;
