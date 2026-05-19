const Publicacion = require('../models/Publicacion');
const Imagen = require('../models/Imagen');
const Etiqueta = require('../models/Etiqueta');
const sequelize = require('../db/sequelize');
const multer = require('multer');
const path = require('path');

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

const upload = multer({ storage });

// Mostrar formulario de nueva publicacion
const mostrarFormulario = (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');
    res.render('publicacion/nueva');
};

// Crear publicacion
const crearPublicacion = async (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');

    const { titulo, descripcion, etiquetas, licencia, marca_de_agua, texto_marca } = req.body;

    try {
        // Crear la publicacion
        const publicacion = await Publicacion.create({
            titulo,
            descripcion,
            id_creador: req.session.usuario.id
        });

        // Guardar cada imagen subida
        for (const file of req.files) {
            const imagen = await Imagen.create({
                foto: '/uploads/' + file.filename,
                licencia: licencia || 'sin_copyright',
                marca_de_agua: marca_de_agua === 'true',
                texto_marca: texto_marca || null
            });

            // Asociar imagen a publicacion
            await sequelize.query(
                'INSERT INTO publicacion_imagen (id_publicacion, id_imagen) VALUES (:pub, :img)',
                { replacements: { pub: publicacion.id_publicacion, img: imagen.id_imagen } }
            );
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

        res.redirect('/home?exito=1');

    } catch (error) {
        console.error(error);
        res.render('publicacion/nueva', { error: 'Error al crear la publicación' });
    }
};

module.exports = { mostrarFormulario, crearPublicacion, upload };