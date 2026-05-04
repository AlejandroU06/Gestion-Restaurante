import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Montar las rutas de autenticación
app.use('/api/auth', authRoutes);

// Ruta base para verificar que el servidor funciona
app.get('/', (req, res) => {
    res.send('BistroFlow Backend is running...');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
