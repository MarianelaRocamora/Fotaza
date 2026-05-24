const Voto = require('../models/Voto');
const sequelize = require('../db/sequelize');

const votar = async (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');

    const { id_imagen, valoracion } = req.body;
    const idImagen = parseInt(id_imagen, 10);
    const valoracionNum = parseInt(valoracion, 10);
    const id_votante = parseInt(req.session.usuario.id, 10);

    try {
        const esAutor = await sequelize.query(`
            SELECT p.id_creador 
            FROM publicacion p
            JOIN publicacion_imagen pi ON p.id_publicacion = pi.id_publicacion
            WHERE pi.id_imagen = :id_imagen
        `, {
            replacements: { id_imagen: idImagen },
            type: sequelize.QueryTypes.SELECT
        });

        if (esAutor.length > 0 && parseInt(esAutor[0].id_creador, 10) === id_votante) {
            return res.redirect('/home?error=No podés votar tu propia imagen');
        }

        const yaVoto = await Voto.findOne({
            where: { id_votante, id_imagen }
        });

        if (yaVoto) {
            return res.redirect('/home?error=Ya votaste esta imagen');
        }

        // Guardar voto
         await Voto.create({
            valoracion: valoracionNum,
            id_votante,
            id_imagen: idImagen
        });

        res.redirect('/home?exito=Voto registrado');

    } catch (error) {
        console.error(error);
        res.redirect('/home?error=Error al votar');
    }
};

module.exports = { votar };