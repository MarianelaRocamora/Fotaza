const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const { QueryTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Comentario = require('../models/Comentario');
const Imagen = require('../models/Imagen');
const { imagenesASrc } = require('../utils/imagenHelper');

const mostrarRegistro = (req, res) => {
    res.render('registro');
};

const registrar = async (req, res) => {
    const { nombre, apellido, correo, contrasena, confirmar, sexo, fecha_nacimiento, bio } = req.body;

    // ─── Validaciones ────────────────────────────────────
    if (!contrasena || contrasena.trim() === '') {
        return res.render('registro', { error: 'La contraseña es obligatoria' });
    }
    if (contrasena.length < 6) {
        return res.render('registro', { error: 'La contraseña debe tener al menos 6 caracteres' });
    }

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

// ─── Helper: agrega comentarios a cada imagen ────────────
const agregarComentariosAImagenes = async (imagenes) => {
    if (!imagenes.length) return imagenes;
    const idImagenes = imagenes.map(i => i.id_imagen);
    const comentarios = await Comentario.findAll({
        where: { id_imagen: idImagenes, estado: 'activo' },
        include: [{ model: Usuario, as: 'comentador', attributes: ['nombre'] }],
        order: [['fecha_comentario', 'ASC']]
    });
    return imagenes.map(img => ({
        ...img,
        comentarios: comentarios.filter(c => parseInt(c.id_imagen) === parseInt(img.id_imagen))
    }));
};

// ─── Helper: query publicaciones agrupadas ───────────────
const queryPublicaciones = async (extraWhere = '', having = '', params = {}, soloPublico = false, limit = 10) => {
    const filtroLicencia = soloPublico ? `AND i.licencia = 'sin_copyright'` : '';

    const pubs = await sequelize.query(`
        SELECT 
            p.id_publicacion, p.titulo, p.descripcion, p.fecha_publicacion,
            u.id_usuario, u.nombre AS nombre_autor, u.apellido AS apellido_autor,
            COALESCE(AVG(v.valoracion), 0) AS promedio,
            COUNT(DISTINCT v.id_voto) AS total_votos,
            STRING_AGG(DISTINCT e.nombre_etiqueta, ', ') AS etiquetas
        FROM publicacion p
        JOIN usuario u ON p.id_creador = u.id_usuario
        LEFT JOIN imagen i ON i.id_publicacion = p.id_publicacion
        LEFT JOIN voto v ON v.id_imagen = i.id_imagen
        LEFT JOIN publicacion_etiqueta pe ON pe.id_publicacion = p.id_publicacion
        LEFT JOIN etiqueta e ON e.id_etiqueta = pe.id_etiqueta
        WHERE p.estado = 'activo' ${filtroLicencia} ${extraWhere}
        GROUP BY p.id_publicacion, u.id_usuario, u.nombre, u.apellido
        ${having}
        ORDER BY ${params.orden}
        LIMIT ${limit}
    `, { replacements: params, type: QueryTypes.SELECT });

    if (!pubs.length) return [];

    const pubsCompletas = await Promise.all(pubs.map(async (pub) => {
        const imagenesRaw = await Imagen.findAll({
            where: { id_publicacion: pub.id_publicacion },
            order: [['fecha_subida', 'ASC']]
        });
        const imagenes = imagenesASrc(imagenesRaw);
        const imagenesConComentarios = await agregarComentariosAImagenes(imagenes);
        return { ...pub, imagenes: imagenesConComentarios };
    }));

    return pubsCompletas;
};

// ─── Home ────────────────────────────────────────────────
const home = async (req, res) => {
    const esAnonimo = !req.session.usuario;
    const soloPublico = esAnonimo;

    try {
        const destacadas = await queryPublicaciones(
            '',
            'HAVING AVG(v.valoracion) >= 4 AND COUNT(DISTINCT v.id_voto) >= 5',
            { orden: 'promedio DESC' },
            soloPublico
        );
        const recientes = await queryPublicaciones('', '', { orden: 'p.fecha_publicacion DESC' }, soloPublico);
        const descubri = await queryPublicaciones('', '', { orden: 'RANDOM()' }, soloPublico);

        let siguiendo = [];
        if (!esAnonimo) {
            siguiendo = await queryPublicaciones(
                'AND p.id_creador IN (SELECT id_usuario FROM usuario_seguidor WHERE id_seguidor = :idUsuario)',
                '',
                { orden: 'p.fecha_publicacion DESC', idUsuario: req.session.usuario.id },
                false
            );
        }

        res.render('home', {
            usuario: req.session.usuario || null,
            esAnonimo,
            exito: req.query.exito,
            error: req.query.error,
            destacadas,
            recientes,
            descubri,
            siguiendo
        });

    } catch (error) {
        console.error(error);
        res.render('home', { usuario: req.session.usuario || null, esAnonimo: true });
    }
};

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};

module.exports = { mostrarRegistro, registrar, mostrarLogin, login, home, logout };