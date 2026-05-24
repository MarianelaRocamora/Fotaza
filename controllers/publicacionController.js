const Publicacion = require('../models/Publicacion');
const Imagen = require('../models/Imagen');
const Etiqueta = require('../models/Etiqueta');
const sequelize = require('../db/sequelize');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

// Configurar multer para subir imágenes
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
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
    fileFilter
});

// Middleware para manejar errores de multer
const manejarErrorMulter = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.render('publicacion/nueva', { error: 'La imagen no puede superar 5MB' });
        }
        return res.render('publicacion/nueva', { error: 'Error al subir la imagen' });
    } else if (err) {
        return res.render('publicacion/nueva', { error: err.message });
    }
    next();
};

// Mostrar formulario de nueva publicacion
const mostrarFormulario = (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');
    res.render('publicacion/nueva');
};

// Crear publicacion
const crearPublicacion = async (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');

    const { titulo, descripcion, etiquetas, licencia, marca_de_agua, texto_marca } = req.body;

    // Validar que se subió al menos una imagen
    if (!req.files || req.files.length === 0) {
        return res.render('publicacion/nueva', { error: 'Debés subir al menos una imagen (jpg, png, gif, webp)' });
    }

    try {
        // Crear la publicacion
        const publicacion = await Publicacion.create({
            titulo,
            descripcion,
            id_creador: req.session.usuario.id
        });

        // Guardar cada imagen subida
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
            
        // Guardar etiquetas
        if (etiquetas) {
            const tags = etiquetas.split(',').map(t => t.trim().toLowerCase());
            for (const nombre of tags) {
                const [etiqueta] = await Etiqueta.findOrCreate({
                    where: { nombre_etiqueta: nombre }
                });
                await sequelize.query(
                    'INSERT INTO publicacion_etiqueta (id_publicacion, id_etiqueta) VALUES (:pub, :etiq)',
                    { replacements: { pub: publicacion.id_publicacion, etiq: etiqueta.id_etiqueta } }
                );    
            }
        }

        res.redirect('/home?exito=Publicación creada exitosamente');

    } catch (error) {
        console.error(error);
        res.render('publicacion/nueva', { error: 'Error al crear la publicación' });
    }
};

module.exports = { mostrarFormulario, crearPublicacion, upload, manejarErrorMulter };