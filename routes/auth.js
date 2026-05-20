const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const Publicacion = require('../models/Publicacion');
const Imagen = require('../models/Imagen');
const sequelize = require('../db/sequelize');

router.get('/registro', authController.mostrarRegistro);
router.post('/registro', authController.registrar);
router.get('/login', authController.mostrarLogin);
router.post('/login', authController.login);

router.get('/home', async (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    try {
        const destacadas = await sequelize.query(`
            SELECT p.*, i.id_imagen, i.foto,
                   COALESCE(AVG(v.valoracion), 0) as promedio,
                   COUNT(v.id_voto) as total_votos
            FROM publicacion p
            JOIN publicacion_imagen pi ON p.id_publicacion = pi.id_publicacion
            JOIN imagen i ON pi.id_imagen = i.id_imagen
            LEFT JOIN voto v ON i.id_imagen = v.id_imagen
            WHERE p.estado = 'activo'
            GROUP BY p.id_publicacion, i.id_imagen
            HAVING AVG(v.valoracion) >= 4 AND COUNT(v.id_voto) >= 5
            ORDER BY promedio DESC
            LIMIT 10
        `, { type: sequelize.QueryTypes.SELECT });

        const recientes = await sequelize.query(`
            SELECT p.*, i.id_imagen, i.foto,
                   COALESCE(AVG(v.valoracion), 0) as promedio,
                   COUNT(v.id_voto) as total_votos
            FROM publicacion p
            JOIN publicacion_imagen pi ON p.id_publicacion = pi.id_publicacion
            JOIN imagen i ON pi.id_imagen = i.id_imagen
            LEFT JOIN voto v ON i.id_imagen = v.id_imagen
            WHERE p.estado = 'activo'
            GROUP BY p.id_publicacion, i.id_imagen
            ORDER BY p.fecha_publicacion DESC
            LIMIT 10
        `, { type: sequelize.QueryTypes.SELECT });

        const descubri = await sequelize.query(`
            SELECT p.*, i.id_imagen, i.foto,
                   COALESCE(AVG(v.valoracion), 0) as promedio,
                   COUNT(v.id_voto) as total_votos
            FROM publicacion p
            JOIN publicacion_imagen pi ON p.id_publicacion = pi.id_publicacion
            JOIN imagen i ON pi.id_imagen = i.id_imagen
            LEFT JOIN voto v ON i.id_imagen = v.id_imagen
            WHERE p.estado = 'activo'
            GROUP BY p.id_publicacion, i.id_imagen
            ORDER BY RANDOM()
            LIMIT 10
        `, { type: sequelize.QueryTypes.SELECT });

        res.render('home', {
            usuario: req.session.usuario,
            exito: req.query.exito,
            error: req.query.error,
            destacadas,
            recientes,
            descubri
        });

    } catch (error) {
        console.error(error);
        res.render('home', { usuario: req.session.usuario });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;