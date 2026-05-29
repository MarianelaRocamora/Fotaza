const express = require('express');
const session = require('express-session');
const path = require('path');
const sequelize = require('./db/sequelize');
require('dotenv').config();
require('./models/asociaciones');

const app = express();

// ─── Motor de vistas ─────────────────────────────────────
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ─── Middlewares globales ─────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'fotaza2secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// ─── Middleware de autenticación ──────────────────────────
const { soloRegistrados } = require('./middlewares/auth');

// ─── Importar rutas ───────────────────────────────────────
const authRoutes        = require('./routes/auth');
const publicacionRoutes = require('./routes/publicacion');
const votoRoutes        = require('./routes/voto');
const comentarioRoutes  = require('./routes/comentario');
const perfilRoutes      = require('./routes/perfil');
const busquedaRoutes    = require('./routes/busqueda');
const imagenRoutes      = require('./routes/imagen');
const { manejarErrorMulter } = require('./controllers/publicacionController');

// ─── Rutas públicas (anónimos permitidos) ─────────────────
app.use('/', authRoutes);       // login, registro, logout, home
app.use('/', imagenRoutes);     // ver imágenes
app.use('/', busquedaRoutes);   // buscar publicaciones
app.use('/', perfilRoutes);

// ─── Rutas protegidas (solo usuarios registrados) ─────────
app.use('/publicacion', soloRegistrados, publicacionRoutes);
app.use('/votar',       soloRegistrados, votoRoutes);
app.use('/comentar',    soloRegistrados, comentarioRoutes);


// ─── Manejo de errores de Multer ──────────────────────────
app.use(manejarErrorMulter);

// ─── Ruta raíz ────────────────────────────────────────────
app.get('/', (req, res) => {
    res.redirect('/home');
});

// ─── Servidor ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
sequelize.authenticate()
    .then(() => {
        console.log('Conectado a PostgreSQL ✅');
        app.listen(PORT, () => {
            console.log(`Servidor en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error conectando a la BD:', err);
    });