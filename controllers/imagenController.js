const Imagen = require('../models/Imagen');

const cerrarComentarios = async (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');

    const idImagen = parseInt(req.params.id, 10);
    const idUsuario = parseInt(req.session.usuario.id, 10);

    try {
        // Verificar que el usuario es el autor de la publicación
        const imagen = await Imagen.findOne({
            where: { id_imagen: idImagen },
            include: [{
                association: 'publicacion',
                where: { id_creador: idUsuario }
            }]
        });
        
        if (!imagen) {
            return res.redirect('/home?error=No tenés permiso para hacer esto');
        }

        await Imagen.update(
        { comentario_clausurado: true },
        { where: { id_imagen: idImagen } }
        );
        res.redirect(`/perfil/${idUsuario}?exito=Comentarios cerrados`);

    } catch (error) {
        console.error(error);
        res.redirect('/home?error=Error al cerrar comentarios');
    }
};

const abrirComentarios = async (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');

    const idImagen = parseInt(req.params.id, 10);
    const idUsuario = parseInt(req.session.usuario.id, 10);

    try {
        const imagen = await Imagen.findOne({
            where: { id_imagen: idImagen },
            include: [{
                association: 'publicacion',
                where: { id_creador: idUsuario }
            }]
        });

        if (!imagen) {
            return res.redirect('/home?error=No tenés permiso para hacer esto');
        }

        await imagen.update({ comentario_clausurado: false });
        res.redirect(`/perfil/${idUsuario}?exito=Comentarios abiertos`);

    } catch (error) {
        console.error(error);
        res.redirect('/home?error=Error al abrir comentarios');
    }
};

module.exports = { cerrarComentarios, abrirComentarios };