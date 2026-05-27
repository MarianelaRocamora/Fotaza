const Publicacion = require('../models/Publicacion');
const Imagen = require('../models/Imagen');
const Etiqueta = require('../models/Etiqueta');
const sequelize = require('../db/sequelize');
const { QueryTypes } = require('sequelize');
const sharp = require('sharp');

// Mostrar formulario de edición
const mostrarEditar = async (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');

    const idPublicacion = parseInt(req.params.id, 10);
    const idUsuario = parseInt(req.session.usuario.id, 10);

    try {
        const publicacion = await Publicacion.findOne({
            where: { id_publicacion: idPublicacion, id_creador: idUsuario }
        });

        if (!publicacion) {
            return res.redirect('/home?error=No tenés permiso para editar esta publicación');
        }

        const tieneDenuncias = await sequelize.query(`
            SELECT COUNT(*) as total FROM denuncia d
            JOIN imagen i ON d.id_imagen = i.id_imagen
            WHERE i.id_publicacion = :idPublicacion
        `, { replacements: { idPublicacion }, type: QueryTypes.SELECT });

        if (parseInt(tieneDenuncias[0].total) > 0) {
            return res.redirect(`/perfil/${idUsuario}?error=No podés editar una publicación con denuncias`);
        }

        const imagenes = await Imagen.findAll({ where: { id_publicacion: idPublicacion } });

        const etiquetas = await sequelize.query(`
            SELECT e.nombre_etiqueta FROM etiqueta e
            JOIN publicacion_etiqueta pe ON e.id_etiqueta = pe.id_etiqueta
            WHERE pe.id_publicacion = :idPublicacion
        `, { replacements: { idPublicacion }, type: QueryTypes.SELECT });

        res.render('publicacion/editar', {
            usuario: req.session.usuario,
            publicacion,
            imagenes,
            etiquetas: etiquetas.map(e => e.nombre_etiqueta).join(', ')
        });

    } catch (error) {
        console.error(error);
        res.redirect('/home?error=Error al cargar la publicación');
    }
};

// Guardar edición
const editarPublicacion = async (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');

    const idPublicacion = parseInt(req.params.id, 10);
    const idUsuario = parseInt(req.session.usuario.id, 10);
    const { titulo, descripcion, etiquetas, licencia, marca_de_agua, texto_marca } = req.body;

    try {
        const publicacion = await Publicacion.findOne({
            where: { id_publicacion: idPublicacion, id_creador: idUsuario }
        });

        if (!publicacion) {
            return res.redirect('/home?error=No tenés permiso');
        }

        const tieneDenuncias = await sequelize.query(`
            SELECT COUNT(*) as total FROM denuncia d
            JOIN imagen i ON d.id_imagen = i.id_imagen
            WHERE i.id_publicacion = :idPublicacion
        `, { replacements: { idPublicacion }, type: QueryTypes.SELECT });

        if (parseInt(tieneDenuncias[0].total) > 0) {
            return res.redirect(`/perfil/${idUsuario}?error=No podés editar una publicación con denuncias`);
        }

        await publicacion.update({ titulo, descripcion });

        if (req.files && req.files.length > 0) {
            const imagenesViejas = await Imagen.findAll({ where: { id_publicacion: idPublicacion } });
            const idsViejos = imagenesViejas.map(i => i.id_imagen);

            if (idsViejos.length > 0) {
                await sequelize.query('DELETE FROM voto WHERE id_imagen IN (:ids)', { replacements: { ids: idsViejos } });
                await sequelize.query('DELETE FROM comentario WHERE id_imagen IN (:ids)', { replacements: { ids: idsViejos } });
                await Imagen.destroy({ where: { id_publicacion: idPublicacion } });
            }

            for (const file of req.files) {
                const metadata = await sharp(file.path).metadata();
                await Imagen.create({
                    foto: '/uploads/' + file.filename,
                    ancho: metadata.width,
                    altura: metadata.height,
                    licencia: licencia || 'sin_copyright',
                    marca_de_agua: marca_de_agua === 'true',
                    texto_marca: texto_marca || null,
                    id_publicacion: idPublicacion
                });
            }
        }

        if (etiquetas) {
            await sequelize.query('DELETE FROM publicacion_etiqueta WHERE id_publicacion = :idPublicacion',
                { replacements: { idPublicacion } });
            const tags = etiquetas.split(',').map(t => t.trim().toLowerCase());
            for (const nombre of tags) {
                const [etiqueta] = await Etiqueta.findOrCreate({ where: { nombre_etiqueta: nombre } });
                await sequelize.query(
                    'INSERT INTO publicacion_etiqueta (id_publicacion, id_etiqueta) VALUES (:pub, :etiq)',
                    { replacements: { pub: idPublicacion, etiq: etiqueta.id_etiqueta } }
                );
            }
        }

        res.redirect(`/perfil/${idUsuario}?exito=Publicación actualizada`);

    } catch (error) {
        console.error(error);
        res.redirect(`/perfil/${idUsuario}?error=Error al editar`);
    }
};

module.exports = { mostrarEditar, editarPublicacion };