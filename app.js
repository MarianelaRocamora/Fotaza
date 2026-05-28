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

// ─── Middlewares ─────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'fotaza2secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// ─── Rutas ───────────────────────────────────────────────
const authRoutes       = require('./routes/auth');
const publicacionRoutes = require('./routes/publicacion');
const votoRoutes       = require('./routes/voto');
const comentarioRoutes = require('./routes/comentario');
const perfilRoutes     = require('./routes/perfil');
const { manejarErrorMulter } = require('./controllers/publicacionController');
const busquedaRoutes = require('./routes/busqueda');
const imagenRoutes = require('./routes/imagen');


app.use('/', imagenRoutes);
app.use('/', busquedaRoutes);
app.use('/', authRoutes);
app.use('/', publicacionRoutes);
app.use('/', votoRoutes);
app.use('/', comentarioRoutes);
app.use('/', perfilRoutes);
app.use(manejarErrorMulter);

// ─── Ruta raíz ───────────────────────────────────────────
app.get('/', (req, res) => {
    if (req.session.usuario) {
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

// ─── Servidor ────────────────────────────────────────────
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