const Comentario = require('../models/Comentario');
const Imagen = require('../models/Imagen');

const comentar = async (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');

    const { texto, id_imagen , redirect_to } = req.body;
    console.log('redirect_to:', redirect_to);
    const id_comentador = parseInt(req.session.usuario.id, 10);
    const idImagen = parseInt(id_imagen, 10);

    if (!texto || texto.trim() === '') {
        return res.redirect('/home?error=El comentario no puede estar vacío');
    }

    try {
        const imagen = await Imagen.findByPk(idImagen);

        if (!imagen) {
            return res.redirect(`${redirect_to || '/home'}?error=Imagen no encontrada`);
        }

        if (imagen.comentario_clausurado) {
            return res.redirect(`${redirect_to || '/home'}?error=Los comentarios están cerrados`);
        }

        await Comentario.create({
            texto: texto.trim(),
            id_comentador,
            id_imagen: idImagen
        });

        res.redirect(`${redirect_to || '/home'}?exito=Comentario publicado`);

    } catch (error) {
        console.error(error);
        res.redirect(`${redirect_to || '/home'}?error=Error al comentar`);
    }
};

module.exports = { comentar };