const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const { QueryTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Comentario = require('../models/Comentario');
const Usuario2 = require('../models/Usuario');

const mostrarRegistro = (req, res) => {
    res.render('registro');
};

const registrar = async (req, res) => {
    const { nombre, apellido, correo, contrasena, sexo, fecha_nacimiento, bio } = req.body;
    try {
        const existe = await Usuario.findOne({ where: { correo } });
        if (existe) {
            return res.render('registro', { error: 'El correo ya está registrado' });
        }
        const hash = await bcrypt.hash(contrasena, 10);
        await Usuario.create({
            nombre,
            apellido,
            correo,
            contrasena: hash,
            sexo: sexo || null,
            fecha_nacimiento: fecha_nacimiento || null,
            bio: bio || null,
            estado: 'activo',
            fecha_creacion: new Date()
        });
        res.redirect('/login?exito=1');
    } catch (error) {
        console.error(error);
        res.render('registro', { error: 'Error al registrar usuario' });
    }
};

const mostrarLogin = (req, res) => {
    res.render('login', {
        exito: req.query.exito,
        error: req.query.error
    });
};

const login = async (req, res) => {
    const { correo, contrasena } = req.body;
    try {
        const usuario = await Usuario.findOne({ where: { correo } });
        if (!usuario) {
            return res.render('login', { error: 'Correo o contraseña incorrectos' });
        }
        const valido = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!valido) {
            return res.render('login', { error: 'Correo o contraseña incorrectos' });
        }
        req.session.usuario = {
            id: usuario.id_usuario,
            nombre: usuario.nombre,
            es_moderador: usuario.es_moderador
        };
        res.redirect('/home');
    } catch (error) {
        console.error(error);
        res.render('login', { error: 'Error al iniciar sesión' });
    }
};

// ─── Helper: agrega comentarios a cada publicación ──────
const agregarComentarios = async (pubs) => {
    if (!pubs.length) return pubs;

    const idImagenes = pubs.map(p => p.id_imagen);
    const comentarios = await Comentario.findAll({
        where: { id_imagen: idImagenes, estado: 'activo' },
        include: [{ model: Usuario, as: 'comentador', attributes: ['nombre'] }],
        order: [['fecha_comentario', 'ASC']]
    });

    return pubs.map(pub => ({
        ...pub,
        comentarios: comentarios.filter(c => parseInt(c.id_imagen, 10) === parseInt(pub.id_imagen, 10))
    }));
};

// ─── Helper: query base del home ────────────────────────
const queryHome = async (orden, having = '') => {
    const pubs = await sequelize.query(`
        SELECT p.id_publicacion, p.titulo,p.descripcion ,i.id_imagen, i.foto,
               i.comentario_clausurado,
               COALESCE(AVG(v.valoracion), 0) AS promedio,
               COUNT(v.id_voto) AS total_votos
        FROM publicacion p
        JOIN imagen i ON i.id_publicacion = p.id_publicacion
        LEFT JOIN voto v ON i.id_imagen = v.id_imagen
        WHERE p.estado = 'activo'
        GROUP BY p.id_publicacion, i.id_imagen
        ${having}
        ORDER BY ${orden}
        LIMIT 10
    `, { type: QueryTypes.SELECT });

    return agregarComentarios(pubs);
};

// ─── Home ────────────────────────────────────────────────
const home = async (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');

    try {
        const destacadas = await queryHome(
            'promedio DESC',
            'HAVING AVG(v.valoracion) >= 4 AND COUNT(v.id_voto) >= 5'
        );
        const recientes = await queryHome('p.fecha_publicacion DESC');
        const descubri  = await queryHome('RANDOM()');

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
};

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};

module.exports = { mostrarRegistro, registrar, mostrarLogin, login, home, logout };