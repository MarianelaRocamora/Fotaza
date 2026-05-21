const Comentario = require('../models/Comentario');
const Imagen = require('../models/Imagen');

const comentar = async (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');

    const { texto, id_imagen } = req.body;
    const id_comentador = parseInt(req.session.usuario.id, 10);
    const idImagen = parseInt(id_imagen, 10);

    if (!texto || texto.trim() === '') {
        return res.redirect('/home?error=El comentario no puede estar vacío');
    }

    try {
        const imagen = await Imagen.findByPk(idImagen);

        if (!imagen) {
            return res.redirect('/home?error=Imagen no encontrada');
        }

        if (imagen.comentario_clausurado) {
            return res.redirect('/home?error=Los comentarios están cerrados para esta imagen');
        }

        await Comentario.create({
            texto: texto.trim(),
            id_comentador,
            id_imagen: idImagen
        });

        res.redirect('/home?exito=Comentario publicado');

    } catch (error) {
        console.error(error);
        res.redirect('/home?error=Error al comentar');
    }
};

module.exports = { comentar };