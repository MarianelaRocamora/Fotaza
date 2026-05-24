const Usuario = require('../models/Usuario');
const Publicacion = require('../models/Publicacion');
const Imagen = require('../models/Imagen');
const UsuarioSeguidor = require('../models/UsuarioSeguidor');
const { QueryTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Comentario = require('../models/Comentario');

//agregar comentarios a publicaciones
const agregarComentarios = async (pubs) => {
    if (!pubs.length) return pubs;

    const idImagenes = pubs.map(p => p.id_imagen);
    const comentarios = await Comentario.findAll({
        where: { id_imagen: idImagenes, estado: 'activo' },
        order: [['fecha_comentario', 'ASC']],
        include: [{ model: Usuario, as: 'comentador', attributes: ['nombre'] }]
    });

    return pubs.map(pub => ({
        ...pub,
        comentarios: comentarios.filter(c => parseInt(c.id_imagen, 10) === parseInt(pub.id_imagen, 10))
    }));
};

// Ver perfil
const verPerfil = async (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');

    const idPerfil = parseInt(req.params.id, 10);
    const idSesion = parseInt(req.session.usuario.id, 10);

    try {
        const usuario = await Usuario.findByPk(idPerfil, {
            attributes: ['id_usuario', 'nombre', 'apellido', 'bio', 'avatar', 'fecha_creacion']
        });

        if (!usuario) return res.redirect('/home?error=Usuario no encontrado');

        // Publicaciones del usuario con sus imágenes
        let publicaciones = await sequelize.query(`
            SELECT p.id_publicacion, p.titulo, p.descripcion, p.fecha_publicacion,
                i.id_imagen, i.foto,
                COALESCE(AVG(v.valoracion), 0) AS promedio,
                COUNT(v.id_voto) AS total_votos
            FROM publicacion p
            JOIN imagen i ON i.id_publicacion = p.id_publicacion
            LEFT JOIN voto v ON i.id_imagen = v.id_imagen
            WHERE p.id_creador = :idPerfil AND p.estado = 'activo'
            GROUP BY p.id_publicacion, i.id_imagen
            ORDER BY p.fecha_publicacion DESC
        `, {
            replacements: { idPerfil },
            type: QueryTypes.SELECT
        });
        publicaciones = await agregarComentarios(publicaciones);

        // Cantidad de seguidores y seguidos
        const totalSeguidores = await UsuarioSeguidor.count({
            where: { id_usuario: idPerfil }
        });

        const totalSeguidos = await UsuarioSeguidor.count({
            where: { id_seguidor: idPerfil }
        });

        // ¿El usuario logueado ya sigue a este perfil?
        const yaSigue = await UsuarioSeguidor.findOne({
            where: { id_usuario: idPerfil, id_seguidor: idSesion }
        });

        const esPropioPerfil = idPerfil === idSesion;

        res.render('perfil', {
            usuario: req.session.usuario,
            perfil: usuario,
            publicaciones,
            totalSeguidores,
            totalSeguidos,
            yaSigue: !!yaSigue,
            esPropioPerfil
        });

    } catch (error) {
        console.error(error);
        res.redirect('/home?error=Error al cargar el perfil');
    }
};

// Seguir usuario
const seguir = async (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');

    const idUsuario = parseInt(req.params.id, 10);
    const idSeguidor = parseInt(req.session.usuario.id, 10);

    if (idUsuario === idSeguidor) {
        return res.redirect(`/perfil/${idUsuario}?error=No podés seguirte a vos mismo`);
    }

    try {
        const yaExiste = await UsuarioSeguidor.findOne({
            where: { id_usuario: idUsuario, id_seguidor: idSeguidor }
        });

        if (yaExiste) {
            return res.redirect(`/perfil/${idUsuario}?error=Ya seguís a este usuario`);
        }

        await UsuarioSeguidor.create({ id_usuario: idUsuario, id_seguidor: idSeguidor });
        res.redirect(`/perfil/${idUsuario}?exito=Ahora seguís a este usuario`);

    } catch (error) {
        console.error(error);
        res.redirect(`/perfil/${idUsuario}?error=Error al seguir usuario`);
    }
};

// Dejar de seguir
const dejarDeSeguir = async (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');

    const idUsuario = parseInt(req.params.id, 10);
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