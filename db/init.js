require('dotenv').config();
const sequelize = require('./sequelize');
const bcrypt = require('bcrypt');

const Usuario        = require('../models/Usuario');
const Publicacion    = require('../models/Publicacion');
const Etiqueta       = require('../models/Etiqueta');
const Imagen         = require('../models/Imagen');
const Voto           = require('../models/Voto');
const Comentario     = require('../models/Comentario');
const UsuarioSeguidor = require('../models/UsuarioSeguidor');

// Tabla intermedia sin timestamps
sequelize.define('publicacion_etiqueta', {}, {
    tableName: 'publicacion_etiqueta',
    timestamps: false,
});

async function init() {
    try {
        console.log('🔄 Conectando a PostgreSQL...');
        await sequelize.authenticate();
        console.log('✅ Conexión establecida.');

        console.log('🔄 Sincronizando modelos...');
        await sequelize.sync({ force: false });
        console.log('✅ Tablas sincronizadas.');

        // ─── Solo inserta si la BD está vacía ────────────
        const yaHayUsuarios = await Usuario.count();
        if (yaHayUsuarios > 0) {
            console.log('ℹ️  Ya existen datos, se omite el seed.');
            console.log('\n👤 Usuarios de prueba:');
            console.log('   Moderador → admin@fotaza.com  / admin123');
            console.log('   Usuario 1 → juan@fotaza.com   / juan123');
            console.log('   Usuario 2 → maria@fotaza.com  / maria123');
            return;
        }

        console.log('🔄 Insertando datos de prueba...');

        const hash = (pw) => bcrypt.hash(pw, 10);

        // ─── Usuarios ────────────────────────────────────
        const [admin, juan, maria] = await Usuario.bulkCreate([
            {
                nombre: 'Admin',
                apellido: 'Fotaza',
                correo: 'admin@fotaza.com',
                contrasena: await hash('admin123'),
                es_moderador: true,
                estado: 'activo',
                bio: 'Moderador de la plataforma Fotaza.'
            },
            {
                nombre: 'Juan',
                apellido: 'Pérez',
                correo: 'juan@fotaza.com',
                contrasena: await hash('juan123'),
                es_moderador: false,
                estado: 'activo',
                bio: 'Fotógrafo aficionado. Me gustan los paisajes y la naturaleza.'
            },
            {
                nombre: 'María',
                apellido: 'González',
                correo: 'maria@fotaza.com',
                contrasena: await hash('maria123'),
                es_moderador: false,
                estado: 'activo',
                bio: 'Apasionada por la fotografía urbana y los retratos.'
            },
        ], { returning: true });

        console.log('✅ Usuarios creados.');

        // ─── Seguimiento de prueba ────────────────────────
        await UsuarioSeguidor.create({ id_usuario: juan.id_usuario, id_seguidor: maria.id_usuario });
        await UsuarioSeguidor.create({ id_usuario: maria.id_usuario, id_seguidor: juan.id_usuario });
        console.log('✅ Seguimientos creados.');

        // ─── Etiquetas ────────────────────────────────────
        const [tagNaturaleza] = await Etiqueta.findOrCreate({ where: { nombre_etiqueta: 'naturaleza' } });
        const [tagPaisaje]    = await Etiqueta.findOrCreate({ where: { nombre_etiqueta: 'paisaje' } });
        const [tagCiudad]     = await Etiqueta.findOrCreate({ where: { nombre_etiqueta: 'ciudad' } });
        const [tagFoto]       = await Etiqueta.findOrCreate({ where: { nombre_etiqueta: 'fotografía' } });

        // ─── Publicaciones de prueba ──────────────────────
        const pub1 = await Publicacion.create({
            titulo: 'Atardecer en las sierras',
            descripcion: 'Una tarde mágica en las sierras de Córdoba.',
            id_creador: juan.id_usuario
        });
        await sequelize.query(
            'INSERT INTO publicacion_etiqueta (id_publicacion, id_etiqueta) VALUES (:pub, :etiq)',
            { replacements: { pub: pub1.id_publicacion, etiq: tagNaturaleza.id_etiqueta } }
        );
        await sequelize.query(
            'INSERT INTO publicacion_etiqueta (id_publicacion, id_etiqueta) VALUES (:pub, :etiq)',
            { replacements: { pub: pub1.id_publicacion, etiq: tagPaisaje.id_etiqueta } }
        );

        const img1 = await Imagen.create({
            foto: '/uploads/.placeholder',
            ancho: 800,
            altura: 600,
            licencia: 'sin_copyright',
            marca_de_agua: false,
            id_publicacion: pub1.id_publicacion
        });

        const pub2 = await Publicacion.create({
            titulo: 'Calles de Buenos Aires',
            descripcion: 'La ciudad que nunca duerme, capturada al amanecer.',
            id_creador: maria.id_usuario
        });
        await sequelize.query(
            'INSERT INTO publicacion_etiqueta (id_publicacion, id_etiqueta) VALUES (:pub, :etiq)',
            { replacements: { pub: pub2.id_publicacion, etiq: tagCiudad.id_etiqueta } }
        );
        await sequelize.query(
            'INSERT INTO publicacion_etiqueta (id_publicacion, id_etiqueta) VALUES (:pub, :etiq)',
            { replacements: { pub: pub2.id_publicacion, etiq: tagFoto.id_etiqueta } }
        );

        const img2 = await Imagen.create({
            foto: '/uploads/.placeholder',
            ancho: 1200,
            altura: 800,
            licencia: 'copyright',
            marca_de_agua: true,
            texto_marca: '© María González 2026',
            id_publicacion: pub2.id_publicacion
        });

        console.log('✅ Publicaciones e imágenes creadas.');

        // ─── Votos de prueba ──────────────────────────────
        await Voto.create({ valoracion: 5, id_votante: maria.id_usuario, id_imagen: img1.id_imagen });
        await Voto.create({ valoracion: 4, id_votante: admin.id_usuario, id_imagen: img1.id_imagen });
        await Voto.create({ valoracion: 5, id_votante: juan.id_usuario,  id_imagen: img2.id_imagen });
        console.log('✅ Votos creados.');

        // ─── Comentarios de prueba ────────────────────────
        await Comentario.create({
            texto: '¡Qué foto tan hermosa! Los colores son increíbles.',
            id_comentador: maria.id_usuario,
            id_imagen: img1.id_imagen
        });
        await Comentario.create({
            texto: 'Me encanta esta toma, muy bien lograda.',
            id_comentador: admin.id_usuario,
            id_imagen: img1.id_imagen
        });
        await Comentario.create({
            texto: 'Buenos Aires siempre tan fotogénica.',
            id_comentador: juan.id_usuario,
            id_imagen: img2.id_imagen
        });
        console.log('✅ Comentarios creados.');

        console.log('\n🎉 Base de datos inicializada correctamente.');
        console.log('\n👤 Usuarios de prueba:');
        console.log('   Moderador → admin@fotaza.com  / admin123');
        console.log('   Usuario 1 → juan@fotaza.com   / juan123');
        console.log('   Usuario 2 → maria@fotaza.com  / maria123');
        console.log('\n▶️  Ejecutá "npm start" para iniciar la app.');

    } catch (error) {
        console.error('❌ Error al inicializar la BD:', error);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

init();