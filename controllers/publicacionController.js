const Publicacion = require('../models/Publicacion');
const Imagen = require('../models/Imagen');
const Etiqueta = require('../models/Etiqueta');
const sequelize = require('../db/sequelize');
const { QueryTypes } = require('sequelize');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

// ─── Multer ──────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const nombre = Date.now() + path.extname(file.originalname);
        cb(null, nombre);
    }
});

const fileFilter = (req, file, cb) => {
    const tiposPermitidos = /jpeg|jpg|png|gif|webp/;
    const mimeValido = tiposPermitidos.test(file.mimetype);
    const extValida = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
    if (mimeValido && extValida) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (jpg, png, gif, webp)'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter
});

// ─── Error handler Multer ────────────────────────────────
const manejarErrorMulter = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.render('publicacion/nueva', {
                error: 'La imagen no puede superar 5MB',
                usuario: req.session.usuario
            });
        }
        return res.render('publicacion/nueva', {
            error: 'Error al subir la imagen',
            usuario: req.session.usuario
        });
    } else if (err) {
        return res.render('publicacion/nueva', {
            error: err.message,
            usuario: req.session.usuario
        });
    }
    next();
};

// ─── Mostrar formulario nueva ────────────────────────────
const mostrarFormulario = (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');
    res.render('publicacion/nueva', { usuario: req.session.usuario });
};

// ─── Crear publicacion ───────────────────────────────────
const crearPublicacion = async (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');

    const { titulo, descripcion, etiquetas, licencia, marca_de_agua, texto_marca } = req.body;

    const renderError = (msg) => res.render('publicacion/nueva', {
        error: msg,
        usuario: req.session.usuario,
        valores: { titulo, descripcion, etiquetas, licencia, texto_marca }
    });

    // ─── Validaciones ────────────────────────────────────
    if (!titulo || titulo.trim() === '') {
        return renderError('El título es obligatorio');
    }

    if (!req.files || req.files.length === 0) {
        return renderError('Debés subir al menos una imagen (jpg, png, gif, webp)');
    }

    if (!etiquetas || etiquetas.trim() === '') {
        return renderError('Debés ingresar al menos una etiqueta');
    }

    const tags = etiquetas.split(',').map(t => t.trim().toLowerCase()).filter(t => t !== '');
    if (tags.length === 0) {
        return renderError('Debés ingresar al menos una etiqueta válida');
    }

    try {
        const publicacion = await Publicacion.create({
            titulo: titulo.trim(),
            descripcion: descripcion || null,
            id_creador: req.session.usuario.id
        });

        for (const file of req.files) {
            const metadata = await sharp(file.path).metadata();
            await Imagen.create({
                foto: '/uploads/' + file.filename,
                ancho: metadata.width,
                altura: metadata.height,
                licencia: licencia || 'sin_copyright',
                marca_de_agua: marca_de_agua === 'true',
                texto_marca: texto_marca || null,
                id_publicacion: publicacion.id_publicacion
            });
        }

        for (const nombre of tags) {
            const [etiqueta] = await Etiqueta.findOrCreate({ where: { nombre_etiqueta: nombre } });
            await sequelize.query(
                'INSERT INTO publicacion_etiqueta (id_publicacion, id_etiqueta) VALUES (:pub, :etiq)',
                { replacements: { pub: publicacion.id_publicacion, etiq: etiqueta.id_etiqueta } }
            );
        }

        res.redirect('/home?exito=Publicación creada exitosamente');

    } catch (error) {
        console.error(error);
        renderError('Error al crear la publicación');
    }
};

// ─── Mostrar formulario editar ───────────────────────────
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

// ─── Guardar edición ─────────────────────────────────────
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

        // ─── Validaciones ────────────────────────────────
        if (!titulo || titulo.trim() === '') {
            const imagenes = await Imagen.findAll({ where: { id_publicacion: idPublicacion } });
            return res.render('publicacion/editar', {
                error: 'El título es obligatorio',
                usuario: req.session.usuario,
                publicacion,
                imagenes,
                etiquetas
            });
        }

        if (!etiquetas || etiquetas.trim() === '') {
            const imagenes = await Imagen.findAll({ where: { id_publicacion: idPublicacion } });
            return res.render('publicacion/editar', {
                error: 'Debés ingresar al menos una etiqueta',
                usuario: req.session.usuario,
                publicacion,
                imagenes,
                etiquetas
            });
        }

        await publicacion.update({ titulo: titulo.trim(), descripcion: descripcion || null });

        if (req.files && req.files.length > 0) {
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
            const tags = etiquetas.split(',').map(t => t.trim().toLowerCase()).filter(t => t !== '');
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
        res.redirect(`/perfil/${idUsuario}?error=Error al editar la publicación`);
    }
};

module.exports = { mostrarFormulario, crearPublicacion, upload, manejarErrorMulter, mostrarEditar, editarPublicacion };