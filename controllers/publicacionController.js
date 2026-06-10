const Publicacion = require('../models/Publicacion');
const Imagen = require('../models/Imagen');
const Etiqueta = require('../models/etiqueta');
const sequelize = require('../db/sequelize');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

// ─── Multer en memoria ────────────────────────────────────
const storage = multer.memoryStorage();

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

// ─── Helper: construir src base64 desde imagen ───────────
const construirSrc = (imagen) => {
    if (!imagen.datos) return imagen.foto;
    const buffer = Buffer.isBuffer(imagen.datos)
        ? imagen.datos
        : Buffer.from(imagen.datos);
    const mimeType = imagen.foto && imagen.foto.startsWith('data:')
        ? imagen.foto.split(';')[0].replace('data:', '')
        : 'image/jpeg';
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
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

    if (!titulo || titulo.trim() === '') return renderError('El título es obligatorio');
    if (!req.files || req.files.length === 0) return renderError('Debés subir al menos una imagen (jpg, png, gif, webp)');
    if (!etiquetas || etiquetas.trim() === '') return renderError('Debés ingresar al menos una etiqueta');

    const tags = etiquetas.split(',').map(t => t.trim().toLowerCase()).filter(t => t !== '');
    if (tags.length === 0) return renderError('Debés ingresar al menos una etiqueta válida');

    try {
        const publicacion = await Publicacion.create({
            titulo: titulo.trim(),
            descripcion: descripcion || null,
            id_creador: req.session.usuario.id
        });

        for (const file of req.files) {
            let buffer = file.buffer;
            const metadata = await sharp(buffer).metadata();
            const mimeType = file.mimetype;

            // ─── Marca de agua con Sharp ─────────────────
            if (licencia === 'copyright' && marca_de_agua === 'true' && texto_marca) {
                const svgMarca = Buffer.from(`
                    <svg width="${metadata.width}" height="${metadata.height}">
                        <text x="50%" y="90%" text-anchor="middle" font-size="36"
                            font-family="Arial" fill="rgba(255,255,255,0.65)"
                            stroke="rgba(0,0,0,0.3)" stroke-width="1"
                        >${texto_marca.trim()}</text>
                    </svg>
                `);
                buffer = await sharp(buffer)
                    .composite([{ input: svgMarca, top: 0, left: 0 }])
                    .toBuffer();
            }

            await Imagen.create({
                foto: mimeType,          
                datos: buffer,           
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

module.exports = { mostrarFormulario, crearPublicacion, upload, manejarErrorMulter, construirSrc };