const Usuario = require('../models/Usuario');
const Publicacion = require('../models/Publicacion');
const Imagen = require('../models/Imagen');
const { imagenesASrc } = require('../utils/imagenHelper');
const UsuarioSeguidor = require('../models/UsuarioSeguidor');
const { QueryTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Comentario = require('../models/Comentario');

// ─── Helper: agrega comentarios a cada imagen ────────────
const agregarComentariosAImagenes = async (imagenes) => {
    if (!imagenes.length) return imagenes;
    const idImagenes = imagenes.map(i => i.id_imagen);
    const comentarios = await Comentario.findAll({
        where: { id_imagen: idImagenes, estado: 'activo' },
        order: [['fecha_comentario', 'ASC']],
        include: [{ model: Usuario, as: 'comentador', attributes: ['nombre'] }]
    });
    return imagenes.map(img => ({
        ...img.toJSON ? img.toJSON() : img,
        comentarios: comentarios.filter(c => parseInt(c.id_imagen) === parseInt(img.id_imagen))
    }));
};

// ─── Helper: armar publicaciones con imágenes agrupadas ──
const armarPublicaciones = async (idCreador) => {
    const pubs = await sequelize.query(`
        SELECT 
            p.id_publicacion, p.titulo, p.descripcion, p.fecha_publicacion,
            COALESCE(AVG(v.valoracion), 0) AS promedio,
            COUNT(DISTINCT v.id_voto) AS total_votos,
            STRING_AGG(DISTINCT e.nombre_etiqueta, ', ') AS etiquetas
        FROM publicacion p
        LEFT JOIN imagen i ON i.id_publicacion = p.id_publicacion
        LEFT JOIN voto v ON v.id_imagen = i.id_imagen
        LEFT JOIN publicacion_etiqueta pe ON pe.id_publicacion = p.id_publicacion
        LEFT JOIN etiqueta e ON e.id_etiqueta = pe.id_etiqueta
        WHERE p.id_creador = :idCreador AND p.estado = 'activo'
        GROUP BY p.id_publicacion
        ORDER BY p.fecha_publicacion DESC
    `, { replacements: { idCreador }, type: QueryTypes.SELECT });

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

// ─── Ver perfil ──────────────────────────────────────────
const verPerfil = async (req, res) => {
    const idPerfil = parseInt(req.params.id, 10);
    const idSesion = req.session.usuario ? parseInt(req.session.usuario.id, 10) : null;

    try {
        const usuario = await Usuario.findByPk(idPerfil, {
            attributes: ['id_usuario', 'nombre', 'apellido', 'bio', 'avatar', 'fecha_creacion']
        });

        if (!usuario) return res.redirect('/home?error=Usuario no encontrado');

        const publicaciones = await armarPublicaciones(idPerfil);

        // ─── Conteos ─────────────────────────────────────
        const totalSeguidores = await UsuarioSeguidor.count({ where: { id_usuario: idPerfil } });
        const totalSeguidos   = await UsuarioSeguidor.count({ where: { id_seguidor: idPerfil } });

        // ─── Listas con nombre y apellido para mostrar ───
        const listaSeguidores = await sequelize.query(`
            SELECT u.id_usuario, u.nombre, u.apellido
            FROM usuario_seguidor us
            JOIN usuario u ON u.id_usuario = us.id_seguidor
            WHERE us.id_usuario = :idPerfil
            ORDER BY u.nombre ASC
        `, { replacements: { idPerfil }, type: QueryTypes.SELECT });

        const listaSeguidos = await sequelize.query(`
            SELECT u.id_usuario, u.nombre, u.apellido
            FROM usuario_seguidor us
            JOIN usuario u ON u.id_usuario = us.id_usuario
            WHERE us.id_seguidor = :idPerfil
            ORDER BY u.nombre ASC
        `, { replacements: { idPerfil }, type: QueryTypes.SELECT });

        const yaSigue = idSesion ? await UsuarioSeguidor.findOne({
            where: { id_usuario: idPerfil, id_seguidor: idSesion }
        }) : false;

        const esPropioPerfil = idSesion === idPerfil;

        res.render('perfil', {
            usuario: req.session.usuario || null,
            perfil: usuario,
            publicaciones,
            totalSeguidores,
            totalSeguidos,
            listaSeguidores,
            listaSeguidos,
            yaSigue: !!yaSigue,
            esPropioPerfil
        });

    } catch (error) {
        console.error(error);
        res.redirect('/home?error=Error al cargar el perfil');
    }
};

// ─── Seguir usuario ──────────────────────────────────────
const seguir = async (req, res) => {
    const idUsuario  = parseInt(req.params.id, 10);
    const idSeguidor = parseInt(req.session.usuario.id, 10);

    if (idUsuario === idSeguidor)
        return res.redirect(`/perfil/${idUsuario}?error=No podés seguirte a vos mismo`);

    try {
        const yaExiste = await UsuarioSeguidor.findOne({
            where: { id_usuario: idUsuario, id_seguidor: idSeguidor }
        });
        if (yaExiste)
            return res.redirect(`/perfil/${idUsuario}?error=Ya seguís a este usuario`);

        await UsuarioSeguidor.create({ id_usuario: idUsuario, id_seguidor: idSeguidor });
        res.redirect(`/perfil/${idUsuario}?exito=Ahora seguís a este usuario`);
    } catch (error) {
        console.error(error);
        res.redirect(`/perfil/${idUsuario}?error=Error al seguir usuario`);
    }
};

// ─── Dejar de seguir ─────────────────────────────────────
const dejarDeSeguir = async (req, res) => {
    const idUsuario  = parseInt(req.params.id, 10);
    const idSeguidor = parseInt(req.session.usuario.id, 10);

    try {
        await UsuarioSeguidor.destroy({
            where: { id_usuario: idUsuario, id_seguidor: idSeguidor }
        });
        res.redirect(`/perfil/${idUsuario}?exito=Dejaste de seguir a este usuario`);
    } catch (error) {
        console.error(error);
        res.redirect(`/perfil/${idUsuario}?error=Error al dejar de seguir`);
    }
};

module.exports = { verPerfil, seguir, dejarDeSeguir };