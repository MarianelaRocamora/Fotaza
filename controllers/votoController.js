const Voto = require('../models/Voto');
const { QueryTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const votar = async (req, res) => {
    const { id_imagen, valoracion, redirect_to } = req.body;
    const idImagen = parseInt(id_imagen, 10);
    const valoracionNum = parseInt(valoracion, 10);
    const id_votante = parseInt(req.session.usuario.id, 10);
    const destino = redirect_to || '/home';

    try {
        // ─── Verificar que no sea el autor ───────────────
        const esAutor = await sequelize.query(`
            SELECT p.id_creador 
            FROM publicacion p
            JOIN imagen i ON i.id_publicacion = p.id_publicacion
            WHERE i.id_imagen = :id_imagen
        `, {
            replacements: { id_imagen: idImagen },
            type: QueryTypes.SELECT
        });

        if (esAutor.length > 0 && parseInt(esAutor[0].id_creador, 10) === id_votante) {
            return res.redirect(`${destino}?error=No podés votar tu propia imagen`);
        }

        // ─── Verificar voto duplicado ─────────────────────
        const yaVoto = await Voto.findOne({
            where: { id_votante, id_imagen: idImagen }
        });

        if (yaVoto) {
            return res.redirect(`${destino}?error=Ya votaste esta imagen`);
        }

        await Voto.create({ valoracion: valoracionNum, id_votante, id_imagen: idImagen });
        res.redirect(`${destino}?exito=Voto registrado`);

    } catch (error) {
        console.error(error);
        res.redirect(`${destino}?error=Error al votar`);
    }
};

module.exports = { votar };