const { QueryTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Imagen = require('../models/Imagen');

const buscar = async (req, res) => {
    const { q, etiqueta, autor, licencia, valoracion_min } = req.query;

    try {
        let condiciones = [`p.estado = 'activo'`];
        let replacements = {};

        if (q && q.trim() !== '') {
            condiciones.push(`p.titulo ILIKE :q`);
            replacements.q = `%${q.trim()}%`;
        }

        if (etiqueta && etiqueta.trim() !== '') {
            condiciones.push(`EXISTS (
                SELECT 1 FROM publicacion_etiqueta pe2
                JOIN etiqueta e2 ON pe2.id_etiqueta = e2.id_etiqueta
                WHERE pe2.id_publicacion = p.id_publicacion
                AND e2.nombre_etiqueta ILIKE :etiqueta
            )`);
            replacements.etiqueta = `%${etiqueta.trim()}%`;
        }

        if (autor && autor.trim() !== '') {
            condiciones.push(`(
                u.nombre ILIKE :autor 
                OR u.apellido ILIKE :autor
                OR CONCAT(u.nombre, ' ', u.apellido) ILIKE :autor
            )`);
            replacements.autor = `%${autor.trim()}%`;
        }

        if (licencia && licencia !== '') {
            condiciones.push(`EXISTS (
                SELECT 1 FROM imagen i2
                WHERE i2.id_publicacion = p.id_publicacion
                AND i2.licencia = :licencia
            )`);
            replacements.licencia = licencia;
        }

        const where = condiciones.join(' AND ');

        const having = (valoracion_min && valoracion_min !== '')
            ? `HAVING COALESCE(AVG(v.valoracion), 0) >= ${parseFloat(valoracion_min)}`
            : '';

        // ─── Query agrupada por publicación ──────────────
        const pubs = await sequelize.query(`
            SELECT 
                p.id_publicacion, p.titulo, p.descripcion, p.fecha_publicacion,
                u.id_usuario, u.nombre AS nombre_autor, u.apellido AS apellido_autor,
                COALESCE(AVG(v.valoracion), 0) AS promedio,
                COUNT(DISTINCT v.id_voto) AS total_votos,
                STRING_AGG(DISTINCT e.nombre_etiqueta, ', ') AS etiquetas
            FROM publicacion p
            JOIN usuario u ON p.id_creador = u.id_usuario
            LEFT JOIN imagen i ON i.id_publicacion = p.id_publicacion
            LEFT JOIN voto v ON v.id_imagen = i.id_imagen
            LEFT JOIN publicacion_etiqueta pe ON pe.id_publicacion = p.id_publicacion
            LEFT JOIN etiqueta e ON e.id_etiqueta = pe.id_etiqueta
            WHERE ${where}
            GROUP BY p.id_publicacion, u.id_usuario, u.nombre, u.apellido
            ${having}
            ORDER BY promedio DESC, p.fecha_publicacion DESC
            LIMIT 20
        `, { replacements, type: QueryTypes.SELECT });

        // ─── Agregar imágenes a cada publicación ─────────
        const resultados = await Promise.all(pubs.map(async (pub) => {
            const imagenes = await Imagen.findAll({
                where: { id_publicacion: pub.id_publicacion },
                order: [['fecha_subida', 'ASC']],
                raw: true
            });
            return { ...pub, imagenes };
        }));

        res.render('busqueda', {
            usuario: req.session.usuario || null,
            resultados,
            filtros: { q, etiqueta, autor, licencia, valoracion_min }
        });

    } catch (error) {
        console.error(error);
        res.render('busqueda', {
            usuario: req.session.usuario || null,
            resultados: [],
            filtros: { q, etiqueta, autor, licencia, valoracion_min },
            error: 'Error al buscar'
        });
    }
};

module.exports = { buscar };