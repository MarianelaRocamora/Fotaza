const express = require('express');
const session = require('express-session');
const path = require('path');
const sequelize = require('./db/sequelize');
require('dotenv').config();
require('./models/asociaciones');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'fotaza2secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

const publicacionRoutes = require('./routes/publicacion');
app.use('/', publicacionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Fotaza funcionando ✅');
});

// Sincronizar BD y arrancar servidor
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